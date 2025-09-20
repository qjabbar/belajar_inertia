import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useForm } from '@inertiajs/react';
import { Crown, Edit as EditIcon, HardDrive, Loader2, Save, Users, X } from 'lucide-react';
import { useId, useState } from 'react';
import { toast } from 'sonner';

interface Storage {
    id: number;
    size: number;
    price_admin_annual: number;
    price_admin_monthly: number;
    price_member_annual: number;
    price_member_monthly: number;
}

type Props = {
    storage: Storage;
    onSuccess?: () => void;
    storageList: Array<{
        id: number;
        size: number;
        price_admin_annual: number;
        price_admin_monthly: number;
        price_member_annual: number;
        price_member_monthly: number;
    }>;
};

export default function Edit({ storage, onSuccess, storageList }: Props) {
    // Generate unique IDs for form fields
    const sizeFieldId = useId();
    const priceAdminAnnualId = useId();
    const priceAdminMonthlyId = useId();
    const priceMemberAnnualId = useId();
    const priceMemberMonthlyId = useId();

    const { data, setData, put, processing, errors, setError } = useForm({
        size: storage.size,
        price_admin_annual: storage.price_admin_annual,
        price_admin_monthly: storage.price_admin_monthly,
        price_member_annual: storage.price_member_annual,
        price_member_monthly: storage.price_member_monthly,
    });

    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Unique storage size validation (exclude current storage)
        const sizeValue = data.size.toString();
        const isDuplicate = storageList.some((s) => s.size.toString() === sizeValue && s.id !== storage.id);

        if (isDuplicate) {
            setError('size', 'Storage size must be unique');
            toast.error('Storage size must be unique');
            return;
        }

        put(route('storages.update', storage.id), {
            onSuccess: () => {
                toast.success(`Storage plan ${data.size}GB updated successfully`);
                if (onSuccess) onSuccess();
            },
            onError: (errors) => {
                toast.error('Please fix the validation errors');
                console.log('Validation errors:', errors);
            },
        });
    };

    // FIX: Cancel button handler
    const handleCancel = () => {
        if (onSuccess) {
            onSuccess();
        }
    };

    const handlePriceChange = (field: keyof typeof data, value: string) => {
        const cleanValue = value.replace(/\D/g, '');
        setData(field, cleanValue as any);
    };

    return (
        <DialogContent
            className="border-slate-200 bg-white sm:max-w-2xl dark:border-slate-700 dark:bg-slate-800"
            onOpenAutoFocus={(e) => {
                e.preventDefault();
                const target = e.currentTarget as HTMLElement | null;
                if (target) {
                    const firstInput = target.querySelector('input');
                    firstInput?.focus();
                }
            }}
        >
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    <EditIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Edit Storage Plan
                </DialogTitle>
                <DialogDescription className="text-slate-600 dark:text-slate-400">
                    Update storage configuration and pricing for {storage.size}GB plan. All prices are in Indonesian Rupiah.
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Storage Size Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Storage Configuration</h3>
                    </div>
                    <Separator className="bg-slate-200 dark:bg-slate-700" />

                    <div className="space-y-2">
                        <Label htmlFor={sizeFieldId} className="text-slate-700 dark:text-slate-300">
                            Storage Size (GB)
                        </Label>
                        <div className="relative">
                            <Input
                                id={sizeFieldId}
                                name="storage-size"
                                type="number"
                                min="1"
                                value={data.size}
                                onChange={(e) => setData('size', parseInt(e.target.value) || 0)}
                                onFocus={() => setFocusedField('size')}
                                onBlur={() => setFocusedField(null)}
                                placeholder="e.g., 100"
                                className={`no-spinner border-slate-300 bg-white pr-12 text-lg font-medium text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 ${
                                    errors.size
                                        ? 'border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400'
                                        : focusedField === 'size'
                                          ? 'border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-400 dark:ring-blue-400/20'
                                          : ''
                                }`}
                                autoComplete="off"
                                required
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">GB</span>
                            </div>
                        </div>
                        {errors.size && (
                            <p className="text-xs text-red-600 dark:text-red-400" role="alert">
                                {errors.size}
                            </p>
                        )}
                    </div>
                </div>

                {/* Admin Pricing Section */}
                <Card className="border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                    <CardContent className="space-y-4 p-4">
                        <div className="flex items-center gap-2">
                            <Crown className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Admin Pricing</h3>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Premium tier for administrators</p>

                        {/* Admin Annual */}
                        <div className="space-y-2">
                            <Label htmlFor={priceAdminAnnualId} className="text-slate-700 dark:text-slate-300">
                                Annual Subscription (Rp)
                            </Label>
                            <div className="relative">
                                <Input
                                    id={priceAdminAnnualId}
                                    name="price-admin-annual"
                                    type="text"
                                    value={data.price_admin_annual.toLocaleString('id-ID')}
                                    onChange={(e) => handlePriceChange('price_admin_annual', e.target.value)}
                                    onFocus={() => setFocusedField('admin_annual')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="0"
                                    className={`border-slate-300 bg-white pr-12 text-right font-mono text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 ${
                                        errors.price_admin_annual
                                            ? 'border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400'
                                            : focusedField === 'admin_annual'
                                              ? 'border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-400 dark:ring-blue-400/20'
                                              : ''
                                    }`}
                                    autoComplete="off"
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Rp</span>
                                </div>
                            </div>
                            {errors.price_admin_annual && (
                                <p className="text-xs text-red-600 dark:text-red-400" role="alert">
                                    {errors.price_admin_annual}
                                </p>
                            )}
                            {data.price_admin_annual && (
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    ~Rp {Math.round(data.price_admin_annual / 12).toLocaleString('id-ID')} per month
                                </p>
                            )}
                        </div>

                        {/* Admin Monthly */}
                        <div className="space-y-2">
                            <Label htmlFor={priceAdminMonthlyId} className="text-slate-700 dark:text-slate-300">
                                Monthly Subscription (Rp)
                            </Label>
                            <div className="relative">
                                <Input
                                    id={priceAdminMonthlyId}
                                    name="price-admin-monthly"
                                    type="text"
                                    value={data.price_admin_monthly.toLocaleString('id-ID')}
                                    onChange={(e) => handlePriceChange('price_admin_monthly', e.target.value)}
                                    onFocus={() => setFocusedField('admin_monthly')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="0"
                                    className={`border-slate-300 bg-white pr-12 text-right font-mono text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 ${
                                        errors.price_admin_monthly
                                            ? 'border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400'
                                            : focusedField === 'admin_monthly'
                                              ? 'border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-400 dark:ring-blue-400/20'
                                              : ''
                                    }`}
                                    autoComplete="off"
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Rp</span>
                                </div>
                            </div>
                            {errors.price_admin_monthly && (
                                <p className="text-xs text-red-600 dark:text-red-400" role="alert">
                                    {errors.price_admin_monthly}
                                </p>
                            )}
                            {data.price_admin_monthly && (
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Rp {(data.price_admin_monthly * 12).toLocaleString('id-ID')} annual equivalent
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Member Pricing Section */}
                <Card className="border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                    <CardContent className="space-y-4 p-4">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Member Pricing</h3>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Standard tier for regular members</p>

                        {/* Member Annual */}
                        <div className="space-y-2">
                            <Label htmlFor={priceMemberAnnualId} className="text-slate-700 dark:text-slate-300">
                                Annual Subscription (Rp)
                            </Label>
                            <div className="relative">
                                <Input
                                    id={priceMemberAnnualId}
                                    name="price-member-annual"
                                    type="text"
                                    value={data.price_member_annual.toLocaleString('id-ID')}
                                    onChange={(e) => handlePriceChange('price_member_annual', e.target.value)}
                                    onFocus={() => setFocusedField('member_annual')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="0"
                                    className={`border-slate-300 bg-white pr-12 text-right font-mono text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 ${
                                        errors.price_member_annual
                                            ? 'border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400'
                                            : focusedField === 'member_annual'
                                              ? 'border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-400 dark:ring-blue-400/20'
                                              : ''
                                    }`}
                                    autoComplete="off"
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Rp</span>
                                </div>
                            </div>
                            {errors.price_member_annual && (
                                <p className="text-xs text-red-600 dark:text-red-400" role="alert">
                                    {errors.price_member_annual}
                                </p>
                            )}
                            {data.price_member_annual && (
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    ~Rp {Math.round(data.price_member_annual / 12).toLocaleString('id-ID')} per month
                                </p>
                            )}
                        </div>

                        {/* Member Monthly */}
                        <div className="space-y-2">
                            <Label htmlFor={priceMemberMonthlyId} className="text-slate-700 dark:text-slate-300">
                                Monthly Subscription (Rp)
                            </Label>
                            <div className="relative">
                                <Input
                                    id={priceMemberMonthlyId}
                                    name="price-member-monthly"
                                    type="text"
                                    value={data.price_member_monthly.toLocaleString('id-ID')}
                                    onChange={(e) => handlePriceChange('price_member_monthly', e.target.value)}
                                    onFocus={() => setFocusedField('member_monthly')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="0"
                                    className={`border-slate-300 bg-white pr-12 text-right font-mono text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 ${
                                        errors.price_member_monthly
                                            ? 'border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400'
                                            : focusedField === 'member_monthly'
                                              ? 'border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-400 dark:ring-blue-400/20'
                                              : ''
                                    }`}
                                    autoComplete="off"
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Rp</span>
                                </div>
                            </div>
                            {errors.price_member_monthly && (
                                <p className="text-xs text-red-600 dark:text-red-400" role="alert">
                                    {errors.price_member_monthly}
                                </p>
                            )}
                            {data.price_member_monthly && (
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Rp {(data.price_member_monthly * 12).toLocaleString('id-ID')} annual equivalent
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel} // FIX: Proper cancel handler
                        disabled={processing}
                        className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                        <X className="mr-2 h-4 w-4" aria-hidden="true" />
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                                Updating Plan...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                                Update Storage Plan
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
}
