<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductTranslation;

class ProductController extends Controller
{
    public function getInfoByID($id)
    {
        $product = Product::with('description')
            ->findOrFail($id);

        return response()->json($product);
    }

    public function getInfoByFriendlyUrl($locale, $friendly_url)
    {
        $product = Product::where('product_friendly_url', $friendly_url)
            ->with([
                'translations' => function ($query) use ($locale) {
                    $query->where('language_code', $locale);
                }
            ])
            ->firstOrFail();

        $product->translation = $product->translations->first();
        unset($product->translations);

        return response()->json($product);
    }
}
