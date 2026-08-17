'use client';

import { cn } from '@/lib/utils';

export default function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={cn('border-b border-gray-200 dark:border-gray-800', className)}>
      <nav className="-mb-px flex gap-1 overflow-x-auto scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors cursor-pointer',
              activeTab === tab.id
                ? 'border-brand-primary text-brand-primary dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200'
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">{tab.count}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

export function TabPanel({ children, className }) {
  return <div className={cn('py-6 animate-fade-in', className)}>{children}</div>;
}
