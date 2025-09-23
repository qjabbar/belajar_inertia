<?php

namespace App\Http\Controllers\System;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardSystemController extends \App\Http\Controllers\Controller
{
    public function index(Request $request)
    {
        $recentActivities = \Spatie\Activitylog\Models\Activity::latest()
            ->limit(1)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'action' => $activity->description,
                    'user' => $activity->causer ? $activity->causer->name : 'system',
                    'timestamp' => $activity->created_at->toDateTimeString(),
                    'subject_type' => class_basename($activity->subject_type),
                    'properties' => $activity->properties ? $activity->properties->toArray() : [],
                    'status' => 'success',
                ];
            });

        $stats = [
            'total_users' => \App\Models\User::count(),
            'total_roles' => \Spatie\Permission\Models\Role::count(),
            'total_permissions' => \Spatie\Permission\Models\Permission::count(),
            'system_health' => 'Online',
            'recent_activities' => $recentActivities,
        ];

        return Inertia::render('dashboard/System', [
            'stats' => $stats,
            'recent_activities' => $recentActivities,
        ]);
    }
}
