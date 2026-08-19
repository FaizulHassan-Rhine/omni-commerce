'use client';

import { cn } from '@/lib/utils';

const tabs = [
  { id: 'social', label: 'Social Media' },
  { id: 'advertising', label: 'Advertising' },
  { id: 'commerce', label: 'Commerce' },
];

export default function IntegrationTabs({ activeTab, onChange, counts }) {
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
            {counts?.[tab.id] !== undefined && (
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-text-muted">
                {counts[tab.id].connected}/{counts[tab.id].total}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
