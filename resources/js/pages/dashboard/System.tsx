import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Activity, Database, FileText, Key, Settings, Shield, Users } from 'lucide-react';

interface SystemDashboardProps {
    stats: {
        total_users: number;
        total_roles: number;
        total_permissions: number;
        system_health: string;
    };
}

export default function SystemDashboard({ stats }: SystemDashboardProps) {
    return (
        <AppLayout>
            <Head title="System Dashboard" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">System Dashboard</h1>
                        <p className="text-muted-foreground">System-wide management and monitoring</p>
                    </div>
                </div>

                <Separator />

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                            <p className="text-muted-foreground text-xs">All registered users</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
                            <Shield className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_roles}</div>
                            <p className="text-muted-foreground text-xs">System roles</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
                            <Key className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_permissions}</div>
                            <p className="text-muted-foreground text-xs">Available permissions</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">System Status</CardTitle>
                            <Activity className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.system_health}</div>
                            <p className="text-muted-foreground text-xs">All systems operational</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                System Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="ghost" className="w-full justify-start" onClick={() => (window.location.href = '/roles')}>
                                <Shield className="mr-2 h-4 w-4" />
                                Manage Roles & Permissions
                            </Button>
                            <Button variant="ghost" className="w-full justify-start" onClick={() => (window.location.href = '/users')}>
                                <Users className="mr-2 h-4 w-4" />
                                Manage All Users
                            </Button>
                            <Button variant="ghost" className="w-full justify-start" onClick={() => (window.location.href = '/audit-logs')}>
                                <FileText className="mr-2 h-4 w-4" />
                                View System Logs
                            </Button>
                            <Button variant="ghost" className="w-full justify-start" onClick={() => (window.location.href = '/backup')}>
                                <Database className="mr-2 h-4 w-4" />
                                System Backup
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent System Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-muted-foreground text-sm">System running smoothly. No recent alerts.</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
