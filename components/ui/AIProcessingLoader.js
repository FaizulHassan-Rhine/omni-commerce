'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function AIProcessingLoader({ stages, activeStage, className }) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const progress = stages.length > 0 ? ((activeStage + 1) / stages.length) * 100 : 0;

  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
        <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-brand-primary/10 blur-xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-xl bg-brand-gradient shadow-soft">
          <Sparkles className="h-10 w-10 text-white animate-pulse" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        AI Processing{dots}
      </h3>
      <p className="mt-2 text-sm text-brand-primary animate-pulse-soft">
        {stages[activeStage] || 'Initializing...'}
      </p>
      <div className="mt-6 w-full max-w-xs">
        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
          <div
            className="h-full rounded-full bg-brand-gradient transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 space-y-1.5">
          {stages.map((stage, i) => (
            <div key={stage} className={cn('flex items-center gap-2 text-xs transition-opacity', i <= activeStage ? 'opacity-100' : 'opacity-30')}>
              <div className={cn('h-1.5 w-1.5 rounded-full', i < activeStage ? 'bg-emerald-500' : i === activeStage ? 'bg-brand-primary animate-pulse' : 'bg-gray-300 dark:bg-gray-600')} />
              <span className="text-gray-600 dark:text-slate-400">{stage}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
