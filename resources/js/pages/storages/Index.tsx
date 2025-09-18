import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { HardDrive, Pencil, Plus, Trash2 } from 'lucide-react';

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
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

export default function Index({ storages }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this storage?')) {
            router.delete(route('storages.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Storages" />
            <div className="flex-1 space-y-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <HardDrive className="text-primary h-6 w-6" />
                            Storage Management
                        </h1>
                        <p className="text-muted-foreground">Manage your storage plans and pricing</p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="gap-2">
                        <Link href={route('storages.create')}>
                            <Plus className="h-4 w-4" />
                            Add Storage
                        </Link>
                    </Button>
                </div>
                <Card className="border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Storage List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="min-w-full rounded border bg-white">
                                <thead>
                                    <tr>
                                        <th className="border px-4 py-2 text-left">Size</th>
                                        <th className="border px-4 py-2 text-left">Admin Annual</th>
                                        <th className="border px-4 py-2 text-left">Admin Monthly</th>
                                        <th className="border px-4 py-2 text-left">Member Annual</th>
                                        <th className="border px-4 py-2 text-left">Member Monthly</th>
                                        <th className="border px-4 py-2 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {storages.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-muted-foreground border px-4 py-6 text-center">
                                                No storages found.
                                            </td>
                                        </tr>
                                    ) : (
                                        storages.data.map((storage) => (
                                            <tr key={storage.id} className="hover:bg-muted/20">
                                                <td className="border px-4 py-2">{storage.size} GB</td>
                                                <td className="border px-4 py-2">Rp {storage.price_admin_annual.toLocaleString('id-ID')}</td>
                                                <td className="border px-4 py-2">Rp {storage.price_admin_monthly.toLocaleString('id-ID')}</td>
                                                <td className="border px-4 py-2">Rp {storage.price_member_annual.toLocaleString('id-ID')}</td>
                                                <td className="border px-4 py-2">Rp {storage.price_member_monthly.toLocaleString('id-ID')}</td>
                                                <td className="border px-4 py-2">
                                                    <Button asChild variant="ghost" size="sm" className="mr-2">
                                                        <Link href={route('storages.edit', storage.id)}>
                                                            <Pencil className="h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(storage.id)}
                                                        className="gap-1"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="mt-4 flex justify-center">
                            {storages.links.map((link, idx) =>
                                link.url ? (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        className={`mx-1 rounded px-2 py-1 ${link.active ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span key={idx} className="mx-1 px-2 py-1 text-gray-400" dangerouslySetInnerHTML={{ __html: link.label }} />
                                ),
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
