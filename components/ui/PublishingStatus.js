'use client';

import { getPlatformCreativeSpec } from '@/data/platforms';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import PlatformIcon from '@/components/ui/PlatformIcon';

const statusConfig = {
  published: { icon: CheckCircle, color: 'text-emerald-500', label: 'Published' },
  success: { icon: CheckCircle, color: 'text-emerald-500', label: 'Published' },
  review: { icon: AlertCircle, color: 'text-amber-500', label: 'Needs Review' },
  pending: { icon: Clock, color: 'text-gray-400', label: 'Pending' },
  loading: { icon: Loader2, color: 'text-brand-primary animate-spin', label: 'Publishing...' },
  error: { icon: AlertCircle, color: 'text-red-500', label: 'Failed' },
};

export default function PublishingStatus({ items, className }) {
  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item) => {
        const config = statusConfig[item.status] || statusConfig.pending;
        const Icon = config.icon;
        return (
          <div key={item.platform} className="flex items-center justify-between rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <Icon className={cn('h-5 w-5', config.color)} />
              <span className="font-medium text-gray-900 dark:text-white">{item.platform}</span>
            </div>
            <span className={cn('text-sm font-medium', config.color)}>{item.message || config.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function ChannelSelector({ channels, selected, onChange, className }) {
  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4', className)}>
      {channels.map((ch) => (
        <button
          key={ch.id}
          onClick={() => toggle(ch.id)}
          className={cn(
            'flex items-center gap-2.5 rounded-xl border p-3 text-left text-sm font-medium transition-all cursor-pointer',
            selected.includes(ch.id)
              ? 'border-brand-primary bg-brand-gradient-subtle text-brand-primary dark:text-indigo-400'
              : 'border-gray-200 text-gray-700 hover:border-brand-primary/30 dark:border-gray-800 dark:text-slate-300'
          )}
        >
          <PlatformIcon platformId={ch.id} size="sm" className="shadow-none" />
          <span className="min-w-0">
            <span className="block truncate">{ch.name}</span>
            <span className="block text-[11px] font-normal text-text-muted">{getPlatformCreativeSpec(ch.id).aspectLabel}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

export function BudgetAllocator({ allocations, onChange, className }) {
  const total = Object.values(allocations).reduce((a, b) => a + b, 0);

  const handleChange = (platform, value) => {
    const num = Math.max(0, Math.min(100, parseInt(value) || 0));
    onChange({ ...allocations, [platform]: num });
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Budget Allocation</span>
        <span className={cn('text-sm font-bold', total > 100 ? 'text-red-500' : total === 100 ? 'text-emerald-500' : 'text-gray-500')}>
          {total}% allocated
        </span>
      </div>
      {Object.entries(allocations).map(([platform, value]) => (
        <div key={platform} className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-slate-300">{platform}</span>
            <span className="font-semibold text-brand-primary dark:text-indigo-400">{value}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => handleChange(platform, e.target.value)}
            className="w-full accent-brand-primary cursor-pointer"
          />
        </div>
      ))}
    </div>
  );
}
