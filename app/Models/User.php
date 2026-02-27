<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'gender',
        'date_of_birth',
        'points_balance',
        'credits_balance',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'date_of_birth' => 'date',
            'points_balance' => 'integer',
            'credits_balance' => 'decimal:2',
        ];
    }

    /* ── Relationships ─────────────────────────────────────────────────── */

    public function addresses()
    {
        return $this->hasMany(UserAddress::class)
            ->orderByDesc('is_default')
            ->orderBy('created_at');
    }

    public function pointTransactions()
    {
        return $this->hasMany(PointTransaction::class)->latest();
    }

    public function creditTransactions()
    {
        return $this->hasMany(CreditTransaction::class)->latest();
    }

    /* ── Points helpers ─────────────────────────────────────────────────── */

    /**
     * Add points to the user's balance and log the transaction.
     *
     * Usage: $user->addPoints(150, 'Earned from order #42', 'order', 42);
     */
    public function addPoints(int $points, string $note = '', ?string $refType = null, ?int $refId = null): PointTransaction
    {
        return DB::transaction(function () use ($points, $note, $refType, $refId) {
            $this->increment('points_balance', $points);
            $this->refresh();

            return $this->pointTransactions()->create([
                'type' => 'earn',
                'points' => $points,
                'balance_after' => $this->points_balance,
                'reference_type' => $refType,
                'reference_id' => $refId,
                'note' => $note,
            ]);
        });
    }

    /**
     * Redeem (deduct) points from the user's balance.
     *
     * @throws \RuntimeException if insufficient points
     */
    public function redeemPoints(int $points, string $note = '', ?string $refType = null, ?int $refId = null): PointTransaction
    {
        return DB::transaction(function () use ($points, $note, $refType, $refId) {
            $this->refresh();

            if ($this->points_balance < $points) {
                throw new \RuntimeException("Insufficient points balance.");
            }

            $this->decrement('points_balance', $points);
            $this->refresh();

            return $this->pointTransactions()->create([
                'type' => 'redeem',
                'points' => -$points,
                'balance_after' => $this->points_balance,
                'reference_type' => $refType,
                'reference_id' => $refId,
                'note' => $note,
            ]);
        });
    }

    /* ── Credits helpers ────────────────────────────────────────────────── */

    /**
     * Add credits (RM) to the user's wallet.
     *
     * @param  string  $type  'topup' | 'refund' | 'adjust'
     *
     * Usage: $user->addCredits(20.00, 'refund', 'Refund for order #55', 'order', 55);
     */
    public function addCredits(float $amount, string $type = 'topup', string $note = '', ?string $refType = null, ?int $refId = null): CreditTransaction
    {
        return DB::transaction(function () use ($amount, $type, $note, $refType, $refId) {
            $this->increment('credits_balance', $amount);
            $this->refresh();

            return $this->creditTransactions()->create([
                'type' => $type,
                'amount' => $amount,
                'balance_after' => $this->credits_balance,
                'reference_type' => $refType,
                'reference_id' => $refId,
                'note' => $note,
            ]);
        });
    }

    /**
     * Deduct credits from the user's wallet (e.g. to pay for an order).
     *
     * @throws \RuntimeException if insufficient credits
     */
    public function deductCredits(float $amount, string $note = '', ?string $refType = null, ?int $refId = null): CreditTransaction
    {
        return DB::transaction(function () use ($amount, $note, $refType, $refId) {
            $this->refresh();

            if ((float) $this->credits_balance < $amount) {
                throw new \RuntimeException("Insufficient credits balance.");
            }

            $this->decrement('credits_balance', $amount);
            $this->refresh();

            return $this->creditTransactions()->create([
                'type' => 'deduction',
                'amount' => -$amount,
                'balance_after' => $this->credits_balance,
                'reference_type' => $refType,
                'reference_id' => $refId,
                'note' => $note,
            ]);
        });
    }

    /* ── Conversion helper ──────────────────────────────────────────────── */

    /**
     * Convert a points amount to RM using the site setting 'points_per_ringgit'.
     * Default: 100 points = RM 1.00
     *
     * Usage: User::pointsToRinggit(500)  →  5.00
     */
    public static function pointsToRinggit(int $points): float
    {
        $rate = (int) optional(Setting::where('key', 'points_per_ringgit')->first())->value;
        $rate = $rate > 0 ? $rate : 100;

        return round($points / $rate, 2);
    }
}

