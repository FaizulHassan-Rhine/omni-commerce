'use client';

import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20',
  error: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20',
  warning: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20',
  info: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || Info;
        return (
          <div
            key={toast.id}
            className={cn('flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg animate-slide-up min-w-[280px]', colors[toast.type])}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <p className="flex-1 text-sm font-medium text-gray-900 dark:text-white">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="cursor-pointer text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
