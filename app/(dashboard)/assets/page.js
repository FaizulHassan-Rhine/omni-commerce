'use client';

import PageHeader from '@/components/ui/PageHeader';
import { creatives } from '@/data/creatives';
import { resolveImage, getPlaceholderImage } from '@/lib/images';
import { Image, Video, FileText } from 'lucide-react';

const assetTypes = [
  { type: 'images', label: 'Images', icon: Image },
  { type: 'videos', label: 'Videos', icon: Video },
  { type: 'copy', label: 'Copy', icon: FileText },
];

export default function AssetsPage() {
  return (
    <div className="page-container pb-20">
      <PageHeader title="Assets" subtitle="Manage your creative assets and media library." />

      <div className="mb-6 flex gap-2">
        {assetTypes.map((t) => (
          <button key={t.type} className="btn-secondary text-xs"><t.icon className="h-3.5 w-3.5" /> {t.label}</button>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {creatives.map((c) => (
          <div key={c.id} className="card-hover p-3">
            <img src={resolveImage(c.preview)} alt={c.name} className="w-full rounded-lg aspect-square object-cover" />
            <p className="mt-2 text-xs font-medium truncate">{c.name}</p>
            <p className="text-[10px] text-gray-400">{c.campaign}</p>
          </div>
        ))}
        {[0, 1, 2].map((i) => (
          <div key={`extra-${i}`} className="card-hover p-3">
            <img src={getPlaceholderImage('ad', i + 2)} alt="" className="w-full rounded-lg aspect-square object-cover" />
            <p className="mt-2 text-xs font-medium">Generated Asset {i + 1}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
