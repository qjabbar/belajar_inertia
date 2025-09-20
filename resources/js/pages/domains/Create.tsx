import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useForm } from '@inertiajs/react';
import { Globe, Loader2, Save, Shield, ShieldCheck, ShieldX, X } from 'lucide-react';
import { useId } from 'react';
import { toast } from 'sonner';

type Props = {
    onSuccess?: () => void;
    onClose?: () => void;
};

export default function Create({ onSuccess, onClose }: Props) {
    // Generate unique IDs for form fields
    const nameFieldId = useId();
    const privilegeFieldId = useId();

    const { data, setData, post, processing, errors, setError } = useForm({
        name: '',
        privilege: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        if (!data.name.trim()) {
            setError('name', 'Domain name is required');
            return;
        }

        if (!data.privilege.trim()) {
            setError('privilege', 'Privilege is required');
            return;
        }

        post(route('domains.store'), {
            onSuccess: () => {
                toast.success('Domain created successfully');
                onSuccess?.();
            },
            onError: (errors) => {
                toast.error('Failed to create domain');
                console.log('Create errors:', errors);
            },
        });
    };

    // FIX: Cancel button handler
    const handleCancel = () => {
        onClose?.();
    };

    // Updated privilege options dengan Bahasa Indonesia
    const privilegeOptions = [
        {
            value: 'semua',
            label: 'Semua',
            description: 'Akses penuh ke semua fitur',
            icon: ShieldCheck,
            color: 'text-green-600 dark:text-green-400',
        },
        {
            value: 'terbatas',
            label: 'Terbatas',
            description: 'Akses terbatas ke fitur tertentu',
            icon: Shield,
            color: 'text-yellow-600 dark:text-yellow-400',
        },
        {
            value: 'nonaktif',
            label: 'Nonaktif',
            description: 'Tidak ada akses',
            icon: ShieldX,
            color: 'text-red-600 dark:text-red-400',
        },
    ];

    const getPrivilegeInfo = (privilege: string) => {
        return privilegeOptions.find((option) => option.value === privilege);
    };

    const selectedPrivilege = getPrivilegeInfo(data.privilege);

    return (
        <DialogContent
            className="border-slate-200 bg-white sm:max-w-lg dark:border-slate-700 dark:bg-slate-800"
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
                    <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Add New Domain
                </DialogTitle>
                <DialogDescription className="text-slate-600 dark:text-slate-400">
                    Create a new domain with its privilege settings. Fill in all required information.
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Domain Information */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Domain Information</h3>
                    </div>
                    <Separator className="bg-slate-200 dark:bg-slate-700" />

                    {/* Domain Name */}
                    <div className="space-y-2">
                        <Label htmlFor={nameFieldId} className="text-slate-700 dark:text-slate-300">
                            Domain Name
                        </Label>
                        <Input
                            id={nameFieldId}
                            name="domain-name"
                            type="text"
                            placeholder="example.com"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={`border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 ${
                                errors.name ? 'border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400' : ''
                            }`}
                            autoComplete="url"
                            aria-describedby={errors.name ? `${nameFieldId}-error` : undefined}
                            aria-invalid={errors.name ? 'true' : 'false'}
                        />
                        {errors.name && (
                            <p id={`${nameFieldId}-error`} className="text-xs text-red-600 dark:text-red-400" role="alert">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Privilege */}
                    <div className="space-y-2">
                        <Label htmlFor={privilegeFieldId} className="text-slate-700 dark:text-slate-300">
                            Privilege Level
                        </Label>
                        <Select value={data.privilege} onValueChange={(value) => setData('privilege', value)} name="privilege-level">
                            <SelectTrigger
                                id={privilegeFieldId}
                                className={`border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 ${
                                    errors.privilege ? 'border-red-500 dark:border-red-400' : ''
                                }`}
                                aria-describedby={errors.privilege ? `${privilegeFieldId}-error` : undefined}
                                aria-invalid={errors.privilege ? 'true' : 'false'}
                            >
                                <SelectValue placeholder="Pilih tingkat privilege" className="text-slate-500 dark:text-slate-400" />
                            </SelectTrigger>
                            <SelectContent className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                                {privilegeOptions.map((privilege) => {
                                    const IconComponent = privilege.icon;
                                    return (
                                        <SelectItem
                                            key={privilege.value}
                                            value={privilege.value}
                                            className="text-slate-900 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
                                        >
                                            <div className="flex items-center gap-2">
                                                <IconComponent className={`h-4 w-4 ${privilege.color}`} />
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{privilege.label}</span>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">{privilege.description}</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                        {errors.privilege && (
                            <p id={`${privilegeFieldId}-error`} className="text-xs text-red-600 dark:text-red-400" role="alert">
                                {errors.privilege}
                            </p>
                        )}
                    </div>
                </div>

                {/* Domain Preview */}
                {(data.name || data.privilege) && (
                    <div
                        className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900"
                        role="region"
                        aria-label="Domain Preview"
                    >
                        <h4 className="mb-2 text-sm font-medium text-slate-900 dark:text-slate-100">Preview</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Domain:</span>
                                <span className="font-medium text-slate-900 dark:text-slate-100">{data.name || '-'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Privilege:</span>
                                {selectedPrivilege ? (
                                    <div className="flex items-center gap-2">
                                        <selectedPrivilege.icon className={`h-4 w-4 ${selectedPrivilege.color}`} aria-hidden="true" />
                                        <span className="font-medium text-slate-900 dark:text-slate-100">{selectedPrivilege.label}</span>
                                    </div>
                                ) : (
                                    <span className="font-medium text-slate-900 dark:text-slate-100">-</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Privilege Description */}
                {selectedPrivilege && (
                    <div
                        className={`rounded-lg border p-3 ${
                            selectedPrivilege.value === 'semua'
                                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                                : selectedPrivilege.value === 'terbatas'
                                  ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'
                                  : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                        }`}
                        role="region"
                        aria-label="Privilege Information"
                    >
                        <div className="flex items-center gap-2">
                            <selectedPrivilege.icon className={`h-4 w-4 ${selectedPrivilege.color}`} aria-hidden="true" />
                            <h5 className="text-sm font-medium text-slate-900 dark:text-slate-100">{selectedPrivilege.label}</h5>
                        </div>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{selectedPrivilege.description}</p>
                    </div>
                )}

                {/* Actions */}
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
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                        )}
                        {processing ? 'Creating...' : 'Create Domain'}
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
}
