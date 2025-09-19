import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Edit as EditIcon, HardDrive, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import Create from './Create';
import EditStorage from './Edit';

// TAMBAH: Import AppLayout

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
}

function Index({ storages }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedStorage, setSelectedStorage] = useState<Storage | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

    const debouncedSearch = useDebounce(searchTerm, 300);

    const filteredStorages = useMemo(() => {
        if (!debouncedSearch) return storages.data;

        return storages.data.filter((storage) => storage.size.toString().includes(debouncedSearch.toLowerCase()));
    }, [storages.data, debouncedSearch]);

    const handleEdit = (storage: Storage) => {
        setSelectedStorage(storage);
        setEditDialogOpen(true);
    };

    const handleDelete = async (storage: Storage) => {
        if (!confirm(`Are you sure you want to delete ${storage.size}GB storage plan?`)) {
            return;
        }

        setDeleteLoading(storage.id);

        router.delete(route('storages.destroy', storage.id), {
            onSuccess: () => {
                toast.success(`${storage.size}GB storage plan deleted successfully`);
            },
            onError: () => {
                toast.error('Failed to delete storage plan');
            },
            onFinish: () => {
                setDeleteLoading(null);
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

    return (
        <>
            <Head title="Storage Management" />

            <div className="admin-index-container">
                <div className="admin-index-content">
                    {/* Header */}
                    <div className="admin-index-header">
                        <div className="admin-index-header-info">
                            <h1>
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
                            <h2 className="admin-index-card-title">Storage Plans</h2>

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
                                                                className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                                            >
                                                                <EditIcon size={14} />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDelete(storage)}
                                                                disabled={deleteLoading === storage.id}
                                                                className="border-red-200 text-red-600 hover:bg-red-50"
                                                            >
                                                                {deleteLoading === storage.id ? (
                                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
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
                                        <h3 className="admin-index-empty-title">
                                            {searchTerm ? 'No storage plans found' : 'No storage plans configured'}
                                        </h3>
                                        <p className="admin-index-empty-text">
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
                                                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                                    >
                                                        <EditIcon size={14} />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(storage)}
                                                        disabled={deleteLoading === storage.id}
                                                        className="border-red-200 text-red-600 hover:bg-red-50"
                                                    >
                                                        {deleteLoading === storage.id ? (
                                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                                                        ) : (
                                                            <Trash2 size={14} />
                                                        )}
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
                    </Card>

                    {/* Edit Dialog */}
                    {selectedStorage && (
                        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                            <EditStorage storage={selectedStorage} onSuccess={handleEditSuccess} storageList={storages.data} />
                        </Dialog>
                    )}
                </div>
            </div>
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
