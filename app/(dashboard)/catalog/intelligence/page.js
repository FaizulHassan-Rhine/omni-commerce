'use client';

import PageHeader from '@/components/ui/PageHeader';
import AIRecommendation, { AIInsightCard } from '@/components/ui/AIRecommendation';
import { commerceIntelligence, aiLearningInsights } from '@/data/analytics';
import { ContentScore } from '@/components/ui/AIRecommendation';
import { products } from '@/data/products';
import { Brain, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CatalogIntelligencePage() {
  const avgScore = Math.round(products.reduce((a, p) => a + p.contentScore, 0) / products.length);

  return (
    <div className="page-container pb-20">
      <PageHeader title="Catalog Intelligence" subtitle="AI insights connecting catalog quality to performance." />

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="card text-center">
          <p className="text-sm text-gray-500">Avg Content Score</p>
          <div className="mt-2 flex justify-center"><ContentScore score={avgScore} /></div>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Products Above 90</p>
          <p className="text-3xl font-bold mt-2">{products.filter((p) => p.contentScore >= 90).length}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Need Improvement</p>
          <p className="text-3xl font-bold mt-2 text-amber-500">{products.filter((p) => p.contentScore < 80).length}</p>
        </div>
      </div>

      <AIRecommendation title="Catalog Performance Insight">
        Products with 90+ content score have 28% higher ROAS. Focus on improving images and SEO for {products.filter((p) => p.contentScore < 80).length} underperforming products.
      </AIRecommendation>

      <h3 className="mt-8 mb-4 font-semibold">AI Learning Insights</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {aiLearningInsights.map((item) => (
          <AIInsightCard key={item.insight} insight={item.insight} category={item.category} />
        ))}
      </div>

      <div className="mt-8 card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2"><Brain className="h-5 w-5 text-brand-primary" /> Closed Loop Optimization</h3>
          <Link href="/catalog/intelligence" className="text-sm text-brand-primary">Learn more</Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 py-6">
          {['Product', 'Content', 'Campaign', 'Channels', 'Performance', 'AI Learning', 'Improved Creative'].map((step, i, arr) => (
            <div key={step} className="flex items-center gap-2">
              <span className="rounded-full bg-brand-gradient-subtle px-3 py-1.5 text-xs font-medium text-brand-primary">{step}</span>
              {i < arr.length - 1 && <ArrowRight className="h-4 w-4 text-gray-300" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
