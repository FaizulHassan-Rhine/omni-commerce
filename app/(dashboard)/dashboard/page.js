'use client';

import Link from 'next/link';
import MetricCard from '@/components/ui/MetricCard';
import { ChartCard, RevenueSpendChart, RoasTrendChart, SalesByChannelChart, CampaignPerformanceChart, PlatformDonutChart } from '@/components/charts/DashboardCharts';
import UploadDropzone, { PromptInput } from '@/components/ui/UploadDropzone';
import { dashboardKPIs, revenueVsSpend, roasTrend, salesByChannel, campaignPerformance, platformDistribution } from '@/data/analytics';
import { activities } from '@/data/notifications';
import { formatRelativeTime } from '@/lib/utils';
import {
  DollarSign, TrendingUp, Target, ShoppingCart, Megaphone, Package,
  Sparkles, FileText, ArrowRight,
} from 'lucide-react';
import { useState } from 'react';

const activityIcons = {
  campaign: Megaphone,
  publish: Sparkles,
  ai: Sparkles,
  sync: Package,
  approval: Target,
  connection: TrendingUp,
  catalog: Package,
};

export default function DashboardPage() {
  const [prompt, setPrompt] = useState('');

  return (
    <div className="page-container pb-20 lg:pb-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">Good morning, Alex</h1>
          <p className="mt-1 text-gray-500 dark:text-slate-400">Here&apos;s what&apos;s happening across your commerce ecosystem.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/create/content" className="btn-primary">Create Content</Link>
          <Link href="/create/campaign" className="btn-gradient">Create Campaign</Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard title="Total Revenue" value={dashboardKPIs.totalRevenue.value} change={dashboardKPIs.totalRevenue.change} icon={DollarSign} />
        <MetricCard title="Ad Spend" value={dashboardKPIs.adSpend.value} change={dashboardKPIs.adSpend.change} icon={TrendingUp} />
        <MetricCard title="ROAS" value={dashboardKPIs.roas.value} change={dashboardKPIs.roas.change} suffix="x" icon={Target} />
        <MetricCard title="Conversions" value={dashboardKPIs.conversions.value} change={dashboardKPIs.conversions.change} icon={ShoppingCart} />
        <MetricCard title="Active Campaigns" value={dashboardKPIs.activeCampaigns.value} icon={Megaphone} />
        <MetricCard title="Published Products" value={dashboardKPIs.publishedProducts.value} icon={Package} />
      </div>

      {/* AI Quick Create */}
      <div className="mt-8 card border-brand-primary/20 bg-brand-gradient-subtle/30">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">What do you want to create today?</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            placeholder="Describe your product or campaign idea…"
          />
          <UploadDropzone onUpload={() => {}} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { label: 'Create Product Post', href: '/create/content', icon: FileText },
            { label: 'Create Ad Campaign', href: '/create/campaign', icon: Megaphone },
            { label: 'Generate Product Listing', href: '/create/content', icon: Sparkles },
          ].map((action) => (
            <Link key={action.label} href={action.href} className="btn-secondary text-xs">
              <action.icon className="h-3.5 w-3.5" /> {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Revenue vs Ad Spend">
          <RevenueSpendChart data={revenueVsSpend} />
        </ChartCard>
        <ChartCard title="ROAS Trend">
          <RoasTrendChart data={roasTrend} />
        </ChartCard>
        <ChartCard title="Sales by Channel">
          <SalesByChannelChart data={salesByChannel} />
        </ChartCard>
        <ChartCard title="Campaign Performance">
          <CampaignPerformanceChart data={campaignPerformance} />
        </ChartCard>
      </div>
      <div className="mt-6">
        <ChartCard title="Platform Distribution" className="max-w-md">
          <PlatformDonutChart data={platformDistribution} />
        </ChartCard>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          <Link href="/analytics/performance" className="text-sm text-brand-primary dark:text-indigo-400 flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {activities.map((a) => {
            const Icon = activityIcons[a.type] || Sparkles;
            return (
              <div key={a.id} className="flex items-center gap-3 rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <div className="rounded-lg bg-brand-gradient-subtle p-2">
                  <Icon className="h-4 w-4 text-brand-primary dark:text-indigo-400" />
                </div>
                <p className="flex-1 text-sm text-gray-700 dark:text-slate-300">{a.text}</p>
                <span className="text-xs text-gray-400">{formatRelativeTime(a.time)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
