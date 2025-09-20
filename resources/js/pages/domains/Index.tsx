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
    ArrowRight,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Edit as EditIcon,
    Globe,
    Plus,
    Search,
    Shield,
    Trash2,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import Create from './Create';
import Edit from './Edit';

interface Domain {
    id: number;
    name: string;
    privilege: string;
    created_at: string;
}

interface Props {
    domains: {
        data: Domain[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
        from: number;
        to: number;
    };
    stats: {
        total: number;
        total_privileges: number;
        most_common: {
            name: string;
            count: number;
        };
    };
    filters: {
        search: string;
        per_page: number;
        sort: string;
        order: string;
    };
    hasSearchResults?: boolean;
    searchTerm?: string;
}

export default function Index({ domains, stats, filters, hasSearchResults, searchTerm }: Props) {
    const [searchInput, setSearchInput] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);

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
        params.append('sort', filters.sort);
        params.append('order', filters.order);

        if (page > 1) {
            params.append('page', page.toString());
        }

        const url = route('domains.index') + (params.toString() ? '?' + params.toString() : '');

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
        window.location.href = route('domains.index') + `?per_page=${perPage}&sort=${filters.sort}&order=${filters.order}`;
    };

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        const params = new URLSearchParams();
        const cleanSearch = searchInput?.trim() || '';

        if (cleanSearch) {
            params.append('search', cleanSearch);
        }

        params.append('per_page', newPerPage.toString());
        params.append('sort', filters.sort);
        params.append('order', filters.order);

        const url = route('domains.index') + '?' + params.toString();

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
        if (page < 1 || page > domains.last_page) return;
        handleSearch(searchInput, page);
    };

    // CRUD handlers
    const handleEdit = (domain: Domain) => {
        setSelectedDomain(domain);
        setEditDialogOpen(true);
    };

    const handleDelete = (domain: Domain) => {
        setSelectedDomain(domain);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedDomain) return;

        router.delete(route('domains.destroy', selectedDomain.id), {
            onSuccess: () => {
                toast.success('Domain deleted successfully');
                setDeleteDialogOpen(false);
                setSelectedDomain(null);
            },
            onError: (error) => {
                toast.error('Failed to delete domain');
                console.error('Delete error:', error);
            },
        });
    };

    const handleCreateSuccess = () => {
        setCreateDialogOpen(false);
        toast.success('Domain created successfully');
        router.get(route('domains.index', { per_page: perPage, sort: filters.sort, order: filters.order }), {}, { preserveState: false });
    };

    const handleEditSuccess = () => {
        setEditDialogOpen(false);
        setSelectedDomain(null);
        toast.success('Domain updated successfully');
        router.get(
            route('domains.index', {
                per_page: perPage,
                search: searchInput,
                sort: filters.sort,
                order: filters.order,
            }),
            {},
            { preserveState: false },
        );
    };

    // ✅ FIX: Search result message seperti storage
    const searchResultMessage = useMemo(() => {
        if (!searchTerm) return null;

        const total = domains.total;
        const dataText = total === 1 ? 'domain' : 'domains';

        return (
            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-blue-800 dark:text-blue-200">
                            Result '<span className="font-medium">{searchTerm}</span>' found <span className="font-medium">{total}</span> {dataText}
                        </span>
                    </div>
                    <button
                        onClick={handleClearSearch}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-200"
                    >
                        <X className="h-3 w-3" />
                        Show all domains
                    </button>
                </div>
            </div>
        );
    }, [searchTerm, domains.total]);

    return (
        <AppLayout title="Domain Management">
            <Head title="Domain Management" />

            <div className="admin-index-container">
                <div className="admin-index-content">
                    {/* Header */}
                    <div className="admin-index-header">
                        <div className="admin-index-header-info">
                            <h1>
                                <Globe />
                                Domain Management
                            </h1>
                            <p>Manage your domains and privileges</p>
                        </div>
                        <Button onClick={() => setCreateDialogOpen(true)} className="admin-index-add-btn">
                            <Plus />
                            Add Domain
                        </Button>
                    </div>

                    {/* ✅ IMPROVED: Stats Cards dengan Domain Usage Analytics */}
                    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <Card className="admin-index-card">
                            <CardContent className="p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Domains</span>
                                </div>
                                <div className="admin-index-text-blue text-2xl font-bold">{stats.total}</div>
                            </CardContent>
                        </Card>

                        <Card className="admin-index-card">
                            <CardContent className="p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-green-500" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Unique Privileges</span>
                                </div>
                                <div className="admin-index-text-green text-2xl font-bold">{stats.total_privileges}</div>
                            </CardContent>
                        </Card>

                        <Card className="admin-index-card">
                            <CardContent className="p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <Users className="h-4 w-4 text-purple-500" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Most Common</span>
                                </div>
                                <div className="admin-index-text-purple text-lg font-bold">
                                    {stats.most_common.name} ({stats.most_common.count})
                                </div>
                            </CardContent>
                        </Card>

                        {/* 🎯 NEW: Clickable Domain Usage Analytics Card */}
                        <Card className="admin-index-card group cursor-pointer border-orange-200 transition-all duration-200 hover:scale-[1.02] hover:border-orange-300 hover:shadow-lg dark:border-orange-800 dark:hover:border-orange-700">
                            <CardContent className="p-4">
                                <a href="#" className="block">
                                    <div className="mb-2 flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4 text-orange-500 transition-colors group-hover:text-orange-600" />
                                        <span className="text-sm font-medium text-gray-600 transition-colors group-hover:text-gray-800 dark:text-gray-300 dark:group-hover:text-gray-200">
                                            Domain Usage
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-orange-600 transition-colors group-hover:text-orange-700 dark:text-orange-400 dark:group-hover:text-orange-300">
                                            View Analytics
                                        </span>
                                        <ArrowRight className="h-4 w-4 text-orange-500 transition-all duration-200 group-hover:translate-x-1 group-hover:text-orange-600" />
                                    </div>
                                </a>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Card */}
                    <Card className="admin-index-card">
                        {/* Card Header dengan Search */}
                        <div className="admin-index-card-header">
                            <h2 className="admin-index-card-title">Domains</h2>

                            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                                <div className="admin-index-search">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        placeholder="Search domains by name..."
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
                                        <SelectItem value="5">5 per page</SelectItem>
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

                        {/* Desktop Table */}
                        <div className="admin-index-desktop">
                            <table className="admin-index-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Privilege</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {domains.data.length > 0 ? (
                                        domains.data.map((domain) => (
                                            <tr key={domain.id}>
                                                <td>
                                                    <div className="admin-index-table-icon">
                                                        <Globe className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                                        <span className="admin-index-font-semibold">{domain.name}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="admin-index-text-green admin-index-font-medium">{domain.privilege}</span>
                                                </td>
                                                <td>
                                                    <div className="admin-index-table-actions">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEdit(domain)}
                                                            className="admin-btn-edit"
                                                        >
                                                            <EditIcon className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(domain)}
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
                                            <td colSpan={3}>
                                                <div className="admin-index-empty">
                                                    <div className="admin-index-empty-icon">
                                                        <Globe />
                                                    </div>
                                                    <h3 className="admin-index-empty-title">No Domains Found</h3>
                                                    <p className="admin-index-empty-text">
                                                        {searchInput
                                                            ? `No domains found matching "${searchInput}". Try a different search term.`
                                                            : 'Get started by creating your first domain'}
                                                    </p>
                                                    {searchInput && (
                                                        <Button onClick={handleClearSearch} variant="outline" className="mt-4">
                                                            Show All Domains
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="admin-index-mobile">
                            {domains.data.length > 0 ? (
                                domains.data.map((domain) => (
                                    <div key={domain.id} className="admin-index-mobile-item">
                                        <div className="admin-index-mobile-header">
                                            <div className="admin-index-mobile-info">
                                                <Globe className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                                                <div>
                                                    <h3 className="admin-index-mobile-title">{domain.name}</h3>
                                                    <p className="admin-index-mobile-subtitle">{domain.privilege}</p>
                                                </div>
                                            </div>
                                            <div className="admin-index-mobile-actions">
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(domain)} className="admin-btn-edit">
                                                    <EditIcon className="h-3 w-3" />
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => handleDelete(domain)} className="admin-btn-delete">
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="admin-index-empty">
                                    <div className="admin-index-empty-icon">
                                        <Globe />
                                    </div>
                                    <h3 className="admin-index-empty-title">No Domains Found</h3>
                                    <p className="admin-index-empty-text">
                                        {searchInput
                                            ? `No domains found matching "${searchInput}". Try a different search term.`
                                            : 'Get started by creating your first domain'}
                                    </p>
                                    {searchInput && (
                                        <Button onClick={handleClearSearch} variant="outline" className="mt-4">
                                            Show All Domains
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {domains.last_page > 1 && (
                            <div className="admin-index-pagination">
                                <div className="admin-index-pagination-info">
                                    Showing {domains.from || 0} to {domains.to || 0} of {domains.total} results
                                </div>
                                <div className="admin-index-pagination-controls">
                                    <Button variant="outline" size="sm" onClick={() => handlePageChange(1)} disabled={domains.current_page === 1}>
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(domains.current_page - 1)}
                                        disabled={domains.current_page === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="px-3 py-2 text-sm">
                                        Page {domains.current_page} of {domains.last_page}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(domains.current_page + 1)}
                                        disabled={domains.current_page === domains.last_page}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(domains.last_page)}
                                        disabled={domains.current_page === domains.last_page}
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
                        <DialogTitle>Add New Domain</DialogTitle>
                        <DialogDescription>Create a new domain with custom privilege settings.</DialogDescription>
                    </DialogHeader>
                    <Create onSuccess={handleCreateSuccess} />
                </DialogContent>
            </Dialog>

            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Domain</DialogTitle>
                        <DialogDescription>Update the domain name and privilege settings.</DialogDescription>
                    </DialogHeader>
                    {selectedDomain && <Edit domain={selectedDomain} onSuccess={handleEditSuccess} />}
                </DialogContent>
            </Dialog>

            {/* ✅ FIX: Alert Dialog dengan dark mode yang konsisten seperti Storage */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900 dark:text-gray-100">Delete Domain</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                            Are you sure you want to delete the domain{' '}
                            <span className="font-medium text-gray-900 dark:text-gray-100">{selectedDomain?.name}</span>? This action cannot be
                            undone.
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
