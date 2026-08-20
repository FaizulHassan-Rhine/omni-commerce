'use client';

import { cn } from '@/lib/utils';
import PlatformIcon from '@/components/ui/PlatformIcon';
import Select from '@/components/ui/Select';
import PlatformNativePreview from '@/components/ui/PlatformNativePreview';
import PostImageEditTools from '@/components/ui/PostImageEditTools';
import { getReviewFields } from '@/lib/platform-review';
import { FileText, Rocket } from 'lucide-react';

const statusStyles = {
  ready: 'bg-brand-muted text-brand-primary',
  draft: 'bg-amber-50 text-amber-700',
  pending: 'bg-amber-50 text-amber-700',
  published: 'bg-emerald-50 text-emerald-700',
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

export default function PlatformPostReview({
  posts,
  activeId,
  onSelect,
  onChange,
  onChangeCaption,
  onDraft,
  onLaunch,
  onDraftAll,
  onLaunchAll,
  launching,
  showImageTools = true,
  showLaunchActions = true,
  showBulkLaunchActions = true,
  sidePanel = null,
}) {
  const active = posts.find((p) => p.id === activeId) || posts[0];
  if (!active) return null;

  const readyCount = posts.filter((p) => p.status !== 'published' && p.status !== 'pending').length;
  const fields = getReviewFields(active.id);
  const update = (key, value) => {
    if (onChange) onChange(active.id, { [key]: value });
    else if (key === 'caption' && onChangeCaption) onChangeCaption(active.id, value);
  };
  const resetImageEdits = () => {
    if (!onChange) return;
    onChange(active.id, {
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

  const hasSideColumn = showImageTools || sidePanel;

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-1 overflow-x-auto scrollbar-thin" aria-label="Platforms">
          {posts.map((post) => {
            const selected = active.id === post.id;
            return (
              <button
                key={post.id}
                type="button"
                onClick={() => onSelect(post.id)}
                className={cn(
                  'flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                  selected
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                )}
              >
                <PlatformIcon platformId={post.id} size="sm" className="shadow-none" />
                <span>{post.name}</span>
                <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-semibold capitalize', statusStyles[post.status] || statusStyles.ready)}>
                  {post.status === 'pending' ? 'Awaiting' : post.status}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4">
        <div className={cn('grid min-w-0 items-start gap-4', hasSideColumn && 'xl:grid-cols-[1fr_minmax(0,300px)]')}>
        <div className="card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <PlatformIcon platformId={active.id} />
              <div>
                <h3 className="font-semibold text-text-primary">{active.name} preview</h3>
                <p className="text-sm text-text-secondary">
                  Native {active.name} layout · {active.mediaType === 'video' ? 'Video' : 'Image'} · {active.aspectLabel}
                </p>
              </div>
            </div>
            <span className={cn('rounded-md px-3 py-1 text-xs font-semibold capitalize', statusStyles[active.status] || statusStyles.ready)}>
              {active.status === 'pending' ? 'Awaiting approval' : active.status}
            </span>
          </div>

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(240px,340px)_1fr]">
            <div className="h-fit w-full max-w-[340px] justify-self-start xl:sticky xl:top-24">
              <PlatformNativePreview post={active} />
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
              {showLaunchActions && onDraft && onLaunch && (
                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => onDraft(active.id)}
                    disabled={active.status === 'published' || active.status === 'pending' || launching}
                    className="btn-secondary"
                  >
                    <FileText className="h-4 w-4" /> Save as draft
                  </button>
                  <button
                    type="button"
                    onClick={() => onLaunch(active.id)}
                    disabled={active.status === 'published' || active.status === 'pending' || launching}
                    className="btn-gradient"
                  >
                    <Rocket className="h-4 w-4" />
                    {active.status === 'pending' ? 'Awaiting approval' : `Launch to ${active.name}`}
                  </button>
                </div>
              )}
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

        {showBulkLaunchActions && onDraftAll && onLaunchAll && (
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onDraftAll} disabled={launching || readyCount === 0} className="btn-secondary">
            Save all as drafts
          </button>
          <button type="button" onClick={onLaunchAll} disabled={launching || readyCount === 0} className="btn-gradient">
            {launching ? 'Submitting…' : `Launch all (${readyCount})`}
          </button>
        </div>
        )}
      </div>
    </div>
  );
}
