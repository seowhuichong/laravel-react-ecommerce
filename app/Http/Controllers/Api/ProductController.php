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
        app()->setLocale($locale);

        $currentTranslation = ProductTranslation::where('product_friendly_url', $friendly_url)
            ->where('language_code', $locale)
            ->firstOrFail();

        $allTranslations = ProductTranslation::where('products_id', $currentTranslation->products_id)
            ->get(['language_code', 'product_friendly_url'])
            ->pluck('product_friendly_url', 'language_code');

        $productData = $currentTranslation->load('product');

        return response()->json([
            'product' => $productData,
            'slugs' => $allTranslations
        ]);
    }
}
