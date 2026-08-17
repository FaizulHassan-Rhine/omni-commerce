'use client';

import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import AIRecommendation from '@/components/ui/AIRecommendation';
import { creatives, aiCreativeRecommendation } from '@/data/creatives';
import { resolveImage } from '@/lib/images';
import { formatCurrency } from '@/lib/utils';
import PlatformIcon from '@/components/ui/PlatformIcon';

export default function CreativeIntelligencePage() {
  return (
    <div className="page-container pb-20">
      <PageHeader title="Creative Intelligence" subtitle="Analyze creative performance across campaigns." />

      <AIRecommendation className="mb-8">{aiCreativeRecommendation.text}</AIRecommendation>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {creatives.map((c) => (
          <div key={c.id} className="card">
            <div className="relative">
              <img src={resolveImage(c.preview)} alt={c.name} className="w-full rounded-xl aspect-square object-cover" />
              <div className="absolute top-2 right-2"><StatusBadge status={c.badge} /></div>
            </div>
            <div className="mt-3">
              <p className="font-medium text-sm">{c.name}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <PlatformIcon platformId={c.platform} size="sm" />
                {c.campaign}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-gray-400">Spend</span><p className="font-semibold">{formatCurrency(c.spend)}</p></div>
                <div><span className="text-gray-400">CTR</span><p className="font-semibold">{c.ctr}%</p></div>
                <div><span className="text-gray-400">CPA</span><p className="font-semibold">{formatCurrency(c.cpa)}</p></div>
                <div><span className="text-gray-400">ROAS</span><p className="font-semibold">{c.roas}x</p></div>
              </div>
              <div className="mt--2 flex items-center justify-between">
                <span className="text-xs text-gray-400">Score</span>
                <span className="text-sm font-bold text-brand-primary">{c.score}/100</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
