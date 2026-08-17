'use client';

import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export default function EmptyState({ icon: Icon = Sparkles, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-16 text-center dark:border-gray-800 dark:bg-surface-dark-secondary/50">
      <div className="mb-4 rounded-2xl bg-brand-gradient-subtle p-4">
        <Icon className="h-8 w-8 text-brand-primary dark:text-indigo-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-slate-400">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
