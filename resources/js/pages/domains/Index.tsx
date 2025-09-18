import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface MenuFormProps {
    menu?: {
        id: number;
        title: string;
        route: string;
        icon: string;
        parent_id: number | null;
        permission_name: string | null;
    };
    parentMenus: { id: number; title: string }[];
    permissions: string[];
}

export default function MenuForm({ menu, parentMenus, permissions }: MenuFormProps) {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Menu Management', href: '/menus' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={'Add Menu'} />
        </AppLayout>
    );
}
