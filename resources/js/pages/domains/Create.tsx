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
};

export default function Create({ onSuccess }: Props) {
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

    // Updated privilege options dengan Bahasa Indonesia
    const privilegeOptions = [
        {
            value: 'semua',
            label: 'Semua',
            description: 'Akses penuh ke semua fitur',
            icon: ShieldCheck,
            color: 'text-green-600',
        },
        {
            value: 'terbatas',
            label: 'Terbatas',
            description: 'Akses terbatas ke fitur tertentu',
            icon: Shield,
            color: 'text-yellow-600',
        },
        {
            value: 'nonaktif',
            label: 'Nonaktif',
            description: 'Tidak ada akses',
            icon: ShieldX,
            color: 'text-red-600',
        },
    ];

    const getPrivilegeInfo = (privilege: string) => {
        return privilegeOptions.find((option) => option.value === privilege);
    };

    const selectedPrivilege = getPrivilegeInfo(data.privilege);

    return (
        <DialogContent
            className="sm:max-w-lg"
            // Fix: Remove aria-hidden conflict by ensuring proper focus management
            onOpenAutoFocus={(e) => {
                // Allow natural focus flow
                e.preventDefault();
                const target = e.currentTarget as HTMLElement | null;
                if (target) {
                    const firstInput = target.querySelector('input');
                    firstInput?.focus();
                }
            }}
        >
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    Add New Domain
                </DialogTitle>
                <DialogDescription>Create a new domain with its privilege settings. Fill in all required information.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Domain Information */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <h3 className="text-sm font-medium text-gray-900">Domain Information</h3>
                    </div>
                    <Separator />

                    {/* Domain Name - Fixed accessibility */}
                    <div className="space-y-2">
                        <Label htmlFor={nameFieldId}>Domain Name</Label>
                        <Input
                            id={nameFieldId}
                            name="domain-name" // Fix: Add name attribute
                            type="text"
                            placeholder="example.com"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
                            autoComplete="url" // Fix: Add autocomplete attribute
                            aria-describedby={errors.name ? `${nameFieldId}-error` : undefined}
                            aria-invalid={errors.name ? 'true' : 'false'}
                        />
                        {errors.name && (
                            <p id={`${nameFieldId}-error`} className="text-xs text-red-600" role="alert">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Privilege - Fixed accessibility */}
                    <div className="space-y-2">
                        <Label htmlFor={privilegeFieldId}>Privilege Level</Label>
                        <Select
                            value={data.privilege}
                            onValueChange={(value) => setData('privilege', value)}
                            name="privilege-level" // Fix: Add name attribute
                        >
                            <SelectTrigger
                                id={privilegeFieldId}
                                className={errors.privilege ? 'border-red-500' : ''}
                                aria-describedby={errors.privilege ? `${privilegeFieldId}-error` : undefined}
                                aria-invalid={errors.privilege ? 'true' : 'false'}
                            >
                                <SelectValue placeholder="Pilih tingkat privilege" />
                            </SelectTrigger>
                            <SelectContent>
                                {privilegeOptions.map((privilege) => {
                                    const IconComponent = privilege.icon;
                                    return (
                                        <SelectItem key={privilege.value} value={privilege.value}>
                                            <div className="flex items-center gap-2">
                                                <IconComponent className={`h-4 w-4 ${privilege.color}`} />
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{privilege.label}</span>
                                                    <span className="text-xs text-gray-500">{privilege.description}</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                        {errors.privilege && (
                            <p id={`${privilegeFieldId}-error`} className="text-xs text-red-600" role="alert">
                                {errors.privilege}
                            </p>
                        )}
                    </div>
                </div>

                {/* Domain Preview */}
                {(data.name || data.privilege) && (
                    <div className="rounded-lg border bg-gray-50 p-4" role="region" aria-label="Domain Preview">
                        <h4 className="mb-2 text-sm font-medium text-gray-900">Preview</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Domain:</span>
                                <span className="font-medium">{data.name || '-'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Privilege:</span>
                                {selectedPrivilege ? (
                                    <div className="flex items-center gap-2">
                                        <selectedPrivilege.icon className={`h-4 w-4 ${selectedPrivilege.color}`} aria-hidden="true" />
                                        <span className="font-medium">{selectedPrivilege.label}</span>
                                    </div>
                                ) : (
                                    <span className="font-medium">-</span>
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
                                ? 'border-green-200 bg-green-50'
                                : selectedPrivilege.value === 'terbatas'
                                  ? 'border-yellow-200 bg-yellow-50'
                                  : 'border-red-200 bg-red-50'
                        }`}
                        role="region"
                        aria-label="Privilege Information"
                    >
                        <div className="flex items-center gap-2">
                            <selectedPrivilege.icon className={`h-4 w-4 ${selectedPrivilege.color}`} aria-hidden="true" />
                            <h5 className="text-sm font-medium">{selectedPrivilege.label}</h5>
                        </div>
                        <p className="mt-1 text-xs text-gray-600">{selectedPrivilege.description}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onSuccess} disabled={processing}>
                        <X className="mr-2 h-4 w-4" aria-hidden="true" />
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
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
