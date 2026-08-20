'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import ContentStudioTabs from '@/components/studio/ContentStudioTabs';
import HumanRetouchModal from '@/components/studio/HumanRetouchModal';
import { mediaPreviewStyle } from '@/lib/studio-edit';
import { resolveImage } from '@/lib/images';
import { useApp } from '@/context/AppContext';
import { Paintbrush, Pencil, Play, Plus, Sparkles } from 'lucide-react';

function MediaCard({ asset, onHumanRetouch }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200/70 bg-white shadow-card">
      <div className="relative aspect-square bg-gray-100">
        <img
          src={resolveImage(asset.src)}
          alt=""
          className="h-full w-full object-cover"
          style={mediaPreviewStyle(asset)}
        />
        {asset.type === 'video' && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-text-primary">
              <Play className="h-5 w-5 fill-current" />
            </span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-1 p-2">
        <Link
          href={`/create/content/edit/${asset.id}`}
          className="btn-secondary whitespace-nowrap px-1 py-1.5 text-[10px] leading-none"
        >
          <Pencil className="h-3 w-3 shrink-0" /> Edit
        </Link>
        <Link
          href={`/create/content/new?type=${asset.type}&from=${asset.id}`}
          className="btn-gradient whitespace-nowrap px-1 py-1.5 text-[10px] leading-none"
        >
          <Sparkles className="h-3 w-3 shrink-0" /> Edit with AI
        </Link>
        <button
          type="button"
          onClick={() => onHumanRetouch?.(asset)}
          className="btn whitespace-nowrap border border-brand-secondary/40 bg-brand-gradient-subtle px-1 py-1.5 text-[10px] leading-none text-brand-secondary hover:border-brand-secondary"
        >
          <Paintbrush className="h-3 w-3 shrink-0" /> Human Retouch
        </button>
      </div>
    </div>
  );
}

export default function ContentStudioPage() {
  const searchParams = useSearchParams();
  const { studioAssets, addToast } = useApp();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'video' ? 'video' : 'image');
  const [retouchAsset, setRetouchAsset] = useState(null);

  const items = useMemo(
    () => studioAssets.filter((asset) => asset.type === activeTab),
    [studioAssets, activeTab]
  );

  const submitHumanRetouch = ({ asset, instructions, marks }) => {
    const markNote = marks.length ? ` with ${marks.length} marked area${marks.length === 1 ? '' : 's'}` : '';
    addToast(
      'success',
      `Human retouch requested for this ${asset.type}${markNote}. Our team will update it in Content Studio.`
    );
    setRetouchAsset(null);
  };

  return (
    <div className="page-container pb-20 lg:pb-6">
      <PageHeader
        title="Content Studio"
        subtitle="Image and video library for products, campaigns, and generated creatives."
      />
      <ContentStudioTabs activeTab={activeTab} onChange={setActiveTab} />

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        <Link
          href={`/create/content/new?type=${activeTab}`}
          className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-text-secondary transition-colors hover:border-brand-primary hover:bg-brand-gradient-subtle hover:text-brand-primary"
        >
          <Plus className="h-12 w-12" />
          <span className="mt-3 text-sm font-semibold">
            {activeTab === 'video' ? 'Create video' : 'Create content'}
          </span>
        </Link>

        {items.map((asset) => (
          <MediaCard key={asset.id} asset={asset} onHumanRetouch={setRetouchAsset} />
        ))}
      </div>

      <HumanRetouchModal
        open={Boolean(retouchAsset)}
        asset={retouchAsset}
        onClose={() => setRetouchAsset(null)}
        onSubmit={submitHumanRetouch}
      />
    </div>
  );
}
