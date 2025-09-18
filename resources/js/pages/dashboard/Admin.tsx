import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Clock, Globe, HardDrive, RefreshCw, TrendingUp, Users } from 'lucide-react';

interface AdminDashboardProps {
    stats: {
        total_domains: number;
        total_storages: number;
        total_customers: number;
        pending_orders: number;
    };
    recent_orders?: {
        id: number;
        customer: string;
        status: string;
        created_at: string;
        details?: Record<string, any>;
    }[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Admin', href: '/admin' }];

export default function AdminDashboard({ stats, recent_orders = [] }: AdminDashboardProps) {
    const handleRefreshStats = (): void => {
        router.reload({
            onSuccess: () => {}, // Optionally add toast
            onError: () => {},
            preserveUrl: true,
        });
    };

    const getStatusColor = (status: string): string => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'text-yellow-600';
            case 'completed':
                return 'text-green-600';
            case 'failed':
                return 'text-red-600';
            default:
                return 'text-muted-foreground';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="flex-1 space-y-6 p-4 md:p-6">
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage domains, storage plans and customers</p>
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
                            <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
                            <Globe className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_domains.toLocaleString()}</div>
                            <p className="text-muted-foreground text-xs">Available domains</p>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Storage Plans</CardTitle>
                            <HardDrive className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_storages.toLocaleString()}</div>
                            <p className="text-muted-foreground text-xs">Active storage plans</p>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Customers</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_customers.toLocaleString()}</div>
                            <p className="text-muted-foreground text-xs">Total customers</p>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                            <Clock className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_orders.toLocaleString()}</div>
                            <p className="text-muted-foreground text-xs">Awaiting processing</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Management & Recent Orders Section */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border shadow-sm">
                        <CardHeader className="bg-muted/40 space-y-2 border-b">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                <TrendingUp className="text-primary h-4 w-4" />
                                Business Management
                            </CardTitle>
                            <p className="text-muted-foreground text-sm">Quick access to business functions</p>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                            <Button variant="ghost" className="hover:bg-muted/50 w-full justify-start" onClick={() => router.visit('/domains')}>
                                <Globe className="mr-2 h-4 w-4" />
                                Manage Domains
                            </Button>
                            <Button variant="ghost" className="hover:bg-muted/50 w-full justify-start" onClick={() => router.visit('/storages')}>
                                <HardDrive className="mr-2 h-4 w-4" />
                                Manage Storage Plans
                            </Button>
                            <Button variant="ghost" className="hover:bg-muted/50 w-full justify-start" onClick={() => router.visit('/users')}>
                                <Users className="mr-2 h-4 w-4" />
                                Manage Customers
                            </Button>
                            <Separator />
                        </CardContent>
                    </Card>

                    <Card className="border shadow-sm">
                        <CardHeader className="bg-muted/40 space-y-2 border-b md:flex-row md:items-center md:justify-between md:space-y-0">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
                                <p className="text-muted-foreground text-sm">Latest orders and status</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => router.visit('/orders')}>
                                <Clock className="mr-2 h-4 w-4" />
                                View All
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {recent_orders.length === 0 ? (
                                <div className="text-muted-foreground py-6 text-center">
                                    <Clock className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                                    <p className="text-sm">No recent orders to display.</p>
                                    <p className="text-xs">All caught up!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recent_orders.slice(0, 5).map((order) => (
                                        <div key={order.id} className="bg-muted/30 flex flex-col gap-2 rounded border p-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`text-xs font-semibold ${getStatusColor(order.status)}`}>{order.status}</div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm font-medium">{order.customer}</div>
                                                    <div className="text-muted-foreground text-xs">{new Date(order.created_at).toLocaleString()}</div>
                                                </div>
                                            </div>
                                            {order.details && Object.keys(order.details).length > 0 && (
                                                <pre className="bg-muted/10 overflow-x-auto rounded p-2 text-xs">
                                                    {JSON.stringify(order.details, null, 2)}
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
                            <Button variant="outline" size="sm" onClick={() => router.visit('/domains/create')}>
                                <Globe className="mr-2 h-4 w-4" />
                                Add Domain
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => router.visit('/storages/create')}>
                                <HardDrive className="mr-2 h-4 w-4" />
                                Add Storage Plan
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => router.visit('/users/create')}>
                                <Users className="mr-2 h-4 w-4" />
                                Add Customer
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
