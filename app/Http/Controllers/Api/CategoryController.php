<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    /**
     * Return the full active category tree for the given locale.
     * Cached for 10 minutes — clear with Cache::forget('categories.<locale>').
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
     * Recursively format a collection of Category models into a plain array.
     * Each node receives a `path` field like "Health › Vitamins › Vitamin C".
     */
    private function formatTree($categories, string $locale, string $parentPath = ''): array
    {
        return $categories->map(function (Category $cat) use ($locale, $parentPath) {
            $name = $cat->translation($locale);
            $path = $parentPath ? "{$parentPath} › {$name}" : $name;
            return [
                'id' => $cat->id,
                'slug' => $cat->slug,
                'name' => $name,
                'path' => $path,
                'image' => $cat->image,
                'children' => $this->formatTree($cat->children, $locale, $path),
            ];
        })->values()->all();
    }
}
