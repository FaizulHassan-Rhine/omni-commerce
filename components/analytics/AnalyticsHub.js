'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import MetricCard from '@/components/ui/MetricCard';
import Select from '@/components/ui/Select';
import StatusBadge from '@/components/ui/StatusBadge';
import AIRecommendation from '@/components/ui/AIRecommendation';
import PlatformIcon from '@/components/ui/PlatformIcon';
import AnalyticsTabs from '@/components/analytics/AnalyticsTabs';
import { ChartCard, RevenueSpendChart, RoasTrendChart, SalesByChannelChart } from '@/components/charts/DashboardCharts';
import {
  performanceMetrics,
  revenueVsSpend,
  roasTrend,
  salesByChannel,
  commerceIntelligence,
  aiLearningInsights,
  campaignPerformance,
} from '@/data/analytics';
import { campaigns } from '@/data/campaigns';
import { products } from '@/data/products';
import { platforms } from '@/data/platforms';
import { creatives, aiCreativeRecommendation } from '@/data/creatives';
import { generateAIAnalystResponse } from '@/lib/mock-ai';
import { resolveImage } from '@/lib/images';
import { formatCurrency, cn } from '@/lib/utils';
import {
  DollarSign,
  Target,
  TrendingDown,
  TrendingUp,
  MousePointer,
  ShoppingCart,
  Sparkles,
  Send,
  Package,
  Megaphone,
  Lightbulb,
} from 'lucide-react';

const rangeOptions = ['Last 7 days', 'Last 30 days', 'Last 90 days'];

const recColors = {
  Scale: 'bg-emerald-100 text-emerald-700',
  Maintain: 'bg-blue-100 text-blue-700',
  'Reduce Spend': 'bg-amber-100 text-amber-700',
  Restock: 'bg-purple-100 text-purple-700',
  'Stop Campaign': 'bg-red-100 text-red-700',
};

const productSuggestions = products.map((product) => {
  let suggestion = 'Maintain current strategy';
  let insight = 'Stable performance across connected channels.';
  if (product.contentScore >= 90) {
    suggestion = 'Scale ad spend +20%';
    insight = 'High content score correlates with 28% higher ROAS in your catalog.';
  } else if (product.contentScore < 75) {
    suggestion = 'Improve content & SEO';
    insight = 'Refresh product copy and images to lift conversion rate.';
  } else if (product.stock === 0) {
    suggestion = 'Restock before campaigns';
    insight = 'Out of stock — pause ads to avoid wasted spend.';
  } else if (product.status === 'Rejected') {
    suggestion = 'Fix listing issues';
    insight = 'Rejected status may block marketplace distribution.';
  }
  return { ...product, suggestion, insight };
});

const campaignSuggestions = campaigns.map((campaign) => {
  let suggestion = 'Maintain';
  let insight = 'Campaign is performing within target range.';
  if (campaign.roas >= 5) {
    suggestion = 'Scale budget';
    insight = `Strong ${campaign.roas}x ROAS — increase daily budget by 15–20%.`;
  } else if (campaign.roas > 0 && campaign.roas < 2.5) {
    suggestion = 'Optimize or pause';
    insight = 'Low ROAS — test new creatives or narrow audience targeting.';
  } else if (campaign.status === 'Paused') {
    suggestion = 'Review before restart';
    insight = 'Paused campaign — audit creative fatigue before reactivating.';
  } else if (campaign.status === 'Needs Review') {
    suggestion = 'Needs review';
    insight = 'Performance dropped — AI recommends creative refresh.';
  } else if (campaign.status === 'Draft') {
    suggestion = 'Launch when ready';
    insight = 'Draft campaign — complete setup and publish to start collecting data.';
  }
  return { ...campaign, suggestion, insight };
});

const suggestedQuestions = [
  'Why did ROAS decrease this week?',
  'Which product should receive more budget?',
  'Which creative performs best?',
  'Which platform is wasting budget?',
  'Should I pause any campaign?',
];

export default function AnalyticsHub() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [range, setRange] = useState('Last 30 days');
  const [campaignFilter, setCampaignFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const askQuestion = async (question) => {
    setLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    await new Promise((r) => setTimeout(r, 1200));
    const response = generateAIAnalystResponse(question);
    setMessages((prev) => [...prev, { role: 'ai', content: response }]);
    setLoading(false);
    setInput('');
  };

  return (
    <div className="page-container pb-20">
      <PageHeader
        title="Analytics"
        subtitle="Performance data, AI suggestions, and market insights across products and campaigns."
      />

      <AnalyticsTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-wrap gap-3">
            <Select value={range} onChange={setRange} aria-label="Date range" options={rangeOptions} />
            <Select
              value={campaignFilter}
              onChange={setCampaignFilter}
              aria-label="Campaign"
              options={[{ value: 'all', label: 'All campaigns' }, ...campaigns.map((c) => ({ value: c.id, label: c.name }))]}
            />
            <Select
              value={productFilter}
              onChange={setProductFilter}
              aria-label="Product"
              options={[{ value: 'all', label: 'All products' }, ...products.map((p) => ({ value: p.id, label: p.name }))]}
            />
            <Select
              value={platformFilter}
              onChange={setPlatformFilter}
              aria-label="Platform"
              options={[{ value: 'all', label: 'All platforms' }, ...platforms.advertising.map((p) => ({ value: p.id, label: p.name }))]}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

          <div className="card">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-text-primary">
              <Lightbulb className="h-4 w-4 text-brand-primary" /> AI learning insights
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {aiLearningInsights.map((item) => (
                <div key={item.insight} className="rounded-xl bg-brand-gradient-subtle p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-primary">{item.category}</p>
                  <p className="mt-1 text-sm text-text-primary">{item.insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-6 animate-fade-in">
          <AIRecommendation title="Product AI summary">
            Products with content scores above 90 show 28% higher ROAS. Focus budget on Classic Leather Wallet and Key Organizer while improving content for Minimalist Card Holder.
          </AIRecommendation>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Product', 'Content score', 'Channels', 'Status', 'AI suggestion', 'Insight'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {productSuggestions.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={resolveImage(row.image)} alt="" className="h-9 w-9 rounded-lg object-cover" />
                        <span className="font-medium text-text-primary">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('font-semibold', row.contentScore >= 85 ? 'text-emerald-600' : row.contentScore >= 70 ? 'text-amber-600' : 'text-red-500')}>
                        {row.contentScore}/100
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex -space-x-1">
                        {row.channels.slice(0, 4).map((ch) => <PlatformIcon key={ch} platformId={ch} size="sm" />)}
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-md bg-brand-gradient-subtle px-2 py-1 text-xs font-semibold text-brand-primary">
                        <Sparkles className="h-3 w-3" /> {row.suggestion}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs text-xs text-text-muted">{row.insight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="space-y-6 animate-fade-in">
          <AIRecommendation title="Campaign AI summary">
            Summer Leather Collection and Retargeting campaigns are top performers. Consider pausing TikTok Viral Push and reallocating 15% budget to Google Shopping.
          </AIRecommendation>
          <div className="grid gap-4 sm:grid-cols-3">
            {campaignPerformance.slice(0, 3).map((item) => (
              <div key={item.name} className="card">
                <p className="text-xs text-text-muted">Top campaign</p>
                <p className="font-semibold text-text-primary">{item.name}</p>
                <p className="mt-2 text-lg font-bold text-brand-primary">{formatCurrency(item.revenue)}</p>
                <p className="text-xs text-text-muted">Spend {formatCurrency(item.spend)}</p>
              </div>
            ))}
          </div>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Campaign', 'Objective', 'ROAS', 'Spend', 'Revenue', 'Status', 'AI suggestion', 'Insight'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaignSuggestions.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-text-primary">{row.name}</td>
                    <td className="px-4 py-3 text-text-secondary">{row.objective}</td>
                    <td className="px-4 py-3 font-semibold">{row.roas > 0 ? `${row.roas}x` : '—'}</td>
                    <td className="px-4 py-3">{formatCurrency(row.spend)}</td>
                    <td className="px-4 py-3">{formatCurrency(row.revenue)}</td>
                    <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-md bg-brand-gradient-subtle px-2 py-1 text-xs font-semibold text-brand-primary">
                        <Megaphone className="h-3 w-3" /> {row.suggestion}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs text-xs text-text-muted">{row.insight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'creative' && (
        <div className="space-y-6 animate-fade-in">
          <AIRecommendation>{aiCreativeRecommendation.text}</AIRecommendation>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {creatives.map((c) => (
              <div key={c.id} className="card">
                <div className="relative">
                  <img src={resolveImage(c.preview)} alt={c.name} className="aspect-square w-full rounded-xl object-cover" />
                  <div className="absolute right-2 top-2"><StatusBadge status={c.badge} /></div>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium">{c.name}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                    <PlatformIcon platformId={c.platform} size="sm" />
                    {c.campaign}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-text-muted">Spend</span><p className="font-semibold">{formatCurrency(c.spend)}</p></div>
                    <div><span className="text-text-muted">CTR</span><p className="font-semibold">{c.ctr}%</p></div>
                    <div><span className="text-text-muted">CPA</span><p className="font-semibold">{formatCurrency(c.cpa)}</p></div>
                    <div><span className="text-text-muted">ROAS</span><p className="font-semibold">{c.roas}x</p></div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-text-muted">Score</span>
                    <span className="text-sm font-bold text-brand-primary">{c.score}/100</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'commerce' && (
        <div className="space-y-6 animate-fade-in">
          <AIRecommendation title="Commerce intelligence">
            Connect product margin, inventory, and ad spend to identify which SKUs to scale, maintain, or reduce spend on.
          </AIRecommendation>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Product', 'Revenue', 'Ad Spend', 'ROAS', 'Margin', 'Inventory', 'Returns', 'Profit', 'AI Recommendation'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {commerceIntelligence.map((row) => (
                  <tr key={row.product} className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium">{row.product}</td>
                    <td className="px-4 py-3">{formatCurrency(row.revenue)}</td>
                    <td className="px-4 py-3">{formatCurrency(row.adSpend)}</td>
                    <td className="px-4 py-3 font-semibold">{row.roas > 0 ? `${row.roas}x` : '—'}</td>
                    <td className="px-4 py-3">{row.margin}%</td>
                    <td className="px-4 py-3">{row.inventory}</td>
                    <td className="px-4 py-3">{row.returns}%</td>
                    <td className={cn('px-4 py-3 font-semibold', row.profit < 0 ? 'text-red-500' : 'text-emerald-600')}>
                      {formatCurrency(row.profit)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', recColors[row.recommendation])}>
                        <Package className="h-3 w-3" /> {row.recommendation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'ai-analyst' && (
        <div className="grid gap-6 lg:grid-cols-4 animate-fade-in">
          <div className="space-y-2">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Suggested questions</p>
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => askQuestion(q)}
                className="w-full rounded-xl border border-gray-200 p-3 text-left text-sm hover:border-brand-primary/30"
              >
                {q}
              </button>
            ))}
          </div>
          <div className="card flex min-h-[500px] flex-col lg:col-span-3">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-primary" />
              <h3 className="font-semibold text-text-primary">AI Market Analyst</h3>
            </div>
            <div className="mb-4 flex-1 space-y-4 overflow-y-auto">
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center text-text-muted">
                  <Sparkles className="mb-4 h-12 w-12 text-brand-primary/30" />
                  <p>Ask anything about products, campaigns, market trends, or budget allocation.</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  {msg.role === 'user' ? (
                    <div className="max-w-md rounded-2xl bg-brand-gradient px-4 py-3 text-sm text-white">{msg.content}</div>
                  ) : (
                    <div className="max-w-lg rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-sm text-text-secondary">{msg.content.explanation}</p>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {msg.content.metrics.map((m) => (
                          <div key={m.label} className="rounded-lg bg-white p-2 text-center">
                            <p className="text-xs text-text-muted">{m.label}</p>
                            <p className={cn('flex items-center justify-center gap-1 text-sm font-bold', m.trend === 'down' ? 'text-red-500' : m.trend === 'up' ? 'text-emerald-500' : '')}>
                              {m.trend === 'down' ? <TrendingDown className="h-3 w-3" /> : m.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : null}
                              {m.value}
                            </p>
                          </div>
                        ))}
                      </div>
                      <ul className="mt-3 space-y-1">
                        {msg.content.recommendations.map((r) => (
                          <li key={r} className="text-xs text-text-muted">• {r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Sparkles className="h-4 w-4 animate-pulse text-brand-primary" /> Analyzing market data...
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && input && askQuestion(input)}
                placeholder="Ask about products, campaigns, or market trends..."
                className="input flex-1"
              />
              <button type="button" onClick={() => input && askQuestion(input)} disabled={loading} className="btn-gradient">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
