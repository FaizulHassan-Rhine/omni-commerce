'use client';

import { cn } from '@/lib/utils';

const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'workspace', label: 'Workspace' },
  { id: 'billing', label: 'Billing' },
  { id: 'team', label: 'Team' },
];

export default function SettingsTabs({ activeTab, onChange }) {
  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="-mb-px flex gap-1 overflow-x-auto scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
