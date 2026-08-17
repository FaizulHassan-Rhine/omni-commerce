'use client';

import { getPlatform } from '@/data/platforms';
import { cn } from '@/lib/utils';
import { PlatformBrandSvg, getPlatformBrandColor, isMultiColorPlatform } from '@/components/ui/PlatformBrandIcons';

export default function PlatformIcon({ platformId, size = 'md', className }) {
  const platform = getPlatform(platformId);
  const brandColor = getPlatformBrandColor(platformId);
  const multiColor = isMultiColorPlatform(platformId);

  const sizes = { sm: 'h-6 w-6', md: 'h-8 w-8', lg: 'h-10 w-10' };
  const iconSizes = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' };

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg shrink-0 bg-white border border-gray-100 shadow-sm',
        sizes[size],
        className
      )}
      title={platform.name}
    >
      <PlatformBrandSvg
        platformId={platformId}
        className={iconSizes[size]}
        style={multiColor ? undefined : { color: brandColor }}
      />
    </div>
  );
}

export function PlatformCard({ platformId, selected, onClick, connected, allocation, className }) {
  const platform = getPlatform(platformId);

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-xl border p-4 text-left transition-all cursor-pointer',
        selected
          ? 'border-brand-primary bg-brand-gradient-subtle shadow-sm'
          : 'border-gray-200 hover:border-brand-primary/30 dark:border-gray-800',
        className
      )}
    >
      <PlatformIcon platformId={platformId} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white truncate">{platform.name}</p>
        {connected !== undefined && (
          <p className="text-xs text-gray-500 dark:text-slate-400">
            {connected ? 'Connected' : 'Not connected'}
          </p>
        )}
        {allocation !== undefined && (
          <p className="text-xs font-semibold text-brand-primary dark:text-indigo-400">{allocation}%</p>
        )}
      </div>
    </button>
  );
}
