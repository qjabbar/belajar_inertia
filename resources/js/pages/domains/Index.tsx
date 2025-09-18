import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Globe, Pencil, Plus, Trash2 } from 'lucide-react';

interface Domain {
    id: number;
    name: string;
    privilege: string;
}

interface Props {
    domains: {
        data: Domain[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

export default function Index({ domains }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this domain?')) {
            router.delete(route('domains.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Domains" />
            <div className="flex-1 space-y-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <Globe className="text-primary h-6 w-6" />
                            Domain Management
                        </h1>
                        <p className="text-muted-foreground">Manage your domains and privileges</p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="gap-2">
                        <Link href={route('domains.create')}>
                            <Plus className="h-4 w-4" />
                            Add Domain
                        </Link>
                    </Button>
                </div>
                <Card className="border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Domain List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="min-w-full rounded border bg-white">
                                <thead>
                                    <tr>
                                        <th className="border px-4 py-2 text-left">Name</th>
                                        <th className="border px-4 py-2 text-left">Privilege</th>
                                        <th className="border px-4 py-2 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {domains.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-muted-foreground border px-4 py-6 text-center">
                                                No domains found.
                                            </td>
                                        </tr>
                                    ) : (
                                        domains.data.map((domain) => (
                                            <tr key={domain.id} className="hover:bg-muted/20">
                                                <td className="border px-4 py-2">{domain.name}</td>
                                                <td className="border px-4 py-2">{domain.privilege}</td>
                                                <td className="border px-4 py-2">
                                                    <Button asChild variant="ghost" size="sm" className="mr-2">
                                                        <Link href={route('domains.edit', domain.id)}>
                                                            <Pencil className="h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(domain.id)} className="gap-1">
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
                            {domains.links.map((link, idx) =>
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
