<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductTranslation extends Model
{
    protected $table = 'product_translations';

    protected $primaryKey = 'product_translations_id';

    public $timestamps = false;

    protected $fillable = [
        'products_id',
        'product_name',
        'product_description',
        'product_friendly_url',
        'language_code',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class , 'products_id', 'products_id');
    }
}
