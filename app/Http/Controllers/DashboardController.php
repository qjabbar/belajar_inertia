<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Domain;
use App\Models\Storage;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Check permission dan render dashboard yang sesuai
        if ($user->can('dashboard-system-view')) {
            return $this->systemDashboard();
        } elseif ($user->can('dashboard-admin-view')) {
            return $this->adminDashboard();
        } elseif ($user->can('dashboard-reseller-view')) {
            return $this->resellerDashboard();
        }

        // Jika tidak ada permission dashboard, redirect atau error
        abort(403, 'You do not have permission to access any dashboard.');
    }

    private function systemDashboard()
    {
        // System dashboard - untuk manage system-wide settings
        $stats = [
            'total_users' => \App\Models\User::count(),
            'total_roles' => \Spatie\Permission\Models\Role::count(),
            'total_permissions' => \Spatie\Permission\Models\Permission::count(),
            'system_health' => 'Online',
            'recent_activities' => [], // Add audit log data
        ];

        return Inertia::render('dashboard/System', [
            'stats' => $stats,
        ]);
    }

    private function adminDashboard()
    {
        // Admin dashboard - untuk manage domains & storages
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

    private function resellerDashboard()
    {
        // Reseller dashboard - untuk manage customers & sales
        $user = auth()->user();
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
