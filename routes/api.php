<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class , 'register']);
Route::post('/login', [AuthController::class , 'login'])
    ->middleware('throttle:login');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class , 'logout']);
    Route::get('/me', [AuthController::class , 'me']);
});

Route::prefix('{locale}')
    ->where(['locale' => 'en|ms|zh'])
    ->group(function () {
        Route::get('/products/{friendly_url}', [ProductController::class , 'getInfoByFriendlyUrl']);
    });
