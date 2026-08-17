'use client';

import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import { creatives } from '@/data/creatives';
import { resolveImage } from '@/lib/images';
import { formatCurrency } from '@/lib/utils';
import PlatformIcon from '@/components/ui/PlatformIcon';
import Link from 'next/link';

export default function CreativesPage() {
  return (
    <div className="page-container pb-20">
      <PageHeader
        title="Creative Library"
        subtitle="All ad creatives across campaigns."
        actions={<Link href="/create/content" className="btn-gradient">Generate Creative</Link>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {creatives.map((c) => (
          <div key={c.id} className="card">
            <img src={resolveImage(c.preview)} alt={c.name} className="w-full rounded-xl aspect-video object-cover" />
            <div className="mt-3 flex items-center justify-between">
              <p className="font-medium text-sm">{c.name}</p>
              <StatusBadge status={c.badge} />
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
              <PlatformIcon platformId={c.platform} size="sm" /> {c.campaign}
            </div>
            <div className="mt-2 flex gap-4 text-xs">
              <span>Spend: {formatCurrency(c.spend)}</span>
              <span>ROAS: {c.roas}x</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
