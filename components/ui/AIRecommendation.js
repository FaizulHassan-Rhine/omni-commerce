'use client';

import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export default function AIRecommendation({ title = 'AI Recommendation', children, className }) {
  return (
    <div className={cn('rounded-2xl border border-brand-primary/20 bg-brand-gradient-subtle p-5', className)}>
      <div className="mb-2 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-brand-primary dark:text-indigo-400" />
        <span className="text-sm font-semibold text-brand-primary dark:text-indigo-400">{title}</span>
      </div>
      <div className="text-sm text-gray-700 dark:text-slate-300">{children}</div>
    </div>
  );
}

export function AIInsightCard({ insight, category, className }) {
  return (
    <div className={cn('card-hover p-4', className)}>
      <span className="text-xs font-medium text-brand-primary dark:text-indigo-400">{category}</span>
      <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{insight}</p>
    </div>
  );
}

export function AIConfidenceBadge({ confidence = 92, className }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', className)}>
      <Sparkles className="h-3 w-3" />
      {confidence}% confidence
    </span>
  );
}

export function ContentScore({ score, className }) {
  const color = score >= 90 ? 'text-emerald-600' : score >= 70 ? 'text-amber-600' : 'text-red-600';
  const bg = score >= 90 ? 'bg-emerald-100 dark:bg-emerald-900/30' : score >= 70 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-red-100 dark:bg-red-900/30';

  return (
    <div className={cn('inline-flex items-center rounded-lg px-2 py-1', bg, className)}>
      <span className={cn('text-sm font-bold', color)}>{score}%</span>
    </div>
  );
}
