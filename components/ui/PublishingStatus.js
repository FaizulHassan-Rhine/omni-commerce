'use client';

import { getPlatformCreativeSpec } from '@/data/platforms';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, AlertCircle, Loader2, Check, X, Globe } from 'lucide-react';
import PlatformIcon from '@/components/ui/PlatformIcon';

const statusConfig = {
  published: { icon: CheckCircle, color: 'text-emerald-600', label: 'Published' },
  success: { icon: CheckCircle, color: 'text-emerald-600', label: 'Published' },
  approved: { icon: CheckCircle, color: 'text-emerald-600', label: 'Approved' },
  review: { icon: AlertCircle, color: 'text-amber-500', label: 'Needs Review' },
  pending: { icon: Clock, color: 'text-amber-600', label: 'Awaiting approval' },
  loading: { icon: Loader2, color: 'text-brand-primary animate-spin', label: 'Publishing...' },
  rejected: { icon: X, color: 'text-red-600', label: 'Rejected' },
  error: { icon: AlertCircle, color: 'text-red-500', label: 'Failed' },
};

export default function PublishingStatus({ items, className, onApprove, onReject, onPublish }) {
  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item) => {
        const config = statusConfig[item.status] || statusConfig.pending;
        const Icon = config.icon;
        const awaiting = item.status === 'pending';
        const approved = item.status === 'approved';
        return (
          <div key={item.platform} className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <div className="flex min-w-0 items-center gap-3">
              <Icon className={cn('h-5 w-5 shrink-0', config.color)} />
              <span className="font-medium text-gray-900 dark:text-white">{item.platform}</span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className={cn('text-sm font-medium', config.color)}>{item.message || config.label}</span>
              {awaiting && onApprove && onReject ? (
                <>
                  <button
                    type="button"
                    onClick={() => onApprove(item)}
                    className="btn-gradient px-3 py-1.5 text-xs"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => onReject(item)}
                    className="btn border border-red-200 bg-white px-3 py-1.5 text-xs text-red-700 hover:bg-red-50"
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                </>
              ) : null}
              {approved && onPublish ? (
                <button
                  type="button"
                  onClick={() => onPublish(item)}
                  className="btn-publish px-3 py-1.5 text-xs"
                >
                  <Globe className="h-3.5 w-3.5" /> Publish
                </button>
              ) : null}
            </div>
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
