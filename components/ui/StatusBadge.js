'use client';

import { cn } from '@/lib/utils';

export default function StatusBadge({ status, className }) {
  const colors = {
    Active: 'bg-emerald-700 text-white',
    Draft: 'bg-slate-600 text-white',
    Paused: 'bg-amber-700 text-white',
    Completed: 'bg-blue-700 text-white',
    'Needs Review': 'bg-orange-700 text-white',
    Published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Ready: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Connected: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Disconnected: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    Winner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Average: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Fatiguing: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'Poor Performer': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'Awaiting Review': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'Changes Requested': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    Approved: 'bg-emerald-700 text-white',
    Pending: 'bg-amber-700 text-white',
    Rejected: 'bg-red-700 text-white',
    'Out of Stock': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold', colors[status] || colors.Draft, className)}>
      {status}
    </span>
  );
}
