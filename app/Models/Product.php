<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';

    protected $primaryKey = 'products_id';

    public $timestamps = true;

    protected $fillable = [
        'product_friendly_url',
        'product_price',
        'product_image',
    ];

    protected $casts = [
        'product_price' => 'decimal:2',
    ];

    public function description()
    {
        return $this->hasOne(ProductTranslation::class, 'products_id', 'products_id')
            ->where('language_code', app()->getLocale());
    }
}
