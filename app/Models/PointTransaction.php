<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PointTransaction extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'points',
        'balance_after',
        'reference_type',
        'reference_id',
        'note',
    ];

    protected $casts = [
        'points' => 'integer',
        'balance_after' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Convenience: is this a credit (earning) transaction?
     */
    public function isCredit(): bool
    {
        return $this->points > 0;
    }
}
