<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAddress extends Model
{
    protected $table = 'user_addresses';
    protected $primaryKey = 'address_id';
    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'address_label',
        'recipient_name',
        'recipient_phone',
        'address_line1',
        'address_line2',
        'city',
        'state',
        'postcode',
        'country',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
