'use client';

import { useState } from 'react';
import Link from 'next/link';
import MetricCard from '@/components/ui/MetricCard';
import Tabs, { TabPanel } from '@/components/ui/Tabs';
import StatusBadge from '@/components/ui/StatusBadge';
import PlatformIcon from '@/components/ui/PlatformIcon';
import AIRecommendation, { ContentScore } from '@/components/ui/AIRecommendation';
import { ChartCard, RevenueSpendChart, RoasTrendChart, SalesByChannelChart, CampaignPerformanceChart, PlatformDonutChart } from '@/components/charts/DashboardCharts';
import { dashboardKPIs, revenueVsSpend, roasTrend, salesByChannel, campaignPerformance, platformDistribution, commerceIntelligence } from '@/data/analytics';
import { products } from '@/data/products';
import { campaigns } from '@/data/campaigns';
import { catalogIssues, catalogSummary } from '@/data/catalog-issues';
import { activities } from '@/data/notifications';
import { formatCurrency, formatRelativeTime, severityColors } from '@/lib/utils';
import { resolveImage } from '@/lib/images';
import {
  DollarSign, TrendingUp, Target, ShoppingCart, Megaphone, Package,
  Sparkles, AlertTriangle, ArrowRight, ImageOff, Search, Plus,
} from 'lucide-react';

const overviewTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'product', label: 'Product' },
  { id: 'campaign', label: 'Campaign' },
];

const activityIcons = {
  campaign: Megaphone,
  publish: Sparkles,
  ai: Sparkles,
  sync: Package,
  approval: Target,
  connection: TrendingUp,
  catalog: Package,
};

const productSales = salesByChannel.filter((d) => ['Shopify', 'Amazon', 'Walmart'].includes(d.channel));
const productPerformance = commerceIntelligence.map((p) => ({
  name: p.product.split(' ').slice(0, 2).join(' '),
  spend: p.adSpend,
  revenue: p.revenue,
}));
const productRevenue = commerceIntelligence.reduce((sum, p) => sum + p.revenue, 0);
const avgContentScore = Math.round(products.reduce((sum, p) => sum + p.contentScore, 0) / products.length);

function ActivityList({ types, viewAllHref, viewAllLabel }) {
  const items = activities.filter((a) => types.includes(a.type));

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
        <Link href={viewAllHref} className="flex items-center gap-1 text-sm text-brand-primary">
          {viewAllLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="space-y-3">
        {items.map((a) => {
          const Icon = activityIcons[a.type] || Sparkles;
          return (
            <div key={a.id} className="flex items-center gap-3 rounded-xl p-3 hover:bg-gray-50">
              <div className="rounded-lg bg-brand-gradient-subtle p-2">
                <Icon className="h-4 w-4 text-brand-primary" />
              </div>
              <p className="flex-1 text-sm text-gray-700">{a.text}</p>
              <span className="text-xs text-gray-400">{formatRelativeTime(a.time)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProductOverview() {
  return (
    <TabPanel>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard title="Published Products" value={dashboardKPIs.publishedProducts.value} icon={Package} />
        <MetricCard title="Need Attention" value={catalogSummary.needAttention} icon={AlertTriangle} />
        <MetricCard title="Product Revenue" value={productRevenue} change={18.4} icon={DollarSign} />
        <MetricCard title="Avg Content Score" value={avgContentScore} icon={Sparkles} />
        <MetricCard title="SEO Issues" value={catalogSummary.seoIssues} icon={Search} />
        <MetricCard title="Low-Quality Images" value={catalogSummary.lowQualityImages} icon={ImageOff} />
      </div>

      <div className="mt-6">
        <AIRecommendation title="Product catalog insight">
          Products with a 90+ content score deliver 28% higher ROAS. {catalogSummary.needAttention} listings still need attention — start with low-quality images and SEO gaps.
        </AIRecommendation>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Sales by Channel">
          <SalesByChannelChart data={productSales} />
        </ChartCard>
        <ChartCard title="Product Performance">
          <CampaignPerformanceChart data={productPerformance} />
        </ChartCard>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="card overflow-x-auto">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Top products</h3>
            <Link href="/catalog" className="flex items-center gap-1 text-sm text-brand-primary">
              View catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {['Product', 'Stock', 'Score', 'Revenue', 'ROAS'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const intel = commerceIntelligence.find((row) => row.product === p.name);
                return (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <Link href={`/catalog?product=${p.id}`} className="flex items-center gap-3">
                        <img src={resolveImage(p.image)} alt="" className="h-9 w-9 rounded-lg object-cover" />
                        <span className="font-medium text-brand-primary">{p.name}</span>
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-gray-600">{p.stock}</td>
                    <td className="px-3 py-3"><ContentScore score={p.contentScore} /></td>
                    <td className="px-3 py-3">{intel ? formatCurrency(intel.revenue) : '—'}</td>
                    <td className="px-3 py-3 font-semibold">{intel?.roas ? `${intel.roas}x` : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="card overflow-x-auto">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Catalog issues</h3>
            <Link href="/guardian" className="flex items-center gap-1 text-sm text-brand-primary">
              AI Guardian <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {['Product', 'Issue', 'Severity'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {catalogIssues.slice(0, 6).map((issue) => (
                <tr key={issue.id} className="border-b border-gray-100">
                  <td className="px-3 py-3 font-medium text-gray-800">{issue.product}</td>
                  <td className="px-3 py-3 text-gray-600">{issue.issue}</td>
                  <td className={`px-3 py-3 font-medium ${severityColors[issue.severity]}`}>{issue.severity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <ActivityList types={['catalog', 'sync', 'ai', 'publish']} viewAllHref="/catalog" viewAllLabel="View catalog" />
      </div>
    </TabPanel>
  );
}

function CampaignOverview() {
  const topCampaigns = [...campaigns].sort((a, b) => b.revenue - a.revenue).slice(0, 6);

  return (
    <TabPanel>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard title="Total Revenue" value={dashboardKPIs.totalRevenue.value} change={dashboardKPIs.totalRevenue.change} icon={DollarSign} />
        <MetricCard title="Ad Spend" value={dashboardKPIs.adSpend.value} change={dashboardKPIs.adSpend.change} icon={TrendingUp} />
        <MetricCard title="ROAS" value={dashboardKPIs.roas.value} change={dashboardKPIs.roas.change} suffix="x" icon={Target} />
        <MetricCard title="Conversions" value={dashboardKPIs.conversions.value} change={dashboardKPIs.conversions.change} icon={ShoppingCart} />
        <MetricCard title="Active Campaigns" value={dashboardKPIs.activeCampaigns.value} icon={Megaphone} />
        <MetricCard title="Published Products" value={dashboardKPIs.publishedProducts.value} icon={Package} />
      </div>

      <div className="mt-6">
        <AIRecommendation title="Campaign insight">
          Retargeting is converting 3.2x better than cold traffic. Scale high-ROAS campaigns and review spend on listings below 3x.
        </AIRecommendation>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Revenue vs Ad Spend">
          <RevenueSpendChart data={revenueVsSpend} />
        </ChartCard>
        <ChartCard title="ROAS Trend">
          <RoasTrendChart data={roasTrend} />
        </ChartCard>
        <ChartCard title="Campaign Performance">
          <CampaignPerformanceChart data={campaignPerformance} />
        </ChartCard>
        <ChartCard title="Platform Distribution">
          <PlatformDonutChart data={platformDistribution} />
        </ChartCard>
      </div>

      <div className="mt-8 card overflow-x-auto">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Top campaigns</h3>
          <Link href="/campaigns" className="flex items-center gap-1 text-sm text-brand-primary">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {['Campaign', 'Status', 'Channels', 'Spend', 'Revenue', 'ROAS'].map((h) => (
                <th key={h} className="px-3 py-2 text-left font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topCampaigns.map((c) => (
              <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-3">
                  <Link href={`/campaigns/${c.id}`} className="font-medium text-brand-primary hover:underline">{c.name}</Link>
                </td>
                <td className="px-3 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-3 py-3">
                  <div className="flex -space-x-1">
                    {c.channels.slice(0, 3).map((ch) => <PlatformIcon key={ch} platformId={ch} size="sm" />)}
                  </div>
                </td>
                <td className="px-3 py-3">{formatCurrency(c.spend)}</td>
                <td className="px-3 py-3">{formatCurrency(c.revenue)}</td>
                <td className="px-3 py-3 font-semibold">{c.roas > 0 ? `${c.roas}x` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <ActivityList types={['campaign', 'approval', 'connection']} viewAllHref="/campaigns" viewAllLabel="View campaigns" />
      </div>
    </TabPanel>
  );
}

function OverviewSummary() {
  return (
    <TabPanel>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard title="Total Revenue" value={dashboardKPIs.totalRevenue.value} change={dashboardKPIs.totalRevenue.change} icon={DollarSign} />
        <MetricCard title="Ad Spend" value={dashboardKPIs.adSpend.value} change={dashboardKPIs.adSpend.change} icon={TrendingUp} />
        <MetricCard title="ROAS" value={dashboardKPIs.roas.value} change={dashboardKPIs.roas.change} suffix="x" icon={Target} />
        <MetricCard title="Published Products" value={dashboardKPIs.publishedProducts.value} icon={Package} />
        <MetricCard title="Need Attention" value={catalogSummary.needAttention} icon={AlertTriangle} />
        <MetricCard title="Active Campaigns" value={dashboardKPIs.activeCampaigns.value} icon={Megaphone} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <AIRecommendation title="Business insight">
          Product listings with stronger content scores are driving better conversion, while retargeting campaigns keep the best ROAS.
          Prioritize low-quality product fixes and scale high-performing campaigns together.
        </AIRecommendation>
        <AIRecommendation title="Recommended next steps">
          Fix {catalogSummary.lowQualityImages} low-quality product images, resolve {catalogSummary.seoIssues} SEO issues, and reallocate spend
          from weak campaigns to top performers.
        </AIRecommendation>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Revenue vs Ad Spend">
          <RevenueSpendChart data={revenueVsSpend} />
        </ChartCard>
        <ChartCard title="Sales by Channel">
          <SalesByChannelChart data={salesByChannel} />
        </ChartCard>
      </div>

      <div className="mt-8">
        <ActivityList types={['catalog', 'campaign', 'publish', 'approval', 'ai', 'sync']} viewAllHref="/notifications" viewAllLabel="View all activity" />
      </div>
    </TabPanel>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="page-container pb-20 lg:pb-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Good morning, Alex</h1>
          <p className="mt-1 text-gray-500">
            {activeTab === 'overview'
              ? 'Track product and campaign performance in one snapshot.'
              : activeTab === 'product'
              ? 'Product catalog health, sales, and listings that need attention.'
              : 'Campaign spend, ROAS, and what’s performing across channels.'}
          </p>
        </div>
        <div className="flex gap-3">
          {activeTab === 'overview' ? (
            <>
              <Link href="/catalog" className="btn-secondary">View Catalog</Link>
              <Link href="/campaigns" className="btn-secondary">View Campaigns</Link>
            </>
          ) : activeTab === 'product' ? (
            <>
              <Link href="/catalog" className="btn-secondary">View Catalog</Link>
              <Link href="/catalog/create" className="btn-gradient"><Plus className="h-4 w-4" /> Create Product</Link>
            </>
          ) : (
            <>
              <Link href="/campaigns" className="btn-secondary">View Campaigns</Link>
              <Link href="/campaigns/create" className="btn-gradient"><Plus className="h-4 w-4" /> Create Campaign</Link>
            </>
          )}
        </div>
      </div>

      <Tabs tabs={overviewTabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' ? <OverviewSummary /> : activeTab === 'product' ? <ProductOverview /> : <CampaignOverview />}
    </div>
  );
}
