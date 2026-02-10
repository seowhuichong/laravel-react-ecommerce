<?php

use App\Services\SettingsService;

if (!function_exists('setting')) {
    /**
     * Get a setting value by key
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    function setting(string $key, $default = null)
    {
        return app(SettingsService::class)->get($key, $default);
    }
}
