<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CreditTransaction extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'amount',
        'balance_after',
        'reference_type',
        'reference_id',
        'note',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'balance_after' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Convenience: is this a credit (adding money) transaction?
     */
    public function isCredit(): bool
    {
        return $this->amount > 0;
    }
}
