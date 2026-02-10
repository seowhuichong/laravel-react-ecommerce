<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SettingsService;
use Illuminate\Http\JsonResponse;

class SettingsController extends Controller
{
    protected $settingsService;

    public function __construct(SettingsService $settingsService)
    {
        $this->settingsService = $settingsService;
    }

    /**
     * Get all public settings
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        // We might want to filter sensitive settings here in the future
        // For now, we return all settings grouped by their group name
        $settings = $this->settingsService->all();

        return response()->json([
            'data' => $settings,
            'meta' => [
                'timestamp' => now()->toIso8601String(),
            ]
        ]);
    }
}
