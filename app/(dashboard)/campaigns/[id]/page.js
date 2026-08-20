'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import Tabs, { TabPanel } from '@/components/ui/Tabs';
import PlatformIcon from '@/components/ui/PlatformIcon';
import AIRecommendation from '@/components/ui/AIRecommendation';
import { ChartCard, RevenueSpendChart } from '@/components/charts/DashboardCharts';
import { useApp } from '@/context/AppContext';
import { revenueVsSpend } from '@/data/analytics';
import { formatCurrency } from '@/lib/utils';
import { resolveImage } from '@/lib/images';
import { DollarSign, TrendingUp, Target, MousePointer, Eye, ShoppingCart, MoreHorizontal, Pause, Copy } from 'lucide-react';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'ads', label: 'Ads' },
  { id: 'creatives', label: 'Creatives' },
  { id: 'audience', label: 'Audience' },
  { id: 'platforms', label: 'Platforms' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'ai-insights', label: 'AI Insights' },
  { id: 'activity', label: 'Activity' },
];

export default function CampaignDetailPage() {
  const params = useParams();
  const { workspaceCampaigns, catalogProducts } = useApp();
  const campaign = workspaceCampaigns.find((item) => item.id === params.id);
  const [activeTab, setActiveTab] = useState('overview');

  if (!campaign) {
    return (
      <div className="page-container py-20 text-center">
        <h2 className="text-xl font-bold">Campaign not found</h2>
        <Link href="/campaigns" className="btn-primary mt-4 inline-flex">Back to Campaigns</Link>
      </div>
    );
  }

  const product = catalogProducts.find((item) => item.id === campaign.productId);

  return (
    <div className="page-container pb-20">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{campaign.name}</h1>
            <StatusBadge status={campaign.status} />
          </div>
          <p className="mt-1 text-gray-500">{campaign.objective} · Started {campaign.startDate}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary"><Pause className="h-4 w-4" /> Pause</button>
          <button className="btn-secondary"><Copy className="h-4 w-4" /> Duplicate</button>
          <button className="btn-ghost"><MoreHorizontal className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 mb-8">
        <MetricCard title="Spend" value={campaign.spend} icon={DollarSign} />
        <MetricCard title="Revenue" value={campaign.revenue} icon={TrendingUp} />
        <MetricCard title="ROAS" value={campaign.roas} suffix="x" icon={Target} />
        <MetricCard title="CTR" value={`${campaign.ctr}%`} icon={MousePointer} />
        <MetricCard title="CPA" value={formatCurrency(campaign.cpa)} icon={DollarSign} />
        <MetricCard title="Conversions" value={campaign.conversions} icon={ShoppingCart} />
        <MetricCard title="Impressions" value={campaign.impressions} icon={Eye} />
        <MetricCard title="Clicks" value={campaign.clicks} icon={MousePointer} />
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <TabPanel>
        {activeTab === 'overview' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Performance Trend"><RevenueSpendChart data={revenueVsSpend} /></ChartCard>
            <div className="card">
              <h3 className="font-semibold mb-4">Campaign Details</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-gray-500">Product</dt><dd>{product?.name}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Daily Budget</dt><dd>{formatCurrency(campaign.budget?.daily || 0)}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Total Budget</dt><dd>{campaign.budget?.total ? formatCurrency(campaign.budget.total) : 'Ongoing'}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">End Date</dt><dd>{campaign.endDate || 'Ongoing'}</dd></div>
              </dl>
            </div>
          </div>
        )}
        {activeTab === 'creatives' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {['Variant A — Emotional', 'Variant B — Product Focused', 'Variant C — Offer Focused'].map((v, i) => (
              <div key={v} className="card">
                <img src={resolveImage('/images/ad-square.jpg')} alt={v} className="w-full rounded-xl mb-3" />
                <p className="font-medium text-sm">{v}</p>
                <p className="text-xs text-gray-500 mt-1">CTR: {(3.2 - i * 0.4).toFixed(1)}% · ROAS: {(6.1 - i * 0.8).toFixed(1)}x</p>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'platforms' && (
          <div className="grid gap-4 sm:grid-cols-3">
            {campaign.channels.map((ch) => (
              <div key={ch} className="card flex items-center gap-3">
                <PlatformIcon platformId={ch} />
                <div><p className="font-medium">{ch}</p><p className="text-xs text-emerald-500">Active</p></div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'ai-insights' && (
          <AIRecommendation title="AI Campaign Insights">
            <p>Campaign is performing above benchmark with 5.0x ROAS. Variant B outperforms by 34%. Consider increasing budget allocation to Meta Ads by 15% and refreshing Variant C creative which shows fatigue signals.</p>
          </AIRecommendation>
        )}
        {activeTab === 'activity' && (
          <div className="space-y-3">
            {['Campaign launched', 'Budget increased to $150/day', 'Variant B approved', 'Meta Ads sync completed'].map((a, i) => (
              <div key={i} className="card p-4 text-sm">{a} · {i + 1} days ago</div>
            ))}
          </div>
        )}
        {!['overview', 'creatives', 'platforms', 'ai-insights', 'activity'].includes(activeTab) && (
          <div className="card p-8 text-center text-gray-500">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} data for this campaign.
          </div>
        )}
      </TabPanel>
    </div>
  );
}
