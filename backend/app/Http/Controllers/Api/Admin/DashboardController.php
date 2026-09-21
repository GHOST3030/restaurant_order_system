<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_orders' => Order::count(),
            'total_users' => User::count(),
            'total_revenue' => (float) Order::where('status', '!=', 'cancelled')->sum('total'),
            'total_menu_items' => MenuItem::count(),
            'recent_orders' => Order::with('user:id,name,email', 'items')->latest()->take(5)->get(),
        ]);
    }
}
