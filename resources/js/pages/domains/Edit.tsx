import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Globe } from 'lucide-react';

interface Domain {
    id: number;
    name: string;
    privilege: string;
}

interface Props {
    domain: Domain;
}

export default function Edit({ domain }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: domain.name || '',
        privilege: domain.privilege || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('domains.update', domain.id));
    };

    return (
        <AppLayout>
            <Head title="Edit Domain" />
            <div className="flex-1 space-y-6 p-4 md:p-6">
                <div className="mb-4 flex items-center gap-2">
                    <Globe className="text-primary h-6 w-6" />
                    <h1 className="text-2xl font-bold tracking-tight">Edit Domain</h1>
                </div>
                <Card className="mx-auto max-w-md border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Domain Form</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block font-medium">Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded border px-3 py-2"
                                    required
                                />
                                {errors.name && <div className="mt-1 text-sm text-red-500">{errors.name}</div>}
                            </div>
                            <div>
                                <label className="mb-1 block font-medium">Privilege</label>
                                <select
                                    value={data.privilege}
                                    onChange={(e) => setData('privilege', e.target.value)}
                                    className="w-full rounded border px-3 py-2"
                                    required
                                >
                                    <option value="">Pilih Privilege</option>
                                    <option value="Semua">Semua</option>
                                    <option value="Terbatas">Terbatas</option>
                                    <option value="Nonaktif">Nonaktif</option>
                                </select>
                                {errors.privilege && <div className="mt-1 text-sm text-red-500">{errors.privilege}</div>}
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" className="btn btn-primary" disabled={processing}>
                                    Update
                                </Button>
                                <Button asChild variant="secondary">
                                    <Link href={route('domains.index')}>Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
