'use client';

import { cn } from '@/lib/utils';

export default function StatusBadge({ status, className }) {
  const colors = {
    Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Draft: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    Paused: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Needs Review': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
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
    Approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'Out of Stock': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', colors[status] || colors.Draft, className)}>
      {status}
    </span>
  );
}
