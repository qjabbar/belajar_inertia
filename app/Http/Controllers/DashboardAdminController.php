<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardAdminController extends Controller
{
    public function index(Request $request)
    {
        $stats = [
            'total_domains' => \App\Models\Domain::count(),
            'total_storages' => \App\Models\Storage::count(),
            'total_customers' => \App\Models\User::whereHas('roles', function ($q) {
                $q->where('name', 'member');
            })->count(),
            'pending_orders' => 0, // Add order logic later
        ];

        return Inertia::render('dashboard/Admin', [
            'stats' => $stats,
        ]);
    }
}
