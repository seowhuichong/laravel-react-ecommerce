<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    /**
     * Return the full active category tree for the given locale.
     * Cached for 10 minutes.
     */
    public function index(Request $request, string $locale)
    {
        $tree = Cache::remember("categories.{$locale}", 600, function () use ($locale) {
            $roots = Category::active()
                ->roots()
                ->with([
                    'translations',
                    'children.translations',
                    'children.children.translations',
                ])
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get();

            return $this->formatTree($roots, $locale);
        });

        return response()->json(['categories' => $tree]);
    }

    /**
     * Show a category by slug — returns the category details, breadcrumb,
     * direct sub-categories, and a paginated list of products from this
     * category AND all its descendants.
     */
    public function show(Request $request, string $locale, string $slug)
    {
        $category = Category::with([
            'translations',
            'parent.translations',
            'parent.parent.translations',
            'children.translations',
        ])->where('slug', $slug)->firstOrFail();

        // Recursively collect all descendant category IDs (self included)
        $allIds = $this->collectDescendantIds($category->id);

        // Sort
        $sort = $request->query('sort', 'default'); // default | price_asc | price_desc | newest
        $perPage = 24;

        $query = Product::query()
            ->where('product_status', 'Active')
            ->whereHas('categories', fn($q) => $q->whereIn('categories.id', $allIds))
            ->with(['translations' => fn($q) => $q->where('language_code', $locale)]);

        match ($sort) {
            'price_asc' => $query->orderBy('product_price', 'asc'),
            'price_desc' => $query->orderBy('product_price', 'desc'),
            'newest' => $query->latest('products_id'),
            default => $query->orderBy('products_id', 'asc'),
        };

        $products = $query->paginate($perPage)->through(function (Product $p) use ($locale) {
            $t = $p->translations->first();
            return [
                'products_id' => $p->products_id,
                'product_sku' => $p->product_sku,
                'product_price' => $p->product_price,
                'product_retail_price' => $p->product_retail_price,
                'product_image' => $p->product_image,
                'product_friendly_url' => $p->product_friendly_url,
                'product_name' => $t?->product_name ?? $p->product_sku,
                'product_description' => $t?->product_description,
            ];
        })->values()->all();

        // Breadcrumb: root → ... → current
        $breadcrumb = $this->buildBreadcrumb($category, $locale);

        // Direct children for sub-category chips
        $subcategories = $category->children->map(fn(Category $c) => [
            'id' => $c->id,
            'slug' => $c->slug,
            'name' => $c->translation($locale),
        ])->values();

        return response()->json([
            'category' => [
                'id' => $category->id,
                'slug' => $category->slug,
                'name' => $category->translation($locale),
                'image' => $category->image,
            ],
            'breadcrumb' => $breadcrumb,
            'subcategories' => $subcategories,
            'products' => $products,
        ]);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    /** Collect self + all descendant IDs without lazy-loading the full tree. */
    private function collectDescendantIds(int $rootId): array
    {
        $ids = [$rootId];
        $queue = [$rootId];

        while (!empty($queue)) {
            $children = Category::whereIn('parent_id', $queue)->pluck('id')->all();
            $ids = array_merge($ids, $children);
            $queue = $children;
        }

        return array_unique($ids);
    }

    /** Build an ordered breadcrumb array from root to current category. */
    private function buildBreadcrumb(Category $category, string $locale): array
    {
        $crumbs = [];
        $current = $category;

        while ($current) {
            array_unshift($crumbs, [
                'slug' => $current->slug,
                'name' => $current->translation($locale),
            ]);
            $current = $current->parent ?? null;
        }

        return $crumbs;
    }

    /** Recursively format a collection of Category models into a plain array. */
    private function formatTree($categories, string $locale): array
    {
        return $categories->map(fn(Category $cat) => [
            'id' => $cat->id,
            'slug' => $cat->slug,
            'name' => $cat->translation($locale),
            'image' => $cat->image,
            'children' => $this->formatTree($cat->children, $locale),
        ])->values()->all();
    }
}
