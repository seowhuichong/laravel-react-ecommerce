<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class AdminProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with('translations')
            ->latest('products_id')
            ->paginate(20);

        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::with(['translations', 'categories.translations'])->findOrFail($id);
        return response()->json(['product' => $product]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_sku' => 'required|string|max:100|unique:products,product_sku',
            'product_barcode' => 'required|string|max:100',
            'product_vendor' => 'required|string|max:100',
            'product_price' => 'required|numeric|min:0',
            'product_retail_price' => 'required|numeric|min:0',
            'product_weight' => 'required|numeric|min:0',
            'product_image' => 'nullable|string|max:200',
            'product_status' => 'in:Active,Inactive',
            'product_friendly_url' => 'required|string|max:150|unique:products,product_friendly_url',
        ]);

        $product = Product::create($validated);

        return response()->json(['message' => 'Product created', 'product' => $product], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'product_sku' => 'sometimes|string|max:100|unique:products,product_sku,' . $id . ',products_id',
            'product_barcode' => 'sometimes|string|max:100',
            'product_vendor' => 'sometimes|string|max:100',
            'product_price' => 'sometimes|numeric|min:0',
            'product_retail_price' => 'sometimes|numeric|min:0',
            'product_weight' => 'sometimes|numeric|min:0',
            'product_image' => 'nullable|string|max:200',
            'product_status' => 'sometimes|in:Active,Inactive',
            'product_friendly_url' => 'sometimes|string|max:150|unique:products,product_friendly_url,' . $id . ',products_id',

            // Translations: optional object keyed by locale
            'translations' => 'sometimes|array',
            'translations.*.product_name' => 'sometimes|string|max:255',
            'translations.*.product_description' => 'sometimes|nullable|string',
            'translations.*.product_meta_title' => 'sometimes|nullable|string|max:255',
            'translations.*.product_meta_description' => 'sometimes|nullable|string|max:500',

            // Category linking
            'category_ids' => 'sometimes|array',
            'category_ids.*' => 'integer|exists:categories,id',
        ]);

        // Update core product fields (everything except translations + category_ids)
        $coreFields = collect($validated)->except(['translations', 'category_ids'])->toArray();
        if (!empty($coreFields)) {
            $product->update($coreFields);
        }

        // Upsert translations
        if (!empty($validated['translations'])) {
            foreach ($validated['translations'] as $locale => $fields) {
                $product->translations()->updateOrCreate(
                    ['language_code' => $locale],
                    array_filter($fields, fn($v) => $v !== null)
                );
            }
        }

        // Sync categories
        if (array_key_exists('category_ids', $validated)) {
            $product->categories()->sync($validated['category_ids']);
        }

        return response()->json([
            'message' => 'Product updated',
            'product' => $product->fresh(['translations', 'categories.translations']),
        ]);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Product deleted']);
    }
}
