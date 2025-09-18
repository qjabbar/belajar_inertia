import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Clock, Globe, HardDrive, TrendingUp, Users } from 'lucide-react';

interface AdminDashboardProps {
    stats: {
        total_domains: number;
        total_storages: number;
        total_customers: number;
        pending_orders: number;
    };
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
    return (
        <AppLayout>
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage domains, storage plans and customers</p>
                    </div>
                </div>

                <Separator />

                {/* Admin Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
                            <Globe className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_domains}</div>
                            <p className="text-muted-foreground text-xs">Available domains</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Storage Plans</CardTitle>
                            <HardDrive className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_storages}</div>
                            <p className="text-muted-foreground text-xs">Active storage plans</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Customers</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_customers}</div>
                            <p className="text-muted-foreground text-xs">Total customers</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                            <Clock className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_orders}</div>
                            <p className="text-muted-foreground text-xs">Awaiting processing</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Business Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full justify-start" onClick={() => (window.location.href = '/domains')}>
                                <Globe className="mr-2 h-4 w-4" />
                                Manage Domains
                            </Button>
                            <Button className="w-full justify-start" onClick={() => (window.location.href = '/storages')}>
                                <HardDrive className="mr-2 h-4 w-4" />
                                Manage Storage Plans
                            </Button>
                            <Button variant="outline" className="w-full justify-start" onClick={() => (window.location.href = '/users')}>
                                <Users className="mr-2 h-4 w-4" />
                                Manage Customers
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-muted-foreground text-sm">No recent orders to display</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
