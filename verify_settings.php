<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Test the SettingsService directly
$settingsService = app(\App\Services\SettingsService::class);
$allSettings = $settingsService->all();

echo "Settings Service Test:\n";
print_r($allSettings);

// Test via HTTP request simulation
echo "\n\nAPI Endpoint Test:\n";
$request = Illuminate\Http\Request::create('/api/en/settings', 'GET');
$response = $kernel->handle($request);

echo "Status: " . $response->getStatusCode() . "\n";
echo "Content: " . $response->getContent() . "\n";
