'use client';

import { cn, formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({ title, value, change, suffix, prefix, icon: Icon, className }) {
  const formattedValue = typeof value === 'number'
    ? (prefix === '$' || title?.includes('Revenue') || title?.includes('Spend'))
      ? formatCurrency(value)
      : suffix === 'x'
        ? `${value}${suffix}`
        : formatNumber(value)
    : value;

  return (
    <div className={cn('card animate-fade-in', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{formattedValue}</p>
          {change !== null && change !== undefined && (
            <div className={cn('mt-1 flex items-center gap-1 text-sm font-medium', change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
              {change >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {formatPercent(change)}
            </div>
          )}
        </div>
        {Icon && (
          <div className="rounded-xl bg-brand-gradient-subtle p-2.5">
            <Icon className="h-5 w-5 text-brand-primary dark:text-indigo-400" />
          </div>
        )}
      </div>
    </div>
  );
}
