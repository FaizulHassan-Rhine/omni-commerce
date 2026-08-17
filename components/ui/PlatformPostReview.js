'use client';

import { cn } from '@/lib/utils';
import { resolveImage } from '@/lib/images';
import PlatformIcon from '@/components/ui/PlatformIcon';
import { FileText, Play, Rocket } from 'lucide-react';

const statusStyles = {
  ready: 'bg-brand-muted text-brand-primary',
  draft: 'bg-amber-50 text-amber-700',
  published: 'bg-emerald-50 text-emerald-700',
};

export default function PlatformPostReview({
  posts,
  activeId,
  onSelect,
  onChangeCaption,
  onDraft,
  onLaunch,
  onDraftAll,
  onLaunchAll,
  launching,
}) {
  const active = posts.find((p) => p.id === activeId) || posts[0];
  if (!active) return null;

  const readyCount = posts.filter((p) => p.status !== 'published').length;

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <div className="card h-fit space-y-2 p-3">
        <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">Platforms</p>
        {posts.map((post) => (
          <label
            key={post.id}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all',
              active.id === post.id
                ? 'border-brand-primary bg-brand-gradient-subtle'
                : 'border-transparent hover:bg-gray-50'
            )}
          >
            <input
              type="radio"
              name="platform-post"
              checked={active.id === post.id}
              onChange={() => onSelect(post.id)}
              className="accent-brand-primary"
            />
            <PlatformIcon platformId={post.id} size="sm" className="shadow-none" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">{post.name}</p>
              <p className="text-[11px] text-text-muted">{post.aspectLabel}</p>
            </div>
            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize', statusStyles[post.status])}>
              {post.status}
            </span>
          </label>
        ))}
      </div>

      <div className="space-y-4">
        <div className="card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <PlatformIcon platformId={active.id} />
              <div>
                <h3 className="font-semibold text-text-primary">{active.name} post</h3>
                <p className="text-sm text-text-secondary">
                  {active.mediaType === 'video' ? 'Video' : 'Image'} · {active.aspectLabel}
                </p>
              </div>
            </div>
            <span className={cn('rounded-full px-3 py-1 text-xs font-semibold capitalize', statusStyles[active.status])}>
              {active.status}
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(180px,280px)_1fr]">
            <div className="mx-auto w-full max-w-[280px]">
              <div className={cn('relative overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200', active.aspectClass)}>
                <img src={resolveImage(active.mediaUrl)} alt={`${active.name} creative`} className="h-full w-full object-cover" />
                {active.mediaType === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
                      <Play className="h-5 w-5 text-text-primary" />
                    </div>
                    <span className="absolute bottom-3 left-3 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Video {active.aspect}
                    </span>
                  </div>
                )}
                {active.mediaType === 'image' && (
                  <span className="absolute bottom-3 left-3 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    {active.aspect}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Caption</label>
                <textarea
                  value={active.caption}
                  onChange={(e) => onChangeCaption(active.id, e.target.value)}
                  rows={7}
                  className="input resize-none"
                />
              </div>
              <div>
                <label className="label">Call to action</label>
                <input value={active.cta} readOnly className="input bg-gray-50" />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onDraft(active.id)}
                  disabled={active.status === 'published' || launching}
                  className="btn-secondary"
                >
                  <FileText className="h-4 w-4" /> Save as draft
                </button>
                <button
                  type="button"
                  onClick={() => onLaunch(active.id)}
                  disabled={active.status === 'published' || launching}
                  className="btn-gradient"
                >
                  <Rocket className="h-4 w-4" /> Launch to {active.name}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onDraftAll} disabled={launching || readyCount === 0} className="btn-secondary">
            Save all as drafts
          </button>
          <button type="button" onClick={onLaunchAll} disabled={launching || readyCount === 0} className="btn-gradient">
            {launching ? 'Launching…' : `Launch all (${readyCount})`}
          </button>
        </div>
      </div>
    </div>
  );
}
