import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { HardDrive } from 'lucide-react';

interface Storage {
    id: number;
    size: number;
    price_admin_annual: number;
    price_admin_monthly: number;
    price_member_annual: number;
    price_member_monthly: number;
}

interface Props {
    storage: Storage;
}

export default function Edit({ storage }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        size: storage.size || '',
        price_admin_annual: storage.price_admin_annual || '',
        price_admin_monthly: storage.price_admin_monthly || '',
        price_member_annual: storage.price_member_annual || '',
        price_member_monthly: storage.price_member_monthly || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('storages.update', storage.id));
    };

    return (
        <AppLayout>
            <Head title="Edit Storage" />
            <div className="flex-1 space-y-6 p-4 md:p-6">
                <div className="mb-4 flex items-center gap-2">
                    <HardDrive className="text-primary h-6 w-6" />
                    <h1 className="text-2xl font-bold tracking-tight">Edit Storage</h1>
                </div>
                <Card className="mx-auto max-w-md border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Storage Form</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block font-medium">Size (GB)</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={data.size}
                                    onChange={(e) => setData('size', e.target.value)}
                                    className="w-full rounded border px-3 py-2"
                                    required
                                />
                                {errors.size && <div className="mt-1 text-sm text-red-500">{errors.size}</div>}
                            </div>
                            <div>
                                <label className="mb-1 block font-medium">Admin Annual Price (Rp)</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={data.price_admin_annual}
                                    onChange={(e) => setData('price_admin_annual', e.target.value)}
                                    className="w-full rounded border px-3 py-2"
                                    required
                                />
                                {errors.price_admin_annual && <div className="mt-1 text-sm text-red-500">{errors.price_admin_annual}</div>}
                            </div>
                            <div>
                                <label className="mb-1 block font-medium">Admin Monthly Price (Rp)</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={data.price_admin_monthly}
                                    onChange={(e) => setData('price_admin_monthly', e.target.value)}
                                    className="w-full rounded border px-3 py-2"
                                    required
                                />
                                {errors.price_admin_monthly && <div className="mt-1 text-sm text-red-500">{errors.price_admin_monthly}</div>}
                            </div>
                            <div>
                                <label className="mb-1 block font-medium">Member Annual Price (Rp)</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={data.price_member_annual}
                                    onChange={(e) => setData('price_member_annual', e.target.value)}
                                    className="w-full rounded border px-3 py-2"
                                    required
                                />
                                {errors.price_member_annual && <div className="mt-1 text-sm text-red-500">{errors.price_member_annual}</div>}
                            </div>
                            <div>
                                <label className="mb-1 block font-medium">Member Monthly Price (Rp)</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={data.price_member_monthly}
                                    onChange={(e) => setData('price_member_monthly', e.target.value)}
                                    className="w-full rounded border px-3 py-2"
                                    required
                                />
                                {errors.price_member_monthly && <div className="mt-1 text-sm text-red-500">{errors.price_member_monthly}</div>}
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" className="btn btn-primary" disabled={processing}>
                                    Update
                                </Button>
                                <Button asChild variant="secondary">
                                    <Link href={route('storages.index')}>Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
