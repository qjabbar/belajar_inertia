import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Edit, HardDrive, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Storage {
    id: number;
    size: number;
    price_admin_annual: number;
    price_admin_monthly: number;
    price_member_annual: number;
    price_member_monthly: number;
}

interface Props {
    storages: {
        data: Storage[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    stats: {
        min: number;
        max: number;
        avgAdmin: number;
    };
    filters: {
        search: string;
        per_page: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '#' },
    { title: 'Storage Management', href: '#' },
];

export default function Index({ storages, stats, filters }: Props) {
    const [search, setSearch] = useState(filters?.search || '');
    const [perPage, setPerPage] = useState(filters?.per_page || 10);

    // Handle per page change
    const handlePerPageChange = (value: string) => {
        const newPerPage = parseInt(value);
        setPerPage(newPerPage);

        router.get(
            route('storages.index'),
            {
                search: search,
                per_page: newPerPage,
                page: 1,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    // Handle search with debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters?.search) {
                router.get(
                    route('storages.index'),
                    {
                        search: search,
                        per_page: perPage,
                        page: 1,
                    },
                    {
                        preserveState: true,
                        replace: true,
                    },
                );
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search]);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this storage plan?')) {
            router.delete(route('storages.destroy', id));
        }
    };

    return (
        <>
            <Head title="Storage Management" />

            {/* EXACT SAME STRUCTURE AS DOMAIN INDEX */}
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex-1 space-y-6 p-4 md:p-6">
                    {/* HEADER - SAMA PERSIS DENGAN DOMAIN INDEX */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                                <HardDrive className="mr-3 h-6 w-6 text-blue-500" />
                                Storage Management
                            </h1>
                            <p className="text-muted-foreground">Configure storage plans and pricing for different user types</p>
                        </div>
                        <Button onClick={() => router.get(route('storages.create'))} variant="outline" size="sm" className="gap-2">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Storage Plan
                        </Button>
                    </div>

                    {/* CARD MIRIP DOMAIN */}
                    <Card className="border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Storage Plans</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* MOBILE: CARD VIEW */}
                            <div className="block space-y-4 md:hidden">
                                {storages.data.length > 0 ? (
                                    storages.data.map((storage) => (
                                        <Card key={storage.id} className="border p-4 shadow-sm">
                                            <div className="mb-3 flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <HardDrive className="h-4 w-4 text-blue-500" />
                                                    <span className="font-semibold">{storage.size} GB</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => router.get(route('storages.edit', storage.id))}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(storage.id)}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground">Admin Annual</p>
                                                    <p className="font-medium text-green-600">
                                                        Rp {storage.price_admin_annual.toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Admin Monthly</p>
                                                    <p className="font-medium text-green-600">
                                                        Rp {storage.price_admin_monthly.toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Member Annual</p>
                                                    <p className="font-medium text-purple-600">
                                                        Rp {storage.price_member_annual.toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Member Monthly</p>
                                                    <p className="font-medium text-purple-600">
                                                        Rp {storage.price_member_monthly.toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="py-8 text-center">
                                        <HardDrive className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                                        <p className="text-muted-foreground">No storage plans found.</p>
                                    </div>
                                )}
                            </div>

                            {/* DESKTOP: TABLE - MIRIP DOMAIN */}
                            <div className="hidden md:block">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full rounded border bg-white">
                                        <thead>
                                            <tr>
                                                <th className="border px-4 py-2 text-left">Storage Size</th>
                                                <th className="border px-4 py-2 text-left">Admin Annual</th>
                                                <th className="border px-4 py-2 text-left">Admin Monthly</th>
                                                <th className="border px-4 py-2 text-left">Member Annual</th>
                                                <th className="border px-4 py-2 text-left">Member Monthly</th>
                                                <th className="border px-4 py-2 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {storages.data.length > 0 ? (
                                                storages.data.map((storage) => (
                                                    <tr key={storage.id} className="hover:bg-muted/20">
                                                        <td className="border px-4 py-2">
                                                            <div className="flex items-center space-x-2">
                                                                <HardDrive className="h-4 w-4 text-blue-500" />
                                                                <span className="font-medium">{storage.size} GB</span>
                                                            </div>
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            <span className="font-medium text-green-600">
                                                                Rp {storage.price_admin_annual.toLocaleString('id-ID')}
                                                            </span>
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            <span className="font-medium text-green-600">
                                                                Rp {storage.price_admin_monthly.toLocaleString('id-ID')}
                                                            </span>
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            <span className="font-medium text-purple-600">
                                                                Rp {storage.price_member_annual.toLocaleString('id-ID')}
                                                            </span>
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            <span className="font-medium text-purple-600">
                                                                Rp {storage.price_member_monthly.toLocaleString('id-ID')}
                                                            </span>
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            <div className="flex items-center space-x-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => router.get(route('storages.edit', storage.id))}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleDelete(storage.id)}
                                                                    className="text-red-600 hover:text-red-700"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="text-muted-foreground border px-4 py-6 text-center">
                                                        No storage plans found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* PAGINATION - SIMPLE LIKE DOMAIN INDEX */}
                            {storages.data.length > 0 && storages.last_page > 1 && (
                                <div className="mt-4 flex justify-center">
                                    {storages.links.map((link, index) => {
                                        if (link.label.includes('Previous') || link.label.includes('Next')) {
                                            return (
                                                <span
                                                    key={index}
                                                    className="mx-1 px-2 py-1 text-gray-400"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        }
                                        if (!isNaN(parseInt(link.label))) {
                                            return (
                                                <Button
                                                    key={index}
                                                    variant={link.active ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => link.url && router.get(link.url)}
                                                    className={`mx-1 rounded px-2 py-1 ${link.active ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
                                                >
                                                    {link.label}
                                                </Button>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
