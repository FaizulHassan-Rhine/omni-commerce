'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import ContentStudioTabs from '@/components/studio/ContentStudioTabs';
import { mediaPreviewStyle } from '@/lib/studio-edit';
import { resolveImage } from '@/lib/images';
import { useApp } from '@/context/AppContext';
import { Pencil, Play, Plus, Sparkles } from 'lucide-react';

function MediaCard({ asset }) {
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
      <div className="grid grid-cols-2 gap-2 p-2">
        <Link href={`/create/content/edit/${asset.id}`} className="btn-secondary py-1.5 text-xs">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </Link>
        <Link href={`/create/content/new?type=${asset.type}&from=${asset.id}`} className="btn-gradient py-1.5 text-xs">
          <Sparkles className="h-3.5 w-3.5" /> Edit with AI
        </Link>
      </div>
    </div>
  );
}

export default function ContentStudioPage() {
  const searchParams = useSearchParams();
  const { studioAssets } = useApp();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'video' ? 'video' : 'image');

  const items = useMemo(
    () => studioAssets.filter((asset) => asset.type === activeTab),
    [studioAssets, activeTab]
  );

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
          <MediaCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
}
