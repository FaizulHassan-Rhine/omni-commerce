'use client';

import PageHeader from '@/components/ui/PageHeader';
import MetricCard from '@/components/ui/MetricCard';
import { ChartCard, RevenueSpendChart, RoasTrendChart, SalesByChannelChart } from '@/components/charts/DashboardCharts';
import { performanceMetrics, revenueVsSpend, roasTrend, salesByChannel } from '@/data/analytics';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, Target, TrendingUp, MousePointer, ShoppingCart } from 'lucide-react';

export default function PerformancePage() {
  return (
    <div className="page-container pb-20">
      <PageHeader title="Performance Analytics" subtitle="Unified view of revenue, spend, and conversions." />

      <div className="mb-6 flex flex-wrap gap-3">
        {['Last 7 days', 'Last 30 days', 'Last 90 days'].map((r, i) => (
          <button key={r} className={`btn-secondary text-xs ${i === 1 ? 'border-brand-primary bg-brand-gradient-subtle' : ''}`}>{r}</button>
        ))}
        <select className="input w-auto text-xs"><option>All Campaigns</option></select>
        <select className="input w-auto text-xs"><option>All Products</option></select>
        <select className="input w-auto text-xs"><option>All Platforms</option></select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard title="Revenue" value={performanceMetrics.revenue} icon={DollarSign} change={18.4} />
        <MetricCard title="Spend" value={performanceMetrics.spend} icon={TrendingUp} change={8.2} />
        <MetricCard title="ROAS" value={performanceMetrics.roas} suffix="x" icon={Target} change={12.8} />
        <MetricCard title="CPA" value={formatCurrency(performanceMetrics.cpa)} icon={DollarSign} />
        <MetricCard title="CTR" value={`${performanceMetrics.ctr}%`} icon={MousePointer} />
        <MetricCard title="Conversions" value={performanceMetrics.conversions} icon={ShoppingCart} change={15.7} />
        <MetricCard title="Orders" value={performanceMetrics.orders} icon={ShoppingCart} />
        <MetricCard title="AOV" value={formatCurrency(performanceMetrics.aov)} icon={DollarSign} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Revenue vs Spend"><RevenueSpendChart data={revenueVsSpend} /></ChartCard>
        <ChartCard title="ROAS Trend"><RoasTrendChart data={roasTrend} /></ChartCard>
        <ChartCard title="Sales by Channel"><SalesByChannelChart data={salesByChannel} /></ChartCard>
      </div>
    </div>
  );
}
