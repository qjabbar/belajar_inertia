import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Edit, HardDrive, Plus, Search, Trash2 } from 'lucide-react';
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
    filters: {
        search: string;
        per_page: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [];

export default function Index({ storages, filters }: Props) {
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

            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="admin-index-container">
                    <div className="admin-index-content">
                        {/* HEADER */}
                        <div className="admin-index-header">
                            <div className="admin-index-header-info">
                                <h1>
                                    <HardDrive className="h-6 w-6 text-blue-500 md:h-8 md:w-8" />
                                    Storage Management
                                </h1>
                                <p>Configure storage plans and pricing for different user types</p>
                            </div>
                            <Button onClick={() => router.get(route('storages.create'))} className="admin-index-add-btn">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Storage Plan
                            </Button>
                        </div>

                        {/* MAIN CARD */}
                        <div className="admin-index-card">
                            <div className="admin-index-card-header">
                                <h2 className="admin-index-card-title">Storage Plans</h2>
                                <div className="admin-index-search">
                                    <Search className="absolute top-2.5 left-2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search storage plans..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>

                            {/* MOBILE VIEW */}
                            <div className="admin-index-mobile">
                                {storages.data.length > 0 ? (
                                    storages.data.map((storage) => (
                                        <div key={storage.id} className="admin-index-mobile-item">
                                            <div className="admin-index-mobile-header">
                                                <div className="admin-index-mobile-info">
                                                    <HardDrive className="h-5 w-5 text-blue-500" />
                                                    <div>
                                                        <h3 className="admin-index-mobile-title">{storage.size} GB</h3>
                                                        <p className="admin-index-mobile-subtitle">Storage Plan</p>
                                                    </div>
                                                </div>
                                                <div className="admin-index-mobile-actions">
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
                                            </div>

                                            <div className="admin-index-mobile-content">
                                                <div className="admin-index-mobile-section admin-index-section-green">
                                                    <div className="admin-index-mobile-section-title">Admin Pricing</div>
                                                    <div className="admin-index-mobile-row">
                                                        <span className="admin-index-mobile-label">Annual:</span>
                                                        <span className="admin-index-mobile-value">
                                                            Rp {storage.price_admin_annual.toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                    <div className="admin-index-mobile-row">
                                                        <span className="admin-index-mobile-label">Monthly:</span>
                                                        <span className="admin-index-mobile-value">
                                                            Rp {storage.price_admin_monthly.toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="admin-index-mobile-section admin-index-section-purple">
                                                    <div className="admin-index-mobile-section-title">Member Pricing</div>
                                                    <div className="admin-index-mobile-row">
                                                        <span className="admin-index-mobile-label">Annual:</span>
                                                        <span className="admin-index-mobile-value">
                                                            Rp {storage.price_member_annual.toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                    <div className="admin-index-mobile-row">
                                                        <span className="admin-index-mobile-label">Monthly:</span>
                                                        <span className="admin-index-mobile-value">
                                                            Rp {storage.price_member_monthly.toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="admin-index-empty">
                                        <HardDrive className="admin-index-empty-icon" />
                                        <h3 className="admin-index-empty-title">No storage plans found</h3>
                                        <p className="admin-index-empty-text">Get started by creating your first storage plan</p>
                                    </div>
                                )}
                            </div>

                            {/* DESKTOP VIEW */}
                            <div className="admin-index-desktop">
                                <table className="admin-index-table">
                                    <thead>
                                        <tr>
                                            <th>Storage Size</th>
                                            <th>Admin Annual</th>
                                            <th>Admin Monthly</th>
                                            <th>Member Annual</th>
                                            <th>Member Monthly</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {storages.data.length > 0 ? (
                                            storages.data.map((storage) => (
                                                <tr key={storage.id}>
                                                    <td>
                                                        <div className="admin-index-table-icon">
                                                            <HardDrive className="h-4 w-4 text-blue-500" />
                                                            <span className="admin-index-font-medium">{storage.size} GB</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="admin-index-font-medium admin-index-text-green">
                                                            Rp {storage.price_admin_annual.toLocaleString('id-ID')}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="admin-index-font-medium admin-index-text-green">
                                                            Rp {storage.price_admin_monthly.toLocaleString('id-ID')}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="admin-index-font-medium admin-index-text-purple">
                                                            Rp {storage.price_member_annual.toLocaleString('id-ID')}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="admin-index-font-medium admin-index-text-purple">
                                                            Rp {storage.price_member_monthly.toLocaleString('id-ID')}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="admin-index-table-actions">
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
                                                <td colSpan={6} className="py-8 text-center text-gray-500">
                                                    No storage plans found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* PAGINATION */}
                            {storages.data.length > 0 && storages.last_page > 1 && (
                                <div className="admin-index-pagination">
                                    <div className="admin-index-pagination-info">
                                        <span>Rows per page:</span>
                                        <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
                                            <SelectTrigger className="h-8 w-16">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent side="top">
                                                <SelectItem value="10">10</SelectItem>
                                                <SelectItem value="50">50</SelectItem>
                                                <SelectItem value="100">100</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <span>
                                            {storages.from}-{storages.to} of {storages.total}
                                        </span>
                                    </div>

                                    <div className="admin-index-pagination-controls">
                                        {storages.links.map((link, index) => {
                                            if (link.label.includes('Previous')) {
                                                return (
                                                    <Button
                                                        key={index}
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={!link.url}
                                                        onClick={() => link.url && router.get(link.url)}
                                                    >
                                                        <ChevronLeft className="h-4 w-4" />
                                                        <span className="ml-1 hidden sm:inline">Previous</span>
                                                    </Button>
                                                );
                                            }
                                            if (link.label.includes('Next')) {
                                                return (
                                                    <Button
                                                        key={index}
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={!link.url}
                                                        onClick={() => link.url && router.get(link.url)}
                                                    >
                                                        <span className="mr-1 hidden sm:inline">Next</span>
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                );
                                            }
                                            if (!isNaN(parseInt(link.label))) {
                                                return (
                                                    <Button
                                                        key={index}
                                                        variant={link.active ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => link.url && router.get(link.url)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        {link.label}
                                                    </Button>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
