import AppLogo from '@/components/app-logo';
import AppearanceDropdown from '@/components/appearance-dropdown';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { useState } from 'react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const [lang, setLang] = useState('id');

    return (
        <header className="border-sidebar-border/50 relative flex h-16 shrink-0 items-center justify-between border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            {/* Left: Sidebar + Breadcrumb */}
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <div className="hidden md:block">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>
            {/* Centered logo for mobile */}
            <div className="absolute top-1/2 left-1/2 block w-auto -translate-x-1/2 -translate-y-1/2 md:hidden">
                <AppLogo />
            </div>

            {/* Right: Language + Theme */}
            <div className="flex items-center gap-4">
                {/* <Select value={lang} onValueChange={setLang}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">🇮🇩 Bahasa</SelectItem>
            <SelectItem value="en">🇺🇸 English</SelectItem>
          </SelectContent>
        </Select> */}

                <AppearanceDropdown />
            </div>
        </header>
    );
}
