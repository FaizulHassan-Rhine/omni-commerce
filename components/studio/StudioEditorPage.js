'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import StudioImageEditor from '@/components/studio/StudioImageEditor';
import StudioVideoEditor from '@/components/studio/StudioVideoEditor';
import PlatformIcon from '@/components/ui/PlatformIcon';
import {
  applyPlatformVariant,
  commitPlatformVariant,
  cropAspectClass,
  mediaPreviewStyle,
  overlayClass,
  overlaySizeClass,
  withEditDefaults,
} from '@/lib/studio-edit';
import { getPlatform, getPlatformCreativeSpec } from '@/data/platforms';
import { resolveImage } from '@/lib/images';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

export default function StudioEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { studioAssets, updateStudioAsset, addToast } = useApp();
  const [draft, setDraft] = useState(null);

  const asset = studioAssets.find((item) => item.id === params.id);

  useEffect(() => {
    if (!asset) return;
    setDraft((prev) => {
      if (prev?.id === asset.id) return prev;
      const base = withEditDefaults(asset);
      if (!base.platforms?.length) return base;
      const platformId = base.activePlatformId || base.platforms[0];
      return applyPlatformVariant(commitPlatformVariant(base, platformId), platformId);
    });
  }, [asset]);

  const platformTabs = useMemo(() => {
    if (!draft?.platforms?.length) return [];
    return draft.platforms.map((id) => {
      const spec = getPlatformCreativeSpec(id);
      return {
        id,
        name: getPlatform(id).name,
        aspect: spec.aspect,
        label: spec.label,
      };
    });
  }, [draft?.platforms]);

  const activePlatformId = draft?.activePlatformId || platformTabs[0]?.id || null;

  const applyPatch = (patch) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      if (!next.platforms?.length || !next.activePlatformId) return next;
      return commitPlatformVariant(next, next.activePlatformId);
    });
  };

  const switchPlatform = (platformId) => {
    setDraft((prev) => {
      if (!prev || prev.activePlatformId === platformId) return prev;
      const saved = commitPlatformVariant(prev, prev.activePlatformId);
      return applyPlatformVariant(saved, platformId);
    });
  };

  const save = () => {
    if (!draft) return;
    const toSave = draft.platforms?.length
      ? commitPlatformVariant(draft, draft.activePlatformId || draft.platforms[0])
      : draft;
    updateStudioAsset(toSave.id, toSave);
    addToast('success', 'Edits saved to Content Studio.');
    router.push(`/create/content?tab=${toSave.type}`);
  };

  const reset = () => {
    if (!asset) return;
    const base = withEditDefaults(asset);
    if (!base.platforms?.length) {
      setDraft(base);
      return;
    }
    const platformId = base.activePlatformId || base.platforms[0];
    setDraft(applyPlatformVariant(commitPlatformVariant(base, platformId), platformId));
  };

  if (!asset) {
    return (
      <div className="page-container py-16 text-center">
        <h2 className="text-xl font-semibold">Asset not found</h2>
        <Link href="/create/content" className="btn-primary mt-4 inline-flex">Back to Content Studio</Link>
      </div>
    );
  }

  if (!draft) return null;

  return (
    <div className="page-container pb-24 lg:pb-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href={`/create/content?tab=${draft.type}`} className="mb-2 inline-flex items-center gap-1 text-sm text-text-muted hover:text-brand-primary">
            <ArrowLeft className="h-4 w-4" /> Back to library
          </Link>
          <h1 className="text-xl font-semibold text-text-primary">
            {draft.type === 'video' ? 'Edit video' : 'Edit image'}
          </h1>
          <p className="text-sm text-text-secondary">
            {platformTabs.length > 0
              ? 'Switch platforms to edit each social crop and overlay separately, then save.'
              : draft.type === 'video'
                ? 'Trim, crop frame by frame, and add subtitles on the timeline.'
                : 'Adjust crop, color, filters, and text overlay, then save to the library.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={reset} className="btn-secondary">Reset</button>
          <button type="button" onClick={save} className="btn-gradient">Save to library</button>
        </div>
      </div>

      {platformTabs.length > 0 && (
        <div className="mb-5 border-b border-gray-200">
          <nav className="-mb-px flex gap-1 overflow-x-auto scrollbar-thin" aria-label="Social platforms">
            {platformTabs.map((tab) => {
              const selected = activePlatformId === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => switchPlatform(tab.id)}
                  className={cn(
                    'flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors',
                    selected
                      ? 'border-brand-primary text-brand-primary'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  )}
                >
                  <PlatformIcon platformId={tab.id} size="sm" className="shadow-none" />
                  <span>{tab.name}</span>
                  <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-text-muted">
                    {tab.aspect}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {draft.type === 'video' ? (
        <StudioVideoEditor draft={draft} onChange={applyPatch} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="flex items-center justify-center rounded-2xl bg-gray-100 p-4">
            <div className={cn('relative w-full max-w-xl overflow-hidden rounded-xl bg-black', cropAspectClass(draft.cropPreset))}>
              <img
                src={resolveImage(draft.src)}
                alt=""
                className="h-full w-full object-cover"
                style={mediaPreviewStyle(draft)}
              />
              {draft.vignette > 0 && (
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ boxShadow: `inset 0 0 ${80 + draft.vignette}px rgba(0,0,0,${draft.vignette / 120})` }}
                />
              )}
              {draft.overlayTitle && (
                <div
                  className={cn('absolute max-w-[82%] font-semibold leading-tight drop-shadow-md', overlayClass(draft.overlayPosition), overlaySizeClass(draft.overlaySize))}
                  style={{ color: draft.overlayColor || '#FFFFFF' }}
                >
                  {draft.overlayTitle}
                </div>
              )}
            </div>
          </div>
          <StudioImageEditor draft={draft} onChange={applyPatch} onReset={reset} />
        </div>
      )}
    </div>
  );
}
