import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit as EditIcon, HardDrive, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import Create from './Create';
import EditStorage from './Edit';

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
        per_page: number;
        total: number;
        last_page: number;
        from: number;
        to: number;
        links?: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

function Index({ storages }: Props) {
    const page = usePage();
    const [searchTerm, setSearchTerm] = useState('');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedStorage, setSelectedStorage] = useState<Storage | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [perPage, setPerPage] = useState(storages.per_page.toString());

    const debouncedSearch = useDebounce(searchTerm, 300);

    // Sync perPage state with props
    useEffect(() => {
        setPerPage(storages.per_page.toString());
    }, [storages.per_page]);

    const filteredStorages = useMemo(() => {
        if (!debouncedSearch) return storages.data;
        return storages.data.filter((storage) => storage.size.toString().includes(debouncedSearch.toLowerCase()));
    }, [storages.data, debouncedSearch]);

    const handleEdit = (storage: Storage) => {
        setSelectedStorage(storage);
        setEditDialogOpen(true);
    };

    // New delete handlers
    const handleDeleteClick = (storage: Storage) => {
        setSelectedStorage(storage);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedStorage) return;

        setDeleteLoading(true);

        router.delete(route('storages.destroy', selectedStorage.id), {
            onSuccess: () => {
                toast.success(`Storage plan ${selectedStorage.size}GB deleted successfully`);
                setDeleteDialogOpen(false);
                setSelectedStorage(null);
            },
            onError: () => {
                toast.error('Failed to delete storage plan');
            },
            onFinish: () => {
                setDeleteLoading(false);
            },
        });
    };

    const handleCreateSuccess = () => {
        setCreateDialogOpen(false);
        router.reload({ only: ['storages'] });
    };

    const handleEditSuccess = () => {
        setEditDialogOpen(false);
        setSelectedStorage(null);
        router.reload({ only: ['storages'] });
    };

    // FIX: Updated pagination handler dengan per_page parameter
    const handlePageChange = (pageNumber: number) => {
        const currentParams = new URLSearchParams(window.location.search);

        router.get(
            route('storages.index'),
            {
                page: pageNumber,
                per_page: storages.per_page, // FIX: Pastikan per_page tetap dipertahankan
                search: currentParams.get('search') || undefined, // Preserve search if any
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handlePerPageChange = (newPerPage: string) => {
        setPerPage(newPerPage);
        const currentParams = new URLSearchParams(window.location.search);

        router.get(
            route('storages.index'),
            {
                per_page: newPerPage,
                page: 1, // Reset to first page when changing per_page
                search: currentParams.get('search') || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    // Generate page numbers for pagination
    const generatePageNumbers = () => {
        const pages = [];
        const currentPage = storages.current_page;
        const lastPage = storages.last_page;

        // Always show first page
        if (currentPage > 3) {
            pages.push(1);
            if (currentPage > 4) {
                pages.push('...');
            }
        }

        // Show pages around current page
        for (let i = Math.max(1, currentPage - 2); i <= Math.min(lastPage, currentPage + 2); i++) {
            pages.push(i);
        }

        // Always show last page
        if (currentPage < lastPage - 2) {
            if (currentPage < lastPage - 3) {
                pages.push('...');
            }
            pages.push(lastPage);
        }

        return pages;
    };

    return (
        <>
            <Head title="Storage Management" />

            <div className="admin-index-container">
                <div className="admin-index-content">
                    {/* Header */}
                    <div className="admin-index-header">
                        <div className="admin-index-header-info">
                            <h1 className="text-gray-900 dark:text-white">
                                <HardDrive className="text-blue-600" />
                                Storage Management
                            </h1>
                            <p>Configure storage plans and pricing for different user types</p>
                        </div>

                        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="admin-index-add-btn">
                                    <Plus size={20} />
                                    Add Storage Plan
                                </Button>
                            </DialogTrigger>
                            <Create onSuccess={handleCreateSuccess} storageList={storages.data} />
                        </Dialog>
                    </div>

                    {/* Main Card */}
                    <Card className="admin-index-card">
                        <div className="admin-index-card-header">
                            <h2 className="admin-index-card-title text-gray-900 dark:text-white">Storage Plans</h2>

                            <div className="flex items-center gap-4">
                                {/* Per Page Selector */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Show:</span>
                                    <Select value={perPage} onValueChange={handlePerPageChange}>
                                        <SelectTrigger className="h-8 w-20">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                            <SelectItem value="100">100</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Search */}
                                <div className="admin-index-search">
                                    <Search className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" size={16} />
                                    <Input
                                        placeholder="Search storage plans..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>

                        <CardContent className="p-0">
                            {/* Desktop View */}
                            <div className="admin-index-desktop">
                                {filteredStorages.length > 0 ? (
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
                                            {filteredStorages.map((storage) => (
                                                <tr key={storage.id}>
                                                    <td>
                                                        <div className="admin-index-table-icon">
                                                            <HardDrive className="text-blue-600" size={18} />
                                                            <span className="font-medium">{storage.size} GB</span>
                                                        </div>
                                                    </td>
                                                    <td className="admin-index-text-green admin-index-font-medium">
                                                        Rp {storage.price_admin_annual.toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="admin-index-text-green admin-index-font-medium">
                                                        Rp {storage.price_admin_monthly.toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="admin-index-text-purple admin-index-font-medium">
                                                        Rp {storage.price_member_annual.toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="admin-index-text-purple admin-index-font-medium">
                                                        Rp {storage.price_member_monthly.toLocaleString('id-ID')}
                                                    </td>
                                                    <td>
                                                        <div className="admin-index-table-actions">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEdit(storage)}
                                                                className="border-blue-200 bg-white text-blue-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-800 dark:bg-slate-800 dark:text-blue-400 dark:hover:border-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
                                                            >
                                                                <EditIcon size={14} />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDeleteClick(storage)}
                                                                className="border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:bg-slate-800 dark:text-red-400 dark:hover:border-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                                                            >
                                                                {deleteLoading && selectedStorage?.id === storage.id ? (
                                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent dark:border-red-400" />
                                                                ) : (
                                                                    <Trash2 size={14} />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="admin-index-empty">
                                        <HardDrive className="admin-index-empty-icon" />
                                        <h3 className="admin-index-empty-title text-gray-900 dark:text-white">
                                            {searchTerm ? 'No storage plans found' : 'No storage plans configured'}
                                        </h3>
                                        <p className="admin-index-empty-text text-gray-700 dark:text-gray-200">
                                            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first storage plan'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Mobile View */}
                            <div className="admin-index-mobile">
                                {filteredStorages.length > 0 ? (
                                    filteredStorages.map((storage) => (
                                        <div key={storage.id} className="admin-index-mobile-item">
                                            <div className="admin-index-mobile-header">
                                                <div className="admin-index-mobile-info">
                                                    <HardDrive className="text-blue-600" size={20} />
                                                    <div>
                                                        <h3 className="admin-index-mobile-title">{storage.size} GB</h3>
                                                        <p className="admin-index-mobile-subtitle">Storage Plan</p>
                                                    </div>
                                                </div>

                                                <div className="admin-index-mobile-actions">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEdit(storage)}
                                                        className="border-blue-200 bg-white text-blue-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-800 dark:bg-slate-800 dark:text-blue-400 dark:hover:border-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
                                                    >
                                                        <EditIcon size={14} />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(storage)}
                                                        className="border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:bg-slate-800 dark:text-red-400 dark:hover:border-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                                                    >
                                                        <Trash2 size={14} />
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
                                        <h3 className="admin-index-empty-title">
                                            {searchTerm ? 'No storage plans found' : 'No storage plans configured'}
                                        </h3>
                                        <p className="admin-index-empty-text">
                                            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first storage plan'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>

                        {/* Pagination Section */}
                        {storages.data.length > 0 && storages.last_page > 1 && (
                            <div className="admin-index-pagination">
                                <div className="admin-index-pagination-info">
                                    <span className="text-sm text-gray-700 dark:text-gray-200">
                                        Showing <span className="font-medium">{storages.from}</span> to{' '}
                                        <span className="font-medium">{storages.to}</span> of <span className="font-medium">{storages.total}</span>{' '}
                                        storage plans
                                    </span>
                                </div>

                                <div className="admin-index-pagination-controls">
                                    {/* First Page */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(1)}
                                        disabled={storages.current_page === 1}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>

                                    {/* Previous Page */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(storages.current_page - 1)}
                                        disabled={storages.current_page === 1}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    {/* Page Numbers */}
                                    {generatePageNumbers().map((page, index) => (
                                        <Button
                                            key={index}
                                            variant={page === storages.current_page ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => page !== '...' && typeof page === 'number' && handlePageChange(page)}
                                            disabled={page === '...'}
                                            className="h-8 min-w-8 px-2"
                                        >
                                            {page}
                                        </Button>
                                    ))}

                                    {/* Next Page */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(storages.current_page + 1)}
                                        disabled={storages.current_page === storages.last_page}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>

                                    {/* Last Page */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(storages.last_page)}
                                        disabled={storages.current_page === storages.last_page}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Edit Dialog */}
                    {selectedStorage && (
                        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                            <EditStorage storage={selectedStorage} onSuccess={handleEditSuccess} storageList={storages.data} />
                        </Dialog>
                    )}
                </div>
            </div>

            {/* Delete Alert Dialog */}
            {/* Delete Alert Dialog - FIXED DARK MODE */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-900 dark:text-slate-100">Delete Storage Plan</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
                            Are you sure you want to delete the{' '}
                            <span className="font-medium text-slate-900 dark:text-slate-100">{selectedStorage?.size}GB</span> storage plan? This
                            action cannot be undone and will affect all users currently using this storage tier.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel
                            disabled={deleteLoading}
                            className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={deleteLoading}
                            className="border-0 bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                        >
                            {deleteLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Deleting...
                                </div>
                            ) : (
                                'Delete Storage Plan'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default Index;

const breadcrumbs: BreadcrumbItemType[] = [{ title: 'Storage Management', href: '/storages' }];

Index.layout = (page: React.ReactElement) => (
    <AppLayout title="Storage Management" breadcrumbs={breadcrumbs}>
        {page}
    </AppLayout>
);
