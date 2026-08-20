'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import StudioImageEditor from '@/components/studio/StudioImageEditor';
import StudioVideoEditor from '@/components/studio/StudioVideoEditor';
import { cropAspectClass, mediaPreviewStyle, overlayClass, overlaySizeClass, withEditDefaults } from '@/lib/studio-edit';
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
    setDraft((prev) => (prev?.id === asset.id ? prev : withEditDefaults(asset)));
  }, [asset]);

  const applyPatch = (patch) => {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const save = () => {
    if (!draft) return;
    updateStudioAsset(draft.id, draft);
    addToast('success', 'Edits saved to Content Studio.');
    router.push(`/create/content?tab=${draft.type}`);
  };

  const reset = () => {
    if (!asset) return;
    setDraft(withEditDefaults(asset));
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
            {draft.type === 'video'
              ? 'Trim, crop frame by frame, and add subtitles on the timeline.'
              : 'Adjust crop, color, filters, and text overlay, then save to the library.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={reset} className="btn-secondary">Reset</button>
          <button type="button" onClick={save} className="btn-gradient">Save to library</button>
        </div>
      </div>

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
