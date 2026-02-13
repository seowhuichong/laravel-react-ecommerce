<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';

    protected $primaryKey = 'products_id';

    public $timestamps = true;

    protected $fillable = [
        'product_sku',
        'product_barcode',
        'product_vendor',
        'product_price',
        'product_retail_price',
        'product_weight',
        'product_image',
        'product_status',
        'product_friendly_url'
    ];

    protected $casts = [
        'product_price' => 'decimal:2',
    ];

    public function translations()
    {
        return $this->hasMany(ProductTranslation::class, 'products_id', 'products_id');
    }
}
