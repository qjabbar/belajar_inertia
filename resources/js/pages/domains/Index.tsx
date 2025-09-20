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
import { Head, router } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Edit as EditIcon,
    Globe,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import Create from './Create';
import EditDomain from './Edit';

interface Domain {
    id: number;
    name: string;
    privilege: string;
    created_at?: string;
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
    };
    filters: {
        search: string;
        per_page: number;
        sort: string;
        order: string;
    };
}

function Index({ domains, stats, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [perPage, setPerPage] = useState(filters.per_page.toString());

    const debouncedSearch = useDebounce(searchTerm, 300);

    // Sync search with URL
    useEffect(() => {
        if (debouncedSearch !== filters.search) {
            handleSearch();
        }
    }, [debouncedSearch]);

    // Sync perPage state with props
    useEffect(() => {
        setPerPage(filters.per_page.toString());
    }, [filters.per_page]);

    const filteredDomains = useMemo(() => {
        if (!debouncedSearch && !searchTerm) return domains.data;

        const searchLower = searchTerm.toLowerCase();
        return domains.data.filter(
            (domain) => domain.name.toLowerCase().includes(searchLower) || domain.privilege.toLowerCase().includes(searchLower),
        );
    }, [domains.data, searchTerm]);

    const handleEdit = (domain: Domain) => {
        setSelectedDomain(domain);
        setEditDialogOpen(true);
    };

    const handleDeleteClick = (domain: Domain) => {
        setSelectedDomain(domain);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedDomain) return;

        setDeleteLoading(true);

        router.delete(route('domains.destroy', selectedDomain.id), {
            onSuccess: () => {
                toast.success(`Domain "${selectedDomain.name}" deleted successfully`);
                setDeleteDialogOpen(false);
                setSelectedDomain(null);
            },
            onError: () => {
                toast.error('Failed to delete domain');
            },
            onFinish: () => {
                setDeleteLoading(false);
            },
        });
    };

    const handleCreateSuccess = () => {
        setCreateDialogOpen(false);
        router.reload({ only: ['domains'] });
    };

    const handleEditSuccess = () => {
        setEditDialogOpen(false);
        setSelectedDomain(null);
        router.reload({ only: ['domains'] });
    };

    const handleSearch = () => {
        const currentParams = new URLSearchParams(window.location.search);

        router.get(
            route('domains.index'),
            {
                search: debouncedSearch,
                per_page: filters.per_page,
                sort: filters.sort,
                order: filters.order,
                page: 1, // Reset to first page when searching
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleSort = (field: string) => {
        const newOrder = filters.sort === field && filters.order === 'asc' ? 'desc' : 'asc';

        router.get(
            route('domains.index'),
            {
                search: filters.search,
                per_page: filters.per_page,
                sort: field,
                order: newOrder,
                page: domains.current_page,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handlePageChange = (pageNumber: number) => {
        router.get(
            route('domains.index'),
            {
                page: pageNumber,
                per_page: filters.per_page,
                search: filters.search,
                sort: filters.sort,
                order: filters.order,
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

        router.get(
            route('domains.index'),
            {
                per_page: newPerPage,
                page: 1,
                search: filters.search,
                sort: filters.sort,
                order: filters.order,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const getSortIcon = (field: string) => {
        if (filters.sort !== field) return <ArrowUpDown className="h-4 w-4" />;
        return filters.order === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
    };

    // Generate page numbers for pagination
    const generatePageNumbers = () => {
        const pages = [];
        const currentPage = domains.current_page;
        const lastPage = domains.last_page;

        if (currentPage > 3) {
            pages.push(1);
            if (currentPage > 4) {
                pages.push('...');
            }
        }

        for (let i = Math.max(1, currentPage - 2); i <= Math.min(lastPage, currentPage + 2); i++) {
            pages.push(i);
        }

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
            <Head title="Domain Management" />

            <div className="admin-index-container">
                <div className="admin-index-content">
                    {/* Header */}
                    <div className="admin-index-header">
                        <div className="admin-index-header-info">
                            <h1>
                                <Globe className="text-blue-600" />
                                Domain Management
                            </h1>
                            <p>Manage your domains and privileges</p>
                        </div>

                        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="admin-index-add-btn">
                                    <Plus size={20} />
                                    Add Domain
                                </Button>
                            </DialogTrigger>
                            <Create onSuccess={handleCreateSuccess} />
                        </Dialog>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800">
                            <div className="flex items-center">
                                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                                    <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Domains</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800">
                            <div className="flex items-center">
                                <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                                    <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unique Privileges</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_privileges}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Card */}
                    <Card className="admin-index-card">
                        <div className="admin-index-card-header">
                            <h2 className="admin-index-card-title">Domain List</h2>

                            <div className="flex items-center gap-4">
                                {/* Per Page Selector */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Show:</span>
                                    <Select value={perPage} onValueChange={handlePerPageChange}>
                                        <SelectTrigger className="h-8 w-20">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">5</SelectItem>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="25">25</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                            <SelectItem value="100">100</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Search */}
                                <div className="admin-index-search">
                                    <Search className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" size={16} />
                                    <Input
                                        placeholder="Search domains..."
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
                                {filteredDomains.length > 0 ? (
                                    <table className="admin-index-table">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleSort('name')}
                                                        className="h-8 px-2 hover:bg-gray-100"
                                                    >
                                                        Domain Name
                                                        {getSortIcon('name')}
                                                    </Button>
                                                </th>
                                                <th>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleSort('privilege')}
                                                        className="h-8 px-2 hover:bg-gray-100"
                                                    >
                                                        Privilege
                                                        {getSortIcon('privilege')}
                                                    </Button>
                                                </th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredDomains.map((domain) => (
                                                <tr key={domain.id}>
                                                    <td>
                                                        <div className="admin-index-table-icon">
                                                            <Globe className="text-blue-600" size={18} />
                                                            <span className="font-medium">{domain.name}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                                domain.privilege === 'semua'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : domain.privilege === 'terbatas'
                                                                      ? 'bg-yellow-100 text-yellow-800'
                                                                      : domain.privilege === 'nonaktif'
                                                                        ? 'bg-red-100 text-red-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                            }`}
                                                        >
                                                            {domain.privilege === 'semua'
                                                                ? 'Semua'
                                                                : domain.privilege === 'terbatas'
                                                                  ? 'Terbatas'
                                                                  : domain.privilege === 'nonaktif'
                                                                    ? 'Nonaktif'
                                                                    : domain.privilege}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="admin-index-table-actions">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEdit(domain)}
                                                                className="border-blue-200 bg-white text-blue-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-800 dark:bg-slate-800 dark:text-blue-400 dark:hover:border-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
                                                            >
                                                                <EditIcon size={14} />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDeleteClick(domain)}
                                                                className="border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:bg-slate-800 dark:text-red-400 dark:hover:border-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                                                            >
                                                                <Trash2 size={14} />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="admin-index-empty">
                                        <Globe className="admin-index-empty-icon" />
                                        <h3 className="admin-index-empty-title">{searchTerm ? 'No domains found' : 'No domains configured'}</h3>
                                        <p className="admin-index-empty-text">
                                            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first domain'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Mobile View */}
                            <div className="admin-index-mobile">
                                {filteredDomains.length > 0 ? (
                                    filteredDomains.map((domain) => (
                                        <div key={domain.id} className="admin-index-mobile-item">
                                            <div className="admin-index-mobile-header">
                                                <div className="admin-index-mobile-info">
                                                    <Globe className="text-blue-600" size={20} />
                                                    <div>
                                                        <h3 className="admin-index-mobile-title">{domain.name}</h3>
                                                        <p className="admin-index-mobile-subtitle">Domain</p>
                                                    </div>
                                                </div>

                                                <div className="admin-index-mobile-actions">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEdit(domain)}
                                                        className="border-blue-200 bg-white text-blue-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-800 dark:bg-slate-800 dark:text-blue-400 dark:hover:border-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
                                                    >
                                                        <EditIcon size={14} />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(domain)}
                                                        className="border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:bg-slate-800 dark:text-red-400 dark:hover:border-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="admin-index-mobile-content">
                                                <div className="admin-index-mobile-section">
                                                    <div className="admin-index-mobile-section-title">Privilege</div>
                                                    <div className="admin-index-mobile-row">
                                                        <span
                                                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                                domain.privilege === 'semua'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : domain.privilege === 'terbatas'
                                                                      ? 'bg-yellow-100 text-yellow-800'
                                                                      : domain.privilege === 'nonaktif'
                                                                        ? 'bg-red-100 text-red-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                            }`}
                                                        >
                                                            {domain.privilege === 'semua'
                                                                ? 'Semua'
                                                                : domain.privilege === 'terbatas'
                                                                  ? 'Terbatas'
                                                                  : domain.privilege === 'nonaktif'
                                                                    ? 'Nonaktif'
                                                                    : domain.privilege}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="admin-index-empty">
                                        <Globe className="admin-index-empty-icon" />
                                        <h3 className="admin-index-empty-title">{searchTerm ? 'No domains found' : 'No domains configured'}</h3>
                                        <p className="admin-index-empty-text">
                                            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first domain'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>

                        {/* Pagination Section */}
                        {domains.data.length > 0 && domains.last_page > 1 && (
                            <div className="admin-index-pagination">
                                <div className="admin-index-pagination-info">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Showing <span className="font-medium">{domains.from}</span> to{' '}
                                        <span className="font-medium">{domains.to}</span> of <span className="font-medium">{domains.total}</span>{' '}
                                        domains
                                    </span>
                                </div>

                                <div className="admin-index-pagination-controls">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(1)}
                                        disabled={domains.current_page === 1}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(domains.current_page - 1)}
                                        disabled={domains.current_page === 1}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    {generatePageNumbers().map((page, index) => (
                                        <Button
                                            key={index}
                                            variant={page === domains.current_page ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => page !== '...' && typeof page === 'number' && handlePageChange(page)}
                                            disabled={page === '...'}
                                            className="h-8 min-w-8 px-2"
                                        >
                                            {page}
                                        </Button>
                                    ))}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(domains.current_page + 1)}
                                        disabled={domains.current_page === domains.last_page}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(domains.last_page)}
                                        disabled={domains.current_page === domains.last_page}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Edit Dialog */}
                    {selectedDomain && (
                        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                            <EditDomain domain={selectedDomain} onSuccess={handleEditSuccess} />
                        </Dialog>
                    )}

                    {/* Delete Alert Dialog */}
                    {/* Delete Alert Dialog - FIXED DARK MODE */}
                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <AlertDialogContent className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-slate-900 dark:text-slate-100">Delete Domain</AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
                                    Are you sure you want to delete the domain{' '}
                                    <span className="font-medium text-slate-900 dark:text-slate-100">"{selectedDomain?.name}"</span>? This action
                                    cannot be undone.
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
                                        'Delete'
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </>
    );
}

export default Index;

const breadcrumbs: BreadcrumbItemType[] = [{ title: 'Domain Management', href: '/domains' }];

Index.layout = (page: React.ReactElement) => (
    <AppLayout title="Domain Management" breadcrumbs={breadcrumbs}>
        {page}
    </AppLayout>
);
