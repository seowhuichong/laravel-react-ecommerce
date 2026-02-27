<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'parent_id',
        'slug',
        'image',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /* ── Relationships ── */

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id');
    }

    public function translations()
    {
        return $this->hasMany(CategoryTranslation::class);
    }

    /* ── Helpers ── */

    /**
     * Get the translated name for a given locale, falls back to en-MY.
     */
    public function translation(string $locale = 'en-MY'): string
    {
        $t = $this->translations->firstWhere('language_code', $locale)
            ?? $this->translations->firstWhere('language_code', 'en-MY');

        return $t?->name ?? $this->slug;
    }

    /* ── Scopes ── */

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeRoots($query)
    {
        return $query->whereNull('parent_id');
    }
}
