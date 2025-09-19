import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useForm } from '@inertiajs/react';
import { Calculator, Crown, DollarSign, HardDrive, Loader2, Save, Users, X } from 'lucide-react';
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

    const formatNumber = (value: string): string => {
        // Remove non-digits
        const numbers = value.replace(/\D/g, '');
        // Add thousand separators
        return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handlePriceChange = (field: keyof typeof data, value: string) => {
        // Only allow numbers
        const cleanValue = value.replace(/\D/g, '');
        setData(field, cleanValue);
    };

    return (
        <div className="w-full max-w-full overflow-x-hidden">
            <form onSubmit={handleSubmit}>
                <Card className="m-4 mx-auto w-full max-w-4xl border-0 shadow-none sm:m-6">
                    <CardHeader className="from-primary/5 to-primary/10 border-b bg-gradient-to-r px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/20 rounded-lg p-2">
                                    <HardDrive className="text-primary h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-semibold">Create Storage Plan</CardTitle>
                                    <p className="text-muted-foreground mt-1 text-sm">Configure storage size and pricing for different user types</p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4 p-4 sm:space-y-6 sm:p-6">
                        {/* Storage Size Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <HardDrive className="text-primary h-4 w-4" />
                                <h3 className="font-semibold">Storage Configuration</h3>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="size" className="flex items-center gap-2 text-sm font-medium">
                                    Storage Size (GB)
                                    <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="size"
                                        type="number"
                                        min={1}
                                        value={data.size}
                                        onChange={(e) => setData('size', e.target.value)}
                                        onFocus={() => setFocusedField('size')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="e.g., 100"
                                        className={`text-lg font-medium ${
                                            errors.size
                                                ? 'border-destructive focus-visible:ring-destructive'
                                                : focusedField === 'size'
                                                  ? 'border-primary ring-primary/20 ring-2'
                                                  : ''
                                        }`}
                                        required
                                    />
                                    <div className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm">GB</div>
                                </div>
                                {errors.size && (
                                    <p className="text-destructive flex items-center gap-2 text-sm">
                                        <X className="h-3 w-3" />
                                        {errors.size}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Admin Pricing Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="rounded bg-blue-100 p-1">
                                    <Crown className="h-4 w-4 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-blue-700">Admin Pricing</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                                {/* Admin Annual */}
                                <div className="space-y-2">
                                    <Label htmlFor="admin_annual" className="flex items-center gap-2 text-sm font-medium">
                                        <DollarSign className="h-3 w-3" />
                                        Annual Subscription (Rp)
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="admin_annual"
                                            type="text"
                                            value={formatNumber(data.price_admin_annual)}
                                            onChange={(e) => handlePriceChange('price_admin_annual', e.target.value)}
                                            onFocus={() => setFocusedField('admin_annual')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="0"
                                            className={`text-right font-mono ${
                                                errors.price_admin_annual
                                                    ? 'border-destructive focus-visible:ring-destructive'
                                                    : focusedField === 'admin_annual'
                                                      ? 'border-primary ring-primary/20 ring-2'
                                                      : ''
                                            }`}
                                            required
                                        />
                                        <div className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm">Rp</div>
                                    </div>
                                    {errors.price_admin_annual && <p className="text-destructive text-sm">{errors.price_admin_annual}</p>}
                                    {data.price_admin_annual && (
                                        <p className="flex items-center gap-1 text-xs text-blue-600">
                                            <Calculator className="h-3 w-3" />
                                            ~Rp {Math.round(parseInt(data.price_admin_annual) / 12).toLocaleString('id-ID')} per month
                                        </p>
                                    )}
                                </div>

                                {/* Admin Monthly */}
                                <div className="space-y-2">
                                    <Label htmlFor="admin_monthly" className="flex items-center gap-2 text-sm font-medium">
                                        <DollarSign className="h-3 w-3" />
                                        Monthly Subscription (Rp)
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="admin_monthly"
                                            type="text"
                                            value={formatNumber(data.price_admin_monthly)}
                                            onChange={(e) => handlePriceChange('price_admin_monthly', e.target.value)}
                                            onFocus={() => setFocusedField('admin_monthly')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="0"
                                            className={`text-right font-mono ${
                                                errors.price_admin_monthly
                                                    ? 'border-destructive focus-visible:ring-destructive'
                                                    : focusedField === 'admin_monthly'
                                                      ? 'border-primary ring-primary/20 ring-2'
                                                      : ''
                                            }`}
                                            required
                                        />
                                        <div className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm">Rp</div>
                                    </div>
                                    {errors.price_admin_monthly && <p className="text-destructive text-sm">{errors.price_admin_monthly}</p>}
                                    {data.price_admin_monthly && (
                                        <p className="flex items-center gap-1 text-xs text-blue-600">
                                            <Calculator className="h-3 w-3" />
                                            Rp {(parseInt(data.price_admin_monthly) * 12).toLocaleString('id-ID')} annual equivalent
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Member Pricing Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="rounded bg-green-100 p-1">
                                    <Users className="h-4 w-4 text-green-600" />
                                </div>
                                <h3 className="font-semibold text-green-700">Member Pricing</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                                {/* Member Annual */}
                                <div className="space-y-2">
                                    <Label htmlFor="member_annual" className="flex items-center gap-2 text-sm font-medium">
                                        <DollarSign className="h-3 w-3" />
                                        Annual Subscription (Rp)
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="member_annual"
                                            type="text"
                                            value={formatNumber(data.price_member_annual)}
                                            onChange={(e) => handlePriceChange('price_member_annual', e.target.value)}
                                            onFocus={() => setFocusedField('member_annual')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="0"
                                            className={`text-right font-mono ${
                                                errors.price_member_annual
                                                    ? 'border-destructive focus-visible:ring-destructive'
                                                    : focusedField === 'member_annual'
                                                      ? 'border-primary ring-primary/20 ring-2'
                                                      : ''
                                            }`}
                                            required
                                        />
                                        <div className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm">Rp</div>
                                    </div>
                                    {errors.price_member_annual && <p className="text-destructive text-sm">{errors.price_member_annual}</p>}
                                    {data.price_member_annual && (
                                        <p className="flex items-center gap-1 text-xs text-green-600">
                                            <Calculator className="h-3 w-3" />
                                            ~Rp {Math.round(parseInt(data.price_member_annual) / 12).toLocaleString('id-ID')}
                                            per month
                                        </p>
                                    )}
                                </div>

                                {/* Member Monthly */}
                                <div className="space-y-2">
                                    <Label htmlFor="member_monthly" className="flex items-center gap-2 text-sm font-medium">
                                        <DollarSign className="h-3 w-3" />
                                        Monthly Subscription (Rp)
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="member_monthly"
                                            type="text"
                                            value={formatNumber(data.price_member_monthly)}
                                            onChange={(e) => handlePriceChange('price_member_monthly', e.target.value)}
                                            onFocus={() => setFocusedField('member_monthly')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="0"
                                            className={`text-right font-mono ${
                                                errors.price_member_monthly
                                                    ? 'border-destructive focus-visible:ring-destructive'
                                                    : focusedField === 'member_monthly'
                                                      ? 'border-primary ring-primary/20 ring-2'
                                                      : ''
                                            }`}
                                            required
                                        />
                                        <div className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm">Rp</div>
                                    </div>
                                    {errors.price_member_monthly && <p className="text-destructive text-sm">{errors.price_member_monthly}</p>}
                                    {data.price_member_monthly && (
                                        <p className="flex items-center gap-1 text-xs text-green-600">
                                            <Calculator className="h-3 w-3" />
                                            Rp {(parseInt(data.price_member_monthly) * 12).toLocaleString('id-ID')} annual equivalent
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:gap-4">
                            <Button type="submit" disabled={processing} className="order-2 w-full sm:order-1 sm:w-auto">
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Plan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Create Storage Plan
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
