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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowRight,
    ArrowUp,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Edit as EditIcon,
    HardDrive,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import Create from './Create';
import Edit from './Edit';

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
    };
    stats: {
        total_plans: number;
        min: number;
        max: number;
    };
    filters: {
        search: string;
        per_page: number;
    };
    hasSearchResults?: boolean;
    searchTerm?: string;
}

export default function Index({ storages, stats, filters, hasSearchResults, searchTerm }: Props) {
    const [searchInput, setSearchInput] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedStorage, setSelectedStorage] = useState<Storage | null>(null);

    const debouncedSearchTerm = useDebounce(searchInput, 500);

    // Handle search
    useEffect(() => {
        if (debouncedSearchTerm === filters.search) return;
        handleSearch(debouncedSearchTerm, 1);
    }, [debouncedSearchTerm]);

    const handleSearch = (search: string, page: number = 1) => {
        const params = new URLSearchParams();
        const cleanSearch = search?.trim() || '';

        if (cleanSearch) {
            params.append('search', cleanSearch);
        }

        params.append('per_page', perPage.toString());

        if (page > 1) {
            params.append('page', page.toString());
        }

        const url = route('storages.index') + (params.toString() ? '?' + params.toString() : '');

        router.get(
            url,
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleClearSearch = () => {
        setSearchInput('');
        window.location.href = route('storages.index') + `?per_page=${perPage}`;
    };

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        const params = new URLSearchParams();
        const cleanSearch = searchInput?.trim() || '';

        if (cleanSearch) {
            params.append('search', cleanSearch);
        }

        params.append('per_page', newPerPage.toString());

        const url = route('storages.index') + '?' + params.toString();

        router.get(
            url,
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > storages.last_page) return;
        handleSearch(searchInput, page);
    };

    // CRUD handlers
    const handleEdit = (storage: Storage) => {
        setSelectedStorage(storage);
        setEditDialogOpen(true);
    };

    const handleDelete = (storage: Storage) => {
        setSelectedStorage(storage);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedStorage) return;

        router.delete(route('storages.destroy', selectedStorage.id), {
            onSuccess: () => {
                toast.success('Storage plan deleted successfully');
                setDeleteDialogOpen(false);
                setSelectedStorage(null);
            },
            onError: (error) => {
                toast.error('Failed to delete storage plan');
                console.error('Delete error:', error);
            },
        });
    };

    const handleCreateSuccess = () => {
        setCreateDialogOpen(false);
        toast.success('Storage plan created successfully');
        router.get(route('storages.index', { per_page: perPage }), {}, { preserveState: false });
    };

    const handleEditSuccess = () => {
        setEditDialogOpen(false);
        setSelectedStorage(null);
        toast.success('Storage plan updated successfully');
        router.get(route('storages.index', { per_page: perPage, search: searchInput }), {}, { preserveState: false });
    };

    // ✅ FIX: Search result message
    const searchResultMessage = useMemo(() => {
        if (!searchTerm) return null;

        const total = storages.total;
        const dataText = total === 1 ? 'data' : 'data';
        const sizeText = searchTerm.toLowerCase().includes('gb') ? searchTerm : `${searchTerm}GB`;

        return (
            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-blue-800 dark:text-blue-200">
                            Result '<span className="font-medium">{sizeText}</span>' found <span className="font-medium">{total}</span> {dataText}
                        </span>
                    </div>
                    <button
                        onClick={handleClearSearch}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-200"
                    >
                        <X className="h-3 w-3" />
                        Show all plans
                    </button>
                </div>
            </div>
        );
    }, [searchTerm, storages.total]);

    return (
        <AppLayout title="Storage Management">
            <Head title="Storage Management" />

            <div className="admin-index-container">
                <div className="admin-index-content">
                    {/* Header - sama seperti Domain */}
                    <div className="admin-index-header">
                        <div className="admin-index-header-info">
                            <h1>
                                <HardDrive />
                                Storage Management
                            </h1>
                            <p>Configure storage plans and pricing for different user types</p>
                        </div>
                        <Button onClick={() => setCreateDialogOpen(true)} className="admin-index-add-btn">
                            <Plus />
                            Add Storage Plan
                        </Button>
                    </div>

                    {/* Stats Cards - sama seperti Domain */}

                    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <Card className="admin-index-card group cursor-pointer transition-all duration-200 hover:shadow-md">
                            <CardContent className="p-4">
                                <a href="#" className="block">
                                    <div className="mb-2 flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4 text-orange-500 transition-colors group-hover:text-orange-600" />
                                        <span className="text-sm font-medium text-gray-600 transition-colors group-hover:text-gray-800 dark:text-gray-300 dark:group-hover:text-gray-200">
                                            Usage Analytics
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-bold text-orange-600 transition-colors group-hover:text-orange-700 dark:text-orange-400 dark:group-hover:text-orange-300">
                                            View Details
                                        </span>
                                        <ArrowRight className="h-4 w-4 text-orange-500 transition-all duration-200 group-hover:translate-x-1 group-hover:text-orange-600" />
                                    </div>
                                </a>
                            </CardContent>
                        </Card>
                        <Card className="admin-index-card">
                            <CardContent className="p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <HardDrive className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Plans</span>
                                </div>
                                <div className="admin-index-text-blue text-2xl font-bold">{stats.total_plans}</div>
                            </CardContent>
                        </Card>
                        <Card className="admin-index-card">
                            <CardContent className="p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <ArrowDown className="h-4 w-4 text-green-500" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Min Size</span>
                                </div>
                                <div className="admin-index-text-green text-2xl font-bold">{stats.min} GB</div>
                            </CardContent>
                        </Card>
                        <Card className="admin-index-card">
                            <CardContent className="p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <ArrowUp className="h-4 w-4 text-purple-500" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Max Size</span>
                                </div>
                                <div className="admin-index-text-purple text-2xl font-bold">{stats.max} GB</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Card - sama seperti Domain */}
                    <Card className="admin-index-card">
                        {/* Card Header dengan Search */}
                        <div className="admin-index-card-header">
                            <h2 className="admin-index-card-title">Storage Plans</h2>

                            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                                <div className="admin-index-search">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        placeholder="Search by storage size (e.g., 100, 500, 5000)..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        className="pr-10 pl-10"
                                    />
                                    {searchInput && (
                                        <button
                                            onClick={handleClearSearch}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                <Select value={perPage.toString()} onValueChange={(value) => handlePerPageChange(parseInt(value))}>
                                    <SelectTrigger className="w-full sm:w-auto">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10 per page</SelectItem>
                                        <SelectItem value="25">25 per page</SelectItem>
                                        <SelectItem value="50">50 per page</SelectItem>
                                        <SelectItem value="100">100 per page</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* ✅ FIX: Search Result Message */}
                        {searchResultMessage}

                        {/* Desktop Table - sama seperti Domain */}
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
                                                        <HardDrive className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                                        <span className="admin-index-font-semibold">{storage.size} GB</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="admin-index-text-green admin-index-font-medium">
                                                        Rp {storage.price_admin_annual.toLocaleString('id-ID')}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="admin-index-text-green admin-index-font-medium">
                                                        Rp {storage.price_admin_monthly.toLocaleString('id-ID')}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="admin-index-text-purple admin-index-font-medium">
                                                        Rp {storage.price_member_annual.toLocaleString('id-ID')}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="admin-index-text-purple admin-index-font-medium">
                                                        Rp {storage.price_member_monthly.toLocaleString('id-ID')}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="admin-index-table-actions">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEdit(storage)}
                                                            className="admin-btn-edit"
                                                        >
                                                            <EditIcon className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(storage)}
                                                            className="admin-btn-delete"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6}>
                                                <div className="admin-index-empty">
                                                    <div className="admin-index-empty-icon">
                                                        <HardDrive />
                                                    </div>
                                                    <h3 className="admin-index-empty-title">No Storage Plans Found</h3>
                                                    <p className="admin-index-empty-text">
                                                        {searchInput
                                                            ? `No storage plans found with size matching "${searchInput}". Try a different size value.`
                                                            : 'Get started by creating your first storage plan'}
                                                    </p>
                                                    {searchInput && (
                                                        <Button onClick={handleClearSearch} variant="outline" className="mt-4">
                                                            Show All Plans
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View - sama seperti Domain */}
                        <div className="admin-index-mobile">
                            {storages.data.length > 0 ? (
                                storages.data.map((storage) => (
                                    <div key={storage.id} className="admin-index-mobile-item">
                                        <div className="admin-index-mobile-header">
                                            <div className="admin-index-mobile-info">
                                                <HardDrive className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                                                <div>
                                                    <h3 className="admin-index-mobile-title">{storage.size} GB</h3>
                                                    <p className="admin-index-mobile-subtitle">Storage Plan</p>
                                                </div>
                                            </div>
                                            <div className="admin-index-mobile-actions">
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(storage)} className="admin-btn-edit">
                                                    <EditIcon className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(storage)}
                                                    className="admin-btn-delete"
                                                >
                                                    <Trash2 className="h-3 w-3" />
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
                                    <div className="admin-index-empty-icon">
                                        <HardDrive />
                                    </div>
                                    <h3 className="admin-index-empty-title">No Storage Plans Found</h3>
                                    <p className="admin-index-empty-text">
                                        {searchInput
                                            ? `No storage plans found with size matching "${searchInput}". Try a different size value.`
                                            : 'Get started by creating your first storage plan'}
                                    </p>
                                    {searchInput && (
                                        <Button onClick={handleClearSearch} variant="outline" className="mt-4">
                                            Show All Plans
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Pagination - sama seperti Domain */}
                        {storages.last_page > 1 && (
                            <div className="admin-index-pagination">
                                <div className="admin-index-pagination-info">
                                    Showing {storages.from || 0} to {storages.to || 0} of {storages.total} results
                                </div>
                                <div className="admin-index-pagination-controls">
                                    <Button variant="outline" size="sm" onClick={() => handlePageChange(1)} disabled={storages.current_page === 1}>
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(storages.current_page - 1)}
                                        disabled={storages.current_page === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="px-3 py-2 text-sm">
                                        Page {storages.current_page} of {storages.last_page}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(storages.current_page + 1)}
                                        disabled={storages.current_page === storages.last_page}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(storages.last_page)}
                                        disabled={storages.current_page === storages.last_page}
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Dialogs */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add New Storage Plan</DialogTitle>
                        <DialogDescription>Create a new storage plan with custom pricing for different user types.</DialogDescription>
                    </DialogHeader>
                    <Create onSuccess={handleCreateSuccess} onClose={() => setCreateDialogOpen(false)} storageList={storages.data} />
                </DialogContent>
            </Dialog>

            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Storage Plan</DialogTitle>
                        <DialogDescription>Update the storage plan details and pricing.</DialogDescription>
                    </DialogHeader>
                    {selectedStorage && (
                        <Edit
                            storage={selectedStorage}
                            onSuccess={handleEditSuccess}
                            onClose={() => {
                                setEditDialogOpen(false);
                                setSelectedStorage(null);
                            }}
                            storageList={storages.data}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* ✅ FIX: Alert Dialog dengan dark mode yang konsisten seperti Domain */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900 dark:text-gray-100">Delete Storage Plan</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                            Are you sure you want to delete the{' '}
                            <span className="font-medium text-gray-900 dark:text-gray-100">{selectedStorage?.size}GB</span> storage plan? This action
                            cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
