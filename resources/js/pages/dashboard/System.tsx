import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Activity, Database, Eye, FileText, Key, Plus, RefreshCw, Settings, Shield, Users } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface SystemDashboardProps {
    stats: {
        total_users: number;
        total_roles: number;
        total_permissions: number;
        system_health: string;
    };
    recent_activities?: {
        id: number;
        action: string;
        user: string;
        timestamp: string;
        subject_type: string;
        properties: Record<string, any>;
        status: 'success' | 'warning' | 'error';
    }[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'System', href: '/system' }];

export default function SystemDashboard({ stats, recent_activities = [] }: SystemDashboardProps) {
    const handleRefreshStats = (): void => {
        router.reload({
            onSuccess: () => toast.success('Statistics refreshed successfully'),
            onError: () => toast.error('Failed to refresh statistics'),
            preserveUrl: true,
        });
    };

    const handleExportLogs = (): void => {
        router.get(
            '/system/export-logs',
            {},
            {
                onSuccess: () => toast.success('Logs exported successfully'),
                onError: () => toast.error('Failed to export logs'),
            },
        );
    };

    const getStatusColor = (status: string): string => {
        switch (status.toLowerCase()) {
            case 'healthy':
            case 'good':
                return 'text-green-600';
            case 'warning':
                return 'text-yellow-600';
            case 'error':
            case 'critical':
                return 'text-red-600';
            default:
                return 'text-green-600';
        }
    };

    const getActivityStatusIcon = (status: string): React.ReactNode => {
        switch (status) {
            case 'success':
                return;
            case 'warning':
                return;
            case 'error':
                return;
            default:
                return;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Dashboard" />

            <div className="flex-1 space-y-6 p-4 md:p-6">
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">System Dashboard</h1>
                        <p className="text-muted-foreground">System-wide management and monitoring</p>
                    </div>
                    <Button onClick={handleRefreshStats} className="w-full gap-2 md:w-auto" size="sm">
                        <RefreshCw className="h-4 w-4" />
                        Refresh Stats
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users.toLocaleString()}</div>
                            <p className="text-muted-foreground text-xs">All registered users</p>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
                            <Shield className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_roles}</div>
                            <p className="text-muted-foreground text-xs">System roles</p>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
                            <Key className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_permissions}</div>
                            <p className="text-muted-foreground text-xs">Available permissions</p>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">System Status</CardTitle>
                            <Activity className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${getStatusColor(stats.system_health)}`}>{stats.system_health}</div>
                            <p className="text-muted-foreground text-xs">All systems operational</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Management Section */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border shadow-sm">
                        <CardHeader className="bg-muted/40 space-y-2 border-b">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                <Settings className="text-primary h-4 w-4" />
                                System Management
                            </CardTitle>
                            <p className="text-muted-foreground text-sm">Quick access to system functions</p>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                            <Button variant="ghost" className="hover:bg-muted/50 w-full justify-start" onClick={() => router.visit('/roles')}>
                                <Shield className="mr-2 h-4 w-4" />
                                Manage Roles & Permissions
                            </Button>

                            <Button variant="ghost" className="hover:bg-muted/50 w-full justify-start" onClick={() => router.visit('/users')}>
                                <Users className="mr-2 h-4 w-4" />
                                Manage All Users
                            </Button>

                            <Button variant="ghost" className="hover:bg-muted/50 w-full justify-start" onClick={() => router.visit('/audit-logs')}>
                                <FileText className="mr-2 h-4 w-4" />
                                View System Logs
                            </Button>

                            <Button variant="ghost" className="hover:bg-muted/50 w-full justify-start" onClick={() => router.visit('/backup')}>
                                <Database className="mr-2 h-4 w-4" />
                                System Backup
                            </Button>

                            <Separator />
                        </CardContent>
                    </Card>

                    <Card className="border shadow-sm">
                        <CardHeader className="bg-muted/40 space-y-2 border-b md:flex-row md:items-center md:justify-between md:space-y-0">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-semibold">Recent System Activity</CardTitle>
                                <p className="text-muted-foreground text-sm">Latest system events and actions</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => router.visit('/audit-logs')}>
                                <Eye className="mr-2 h-4 w-4" />
                                View All
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {recent_activities.length === 0 ? (
                                <div className="text-muted-foreground py-6 text-center">
                                    <Activity className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                                    <p className="text-sm">System running smoothly.</p>
                                    <p className="text-xs">No recent alerts or activities.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recent_activities.slice(0, 5).map((activity) => (
                                        <div key={activity.id} className="bg-muted/30 flex flex-col gap-2 rounded border p-3">
                                            <div className="flex items-center gap-3">
                                                {getActivityStatusIcon(activity.status)}
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm font-medium">{activity.action}</div>
                                                    <div className="text-muted-foreground text-xs">
                                                        {activity.user} • {new Date(activity.timestamp).toLocaleString()} • {activity.subject_type}
                                                    </div>
                                                </div>
                                            </div>
                                            {activity.properties && Object.keys(activity.properties).length > 0 && (
                                                <pre className="bg-muted/10 overflow-x-auto rounded p-2 text-xs">
                                                    {JSON.stringify(activity.properties, null, 2)}
                                                </pre>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="border shadow-sm">
                    <CardHeader className="bg-muted/40 border-b">
                        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => router.visit('/users/create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => router.visit('/roles/create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Role
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    router.post(
                                        '/backup/run',
                                        {},
                                        {
                                            onSuccess: () => toast.success('Backup created successfully'),
                                            onError: () => toast.error('Failed to create backup'),
                                            preserveUrl: true,
                                        },
                                    );
                                }}
                            >
                                <Database className="mr-2 h-4 w-4" />
                                Run Backup
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleRefreshStats}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Refresh All
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
