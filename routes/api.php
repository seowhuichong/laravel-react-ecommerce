<?php

use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/products/{friendly_url}', [ProductController::class, 'getInfoByFriendlyUrl']);
