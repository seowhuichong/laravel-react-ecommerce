<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Services\SettingsService;

$locales = ['en-MY', 'ms-MY', 'zh-CN'];
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
    Route::get(
        '/{any?}',
        function (SettingsService $settingsService) {
            return view('app', [
                'settings' => $settingsService->all()
            ]);
        }
    )->where('any', '.*');
});

Route::get('/', function () {
    return redirect('/en-MY');
});

Route::get('/{any}', function ($any) {
    return redirect('/en-MY/' . $any);
})->where('any', '^(?!api).*');
