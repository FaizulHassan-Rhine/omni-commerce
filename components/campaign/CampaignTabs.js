'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export const campaignSectionTabs = [
  { id: 'campaigns', label: 'Campaigns', href: '/campaigns' },
  { id: 'create', label: 'Create Campaign', href: '/campaigns/create' },
];

export default function CampaignTabs() {
  const pathname = usePathname();

  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="-mb-px flex gap-1 overflow-x-auto scrollbar-thin">
        {campaignSectionTabs.map((tab) => {
          const active = tab.href === '/campaigns'
            ? pathname === '/campaigns'
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                'whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                active
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
