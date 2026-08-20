'use client';

import { cn } from '@/lib/utils';
import PlatformIcon from '@/components/ui/PlatformIcon';
import Select from '@/components/ui/Select';
import CampaignAdNativePreview from '@/components/ui/CampaignAdNativePreview';
import PostImageEditTools from '@/components/ui/PostImageEditTools';
import { getCampaignReviewFields } from '@/lib/campaign-review';

const statusStyles = {
  ready: 'bg-brand-muted text-brand-primary',
  draft: 'bg-amber-50 text-amber-700',
};

function FieldEditor({ field, value, onChange }) {
  if (field.type === 'select') {
    return (
      <div>
        <label className="label">{field.label}</label>
        <Select
          value={field.options.includes(value) ? value : field.options[0]}
          onChange={onChange}
          options={field.options}
          aria-label={field.label}
        />
        {field.hint && <p className="mt-1 text-[11px] text-text-muted">{field.hint}</p>}
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div>
        <label className="label">{field.label}</label>
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={field.rows || 4}
          className="input resize-none"
        />
        {field.hint && <p className="mt-1 text-[11px] text-text-muted">{field.hint}</p>}
      </div>
    );
  }

  return (
    <div>
      <label className="label">{field.label}</label>
      <input value={value || ''} onChange={(e) => onChange(e.target.value)} className="input" />
      {field.hint && <p className="mt-1 text-[11px] text-text-muted">{field.hint}</p>}
    </div>
  );
}

export default function CampaignAdReview({ ads, activeId, onSelect, onChange, showImageTools = true, sidePanel = null }) {
  const active = ads.find((ad) => ad.id === activeId) || ads[0];
  if (!active) return null;

  const fields = getCampaignReviewFields(active.id);
  const update = (key, value) => onChange?.(active.id, { [key]: value });
  const hasSideColumn = showImageTools || sidePanel;

  const resetImageEdits = () => {
    onChange?.(active.id, {
      imageScale: 100,
      imageOffsetX: 0,
      imageOffsetY: 0,
      imageBrightness: 100,
      imageContrast: 100,
      overlayTitle: '',
      overlayPosition: 'bottom-left',
      overlaySize: 'medium',
      overlayColor: '#FFFFFF',
    });
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-1 overflow-x-auto scrollbar-thin" aria-label="Ad platforms">
          {ads.map((ad) => {
            const selected = active.id === ad.id;
            return (
              <button
                key={ad.id}
                type="button"
                onClick={() => onSelect(ad.id)}
                className={cn(
                  'flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                  selected
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                )}
              >
                <PlatformIcon platformId={ad.id} size="sm" className="shadow-none" />
                <span>{ad.name}</span>
                <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-semibold capitalize', statusStyles[ad.status])}>
                  {ad.status}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className={cn('grid min-w-0 items-start gap-4', hasSideColumn && 'xl:grid-cols-[1fr_minmax(0,300px)]')}>
        <div className="card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <PlatformIcon platformId={active.id} />
              <div>
                <h3 className="font-semibold text-text-primary">{active.name} ad preview</h3>
                <p className="text-sm text-text-secondary">
                  Native {active.name} layout · {active.mediaType === 'video' ? 'Video' : 'Image'} · {active.aspectLabel}
                </p>
              </div>
            </div>
            <span className={cn('rounded-md px-3 py-1 text-xs font-semibold capitalize', statusStyles[active.status])}>
              {active.status}
            </span>
          </div>

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(240px,340px)_1fr]">
            <div className="h-fit w-full max-w-[340px] justify-self-start xl:sticky xl:top-24">
              <CampaignAdNativePreview post={active} />
              {(active.audienceSummary || active.dailyBudget) && (
                <div className="mt-3 space-y-1 rounded-lg bg-gray-50 p-3 text-xs text-text-secondary">
                  {active.audienceSummary && <p><span className="font-medium text-text-primary">Audience:</span> {active.audienceSummary}</p>}
                  {active.dailyBudget && <p><span className="font-medium text-text-primary">Budget:</span> {active.dailyBudget}</p>}
                </div>
              )}
            </div>
            <div className="space-y-4">
              {fields.map((field) => (
                <FieldEditor
                  key={field.key}
                  field={field}
                  value={active[field.key]}
                  onChange={(value) => update(field.key, value)}
                />
              ))}
            </div>
          </div>
        </div>

        {showImageTools && (
          <PostImageEditTools
            post={active}
            onChange={(patch) => onChange?.(active.id, patch)}
            onReset={resetImageEdits}
          />
        )}
        {!showImageTools && sidePanel}
      </div>
    </div>
  );
}
