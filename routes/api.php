<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\UserAddressController;
use App\Http\Controllers\Api\Admin\AdminAuthController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Admin\AdminProductController;
use App\Http\Controllers\Api\Admin\AdminCategoryController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:login');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/profile/password', [AuthController::class, 'updatePassword']);

    // User Addresses
    Route::get('/addresses', [UserAddressController::class, 'index']);
    Route::post('/addresses', [UserAddressController::class, 'store']);
    Route::get('/addresses/{id}', [UserAddressController::class, 'show']);
    Route::put('/addresses/{id}', [UserAddressController::class, 'update']);
    Route::delete('/addresses/{id}', [UserAddressController::class, 'destroy']);
    Route::patch('/addresses/{id}/set-default', [UserAddressController::class, 'setDefault']);
});

Route::prefix('{locale}')
    ->where(['locale' => 'en-MY|ms-MY|zh-CN'])
    ->group(function () {
        Route::get('/products/{friendly_url}', [ProductController::class, 'getInfoByFriendlyUrl']);
        Route::get('/settings', [SettingsController::class, 'index']);
        Route::get('/categories', [CategoryController::class, 'index']);
    });

Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);

    Route::middleware('auth:admin')->group(
        function () {
            Route::post('/logout', [AdminAuthController::class, 'logout']);
            Route::get('/me', [AdminAuthController::class, 'me']);

            Route::get('/dashboard', [AdminDashboardController::class, 'index']);

            Route::get('/customers', [AdminUserController::class, 'index']);
            Route::get('/customers/{id}', [AdminUserController::class, 'show']);
            Route::put('/customers/{id}', [AdminUserController::class, 'update']);
            Route::delete('/customers/{id}', [AdminUserController::class, 'destroy']);

            Route::get('/products', [AdminProductController::class, 'index']);
            Route::get('/products/{id}', [AdminProductController::class, 'show']);
            Route::post('/products', [AdminProductController::class, 'store']);
            Route::put('/products/{id}', [AdminProductController::class, 'update']);
            Route::delete('/products/{id}', [AdminProductController::class, 'destroy']);

            Route::get('/categories', [AdminCategoryController::class, 'index']);
            Route::get('/categories/{id}', [AdminCategoryController::class, 'show']);
            Route::post('/categories', [AdminCategoryController::class, 'store']);
            Route::put('/categories/{id}', [AdminCategoryController::class, 'update']);
            Route::delete('/categories/{id}', [AdminCategoryController::class, 'destroy']);
        }
    );
});
