import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useForm } from '@inertiajs/react';
import { Crown, HardDrive, Loader2, Save, Users, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
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

export default function Create({ onSuccess, storageList }: Props) {
    const { data, setData, post, processing, errors, setError } = useForm({
        size: '',
        price_admin_annual: '',
        price_admin_monthly: '',
        price_member_annual: '',
        price_member_monthly: '',
    });

    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Unique storage size validation
        const sizeValue = data.size.toString();
        const isDuplicate = storageList.some((storage) => storage.size.toString() === sizeValue);

        if (isDuplicate) {
            setError('size', 'Storage size must be unique');
            toast.error('Storage size must be unique');
            return;
        }

        post(route('storages.store'), {
            onSuccess: () => {
                toast.success('Storage plan created successfully');
                if (onSuccess) onSuccess();
            },
            onError: (errors) => {
                toast.error('Please fix the validation errors');
                console.log('Validation errors:', errors);
            },
        });
    };

    const handlePriceChange = (field: keyof typeof data, value: string) => {
        // Only allow numbers
        const cleanValue = value.replace(/\D/g, '');
        setData(field, cleanValue);
    };

    return (
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="flex items-center text-xl font-semibold text-gray-900">
                    <HardDrive className="mr-3 text-blue-600" size={24} />
                    Add Storage Plan
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                    Configure storage size and pricing for different user types. All prices are in Indonesian Rupiah.
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Storage Size Section */}
                <Card>
                    <CardContent className="p-6">
                        <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
                            <HardDrive className="mr-2 text-blue-500" size={20} />
                            Storage Configuration
                        </h3>

                        <div className="space-y-2">
                            <Label htmlFor="size" className="text-sm font-medium text-gray-700">
                                Storage Size (GB)
                            </Label>
                            <div className="relative">
                                <Input
                                    id="size"
                                    type="number"
                                    value={data.size}
                                    onChange={(e) => setData('size', e.target.value)}
                                    onFocus={() => setFocusedField('size')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="e.g., 100"
                                    className={`pr-12 text-lg font-medium ${
                                        errors.size
                                            ? 'border-destructive focus-visible:ring-destructive'
                                            : focusedField === 'size'
                                              ? 'border-primary ring-primary/20 ring-2'
                                              : ''
                                    }`}
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span className="font-medium text-gray-500">GB</span>
                                </div>
                            </div>
                            {errors.size && <p className="text-destructive mt-1 text-sm">{errors.size}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Admin Pricing Section */}
                <Card>
                    <CardContent className="p-6">
                        <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
                            <Crown className="mr-2 text-green-500" size={20} />
                            Admin Pricing
                        </h3>
                        <p className="mb-4 text-sm text-gray-600">Premium tier for administrators</p>

                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Admin Annual */}
                            <div className="space-y-2">
                                <Label htmlFor="admin-annual" className="text-sm font-medium text-gray-700">
                                    Annual Subscription (Rp)
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="admin-annual"
                                        type="text"
                                        value={data.price_admin_annual}
                                        onChange={(e) => handlePriceChange('price_admin_annual', e.target.value)}
                                        onFocus={() => setFocusedField('admin_annual')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="0"
                                        className={`pr-12 text-right font-mono ${
                                            errors.price_admin_annual
                                                ? 'border-destructive focus-visible:ring-destructive'
                                                : focusedField === 'admin_annual'
                                                  ? 'border-primary ring-primary/20 ring-2'
                                                  : ''
                                        }`}
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="font-medium text-gray-500">Rp</span>
                                    </div>
                                </div>
                                {errors.price_admin_annual && <p className="text-destructive mt-1 text-sm">{errors.price_admin_annual}</p>}
                                {data.price_admin_annual && (
                                    <p className="text-xs text-gray-500">
                                        ~Rp {Math.round(parseInt(data.price_admin_annual) / 12).toLocaleString('id-ID')} per month
                                    </p>
                                )}
                            </div>

                            {/* Admin Monthly */}
                            <div className="space-y-2">
                                <Label htmlFor="admin-monthly" className="text-sm font-medium text-gray-700">
                                    Monthly Subscription (Rp)
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="admin-monthly"
                                        type="text"
                                        value={data.price_admin_monthly}
                                        onChange={(e) => handlePriceChange('price_admin_monthly', e.target.value)}
                                        onFocus={() => setFocusedField('admin_monthly')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="0"
                                        className={`pr-12 text-right font-mono ${
                                            errors.price_admin_monthly
                                                ? 'border-destructive focus-visible:ring-destructive'
                                                : focusedField === 'admin_monthly'
                                                  ? 'border-primary ring-primary/20 ring-2'
                                                  : ''
                                        }`}
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="font-medium text-gray-500">Rp</span>
                                    </div>
                                </div>
                                {errors.price_admin_monthly && <p className="text-destructive mt-1 text-sm">{errors.price_admin_monthly}</p>}
                                {data.price_admin_monthly && (
                                    <p className="text-xs text-gray-500">
                                        Rp {(parseInt(data.price_admin_monthly) * 12).toLocaleString('id-ID')} annual equivalent
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Member Pricing Section */}
                <Card>
                    <CardContent className="p-6">
                        <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
                            <Users className="mr-2 text-purple-500" size={20} />
                            Member Pricing
                        </h3>
                        <p className="mb-4 text-sm text-gray-600">Standard tier for regular members</p>

                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Member Annual */}
                            <div className="space-y-2">
                                <Label htmlFor="member-annual" className="text-sm font-medium text-gray-700">
                                    Annual Subscription (Rp)
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="member-annual"
                                        type="text"
                                        value={data.price_member_annual}
                                        onChange={(e) => handlePriceChange('price_member_annual', e.target.value)}
                                        onFocus={() => setFocusedField('member_annual')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="0"
                                        className={`pr-12 text-right font-mono ${
                                            errors.price_member_annual
                                                ? 'border-destructive focus-visible:ring-destructive'
                                                : focusedField === 'member_annual'
                                                  ? 'border-primary ring-primary/20 ring-2'
                                                  : ''
                                        }`}
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="font-medium text-gray-500">Rp</span>
                                    </div>
                                </div>
                                {errors.price_member_annual && <p className="text-destructive mt-1 text-sm">{errors.price_member_annual}</p>}
                                {data.price_member_annual && (
                                    <p className="text-xs text-gray-500">
                                        ~Rp {Math.round(parseInt(data.price_member_annual) / 12).toLocaleString('id-ID')} per month
                                    </p>
                                )}
                            </div>

                            {/* Member Monthly */}
                            <div className="space-y-2">
                                <Label htmlFor="member-monthly" className="text-sm font-medium text-gray-700">
                                    Monthly Subscription (Rp)
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="member-monthly"
                                        type="text"
                                        value={data.price_member_monthly}
                                        onChange={(e) => handlePriceChange('price_member_monthly', e.target.value)}
                                        onFocus={() => setFocusedField('member_monthly')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="0"
                                        className={`pr-12 text-right font-mono ${
                                            errors.price_member_monthly
                                                ? 'border-destructive focus-visible:ring-destructive'
                                                : focusedField === 'member_monthly'
                                                  ? 'border-primary ring-primary/20 ring-2'
                                                  : ''
                                        }`}
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="font-medium text-gray-500">Rp</span>
                                    </div>
                                </div>
                                {errors.price_member_monthly && <p className="text-destructive mt-1 text-sm">{errors.price_member_monthly}</p>}
                                {data.price_member_monthly && (
                                    <p className="text-xs text-gray-500">
                                        Rp {(parseInt(data.price_member_monthly) * 12).toLocaleString('id-ID')} annual equivalent
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <Separator />
                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" disabled={processing}>
                        <X className="mr-2" size={16} />
                        Cancel
                    </Button>

                    <Button type="submit" disabled={processing} className="min-w-[140px]">
                        {processing ? (
                            <>
                                <Loader2 className="mr-2 animate-spin" size={16} />
                                Creating Plan...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2" size={16} />
                                Create Storage Plan
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
}
