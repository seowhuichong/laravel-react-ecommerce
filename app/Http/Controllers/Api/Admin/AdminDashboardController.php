<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_customers' => User::count(),
            'total_products' => Product::count(),
            'active_products' => Product::where('product_status', 'Active')->count(),
            'recent_customers' => User::select('id', 'name', 'email', 'created_at')
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }
}
