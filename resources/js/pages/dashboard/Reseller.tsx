import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BarChart3, CheckCircle, DollarSign, TrendingUp, UserPlus, Users } from 'lucide-react';

interface ResellerDashboardProps {
    stats: {
        my_customers: number;
        revenue_this_month: number;
        active_subscriptions: number;
        commission_earned: number;
    };
}

export default function ResellerDashboard({ stats }: ResellerDashboardProps) {
    return (
        <AppLayout>
            <Head title="Reseller Dashboard" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Reseller Dashboard</h1>
                        <p className="text-muted-foreground">Manage your customers and track your sales performance</p>
                    </div>
                </div>

                <Separator />

                {/* Reseller Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">My Customers</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.my_customers}</div>
                            <p className="text-muted-foreground text-xs">Active customers</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                            <DollarSign className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${stats.revenue_this_month}</div>
                            <p className="text-muted-foreground text-xs">This month's earnings</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                            <CheckCircle className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_subscriptions}</div>
                            <p className="text-muted-foreground text-xs">Currently active</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
                            <TrendingUp className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${stats.commission_earned}</div>
                            <p className="text-muted-foreground text-xs">Total commissions</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Reseller Actions */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserPlus className="h-5 w-5" />
                                Customer Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full justify-start">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add New Customer
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Users className="mr-2 h-4 w-4" />
                                View All Customers
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Sales Performance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-muted-foreground text-sm">Sales charts and analytics will be displayed here</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
