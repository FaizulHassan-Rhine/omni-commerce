'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export default function ProgressStepper({ steps, currentStep, className }) {
  return (
    <>
      <div className={cn('hidden md:flex items-center justify-between', className)}>
        {steps.map((step, i) => (
          <div key={step.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all',
                i < currentStep ? 'bg-emerald-500 text-white' :
                i === currentStep ? 'bg-brand-gradient text-white shadow-glow' :
                'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
              )}>
                {i < currentStep ? <Check className="h-5 w-5" /> : i + 1}
              </div>
              <span className={cn('mt-2 text-xs font-medium text-center max-w-[100px]', i <= currentStep ? 'text-gray-900 dark:text-white' : 'text-gray-400')}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn('mx-2 h-0.5 flex-1', i < currentStep ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-800')} />
            )}
          </div>
        ))}
      </div>
      <div className={cn('md:hidden', className)}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-brand-primary dark:text-indigo-400">
            {steps[currentStep]?.label}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
          <div
            className="h-full rounded-full bg-brand-gradient transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </>
  );
}
