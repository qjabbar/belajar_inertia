<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardResellerController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $stats = [
            'my_customers' => 0, // Add customer count logic
            'revenue_this_month' => 0,
            'active_subscriptions' => 0,
            'commission_earned' => 0,
        ];

        return Inertia::render('dashboard/Reseller', [
            'stats' => $stats,
        ]);
    }
}
