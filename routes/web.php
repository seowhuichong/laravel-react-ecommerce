<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Services\SettingsService;

$locales = ['en', 'ms', 'zh'];
$localePattern = implode('|', $locales);

Route::post('/api/set-locale', function (Request $request) {
    $locale = $request->locale;
    session(['locale' => $locale]);
    app()->setLocale($locale);
    return response()->json(['success' => true, 'locale' => $locale]);
});

Route::group([
    'prefix' => '{locale}',
    'where' => ['locale' => $localePattern],
    'middleware' => [\App\Http\Middleware\SetLocale::class]
], function () {
    Route::get('/{any?}', function (SettingsService $settingsService) {
            return view('app', [
            'settings' => $settingsService->all()
            ]);
        }
        )->where('any', '.*');    });

Route::get('/', function () {
    return redirect('/en');
});

Route::get('/{any}', function ($any) {
    return redirect('/en/' . $any);
})->where('any', '^(?!api).*');
