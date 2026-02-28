<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminCategoryController extends Controller
{
    /** Clear the public category cache for all locales */
    private function clearCache(): void
    {
        foreach (['en-MY', 'ms-MY', 'zh-CN'] as $locale) {
            Cache::forget("categories.{$locale}");
        }
    }

    /**
     * Build a readable English path by walking up the parent chain.
     * Requires 'parent.translations' to be eager-loaded.
     * Example: "Health › Vitamins › Vitamin C"
     */
    private function getPath(Category $cat): string
    {
        $parts = [$cat->translation('en-MY')];
        $current = $cat;
        while ($current->parent) {
            array_unshift($parts, $current->parent->translation('en-MY'));
            $current = $current->parent;
        }
        return implode(' › ', $parts);
    }

    /**
     * Return ALL categories (active + inactive) as a flat list,
     * enriched with their translations and parent name.
     */
    public function index()
    {
        $categories = Category::with(['translations', 'parent.translations'])
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(function (Category $cat) {
                $data = $cat->toArray();
                $data['path'] = $this->getPath($cat);
                return $data;
            })
            ->values();

        return response()->json(['categories' => $categories]);
    }

    public function show($id)
    {
        $category = Category::with([
            'translations',
            'parent.translations',
            'children.translations',
        ])->findOrFail($id);

        $data = $category->toArray();
        $data['path'] = $this->getPath($category);

        return response()->json(['category' => $data]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'slug' => 'required|string|max:150|unique:categories,slug',
            'parent_id' => 'nullable|integer|exists:categories,id',
            'image' => 'nullable|string|max:255',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
            'translations' => 'sometimes|array',
            'translations.*.name' => 'sometimes|string|max:200',
        ]);

        $category = Category::create([
            'slug' => $validated['slug'],
            'parent_id' => $validated['parent_id'] ?? null,
            'image' => $validated['image'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        if (!empty($validated['translations'])) {
            foreach ($validated['translations'] as $locale => $fields) {
                if (!empty($fields['name'])) {
                    $category->translations()->create([
                        'language_code' => $locale,
                        'name' => $fields['name'],
                    ]);
                }
            }
        }

        $this->clearCache();

        return response()->json([
            'message' => 'Category created',
            'category' => $category->load('translations'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'slug' => 'sometimes|string|max:150|unique:categories,slug,' . $id,
            'parent_id' => 'nullable|integer|exists:categories,id',
            'image' => 'nullable|string|max:255',
            'sort_order' => 'sometimes|integer|min:0',
            'is_active' => 'sometimes|boolean',
            'translations' => 'sometimes|array',
            'translations.*.name' => 'sometimes|string|max:200',
        ]);

        $coreFields = collect($validated)->except('translations')->toArray();
        if (!empty($coreFields)) {
            $category->update($coreFields);
        }

        if (!empty($validated['translations'])) {
            foreach ($validated['translations'] as $locale => $fields) {
                if (isset($fields['name'])) {
                    $category->translations()->updateOrCreate(
                        ['language_code' => $locale],
                        ['name' => $fields['name']]
                    );
                }
            }
        }

        $this->clearCache();

        return response()->json([
            'message' => 'Category updated',
            'category' => $category->fresh('translations'),
        ]);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete(); // cascade deletes translations + children

        $this->clearCache();

        return response()->json(['message' => 'Category deleted']);
    }
}
