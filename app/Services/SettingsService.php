<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class SettingsService
{
    /**
     * Cache duration in seconds (24 hours)
     */
    private const CACHE_DURATION = 86400;

    /**
     * Cache key for all settings
     */
    private const CACHE_KEY = 'settings.all';

    /**
     * Get a single setting value by key
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function get(string $key, $default = null)
    {
        $settings = $this->all();

        // Support dot notation (e.g., 'seo.default_title')
        $keys = explode('.', $key);
        $value = $settings;

        foreach ($keys as $segment) {
            if (!isset($value[$segment])) {
                return $default;
            }
            $value = $value[$segment];
        }

        return $value ?? $default;
    }

    /**
     * Set a setting value
     *
     * @param string $key
     * @param mixed $value
     * @return bool
     */
    public function set(string $key, $value): bool
    {
        $setting = Setting::where('key', $key)->first();

        if (!$setting) {
            return false;
        }

        $setting->setValue($value);
        $setting->save();

        // Clear cache
        $this->clearCache();

        return true;
    }

    /**
     * Get all settings, optionally filtered by group
     *
     * @param string|null $group
     * @return array
     */
    public function all(?string $group = null): array
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_DURATION, function () use ($group) {
            $query = Setting::query();

            if ($group) {
                $query->byGroup($group);
            }

            $settings = $query->get();

            // Organize settings by group and key
            $organized = [];

            foreach ($settings as $setting) {
                $parts = explode('.', $setting->key);

                if (count($parts) === 2) {
                    [$group, $key] = $parts;
                    $organized[$group][$key] = $setting->getValue();
                }
                else {
                    // Fallback for non-grouped settings
                    $organized[$setting->key] = $setting->getValue();
                }
            }

            return $organized;
        });
    }

    /**
     * Clear the settings cache
     *
     * @return void
     */
    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * Refresh the cache
     *
     * @return array
     */
    public function refreshCache(): array
    {
        $this->clearCache();
        return $this->all();
    }
}
