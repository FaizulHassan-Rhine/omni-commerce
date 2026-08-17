'use client';

import PageHeader from '@/components/ui/PageHeader';
import { catalogSummary, catalogIssues } from '@/data/catalog-issues';
import StatusBadge from '@/components/ui/StatusBadge';
import { severityColors } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { Shield, Sparkles } from 'lucide-react';

export default function CatalogGuardianPage() {
  const { addToast } = useApp();

  return (
    <div className="page-container pb-20">
      <PageHeader title="Catalog Guardian" subtitle="AI-powered catalog quality analysis and fixes." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
        {[
          { label: 'Total Products', value: catalogSummary.totalProducts },
          { label: 'Need Attention', value: catalogSummary.needAttention, warn: true },
          { label: 'Missing Attributes', value: catalogSummary.missingAttributes },
          { label: 'Low-Quality Images', value: catalogSummary.lowQualityImages },
          { label: 'SEO Issues', value: catalogSummary.seoIssues },
          { label: 'Channel Issues', value: catalogSummary.channelIssues },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              {['Product', 'Issue', 'Severity', 'Suggested Fix', 'Action'].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {catalogIssues.map((issue) => (
              <tr key={issue.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="px-4 py-3 font-medium">{issue.product}</td>
                <td className="px-4 py-3">{issue.issue}</td>
                <td className={`px-4 py-3 font-medium ${severityColors[issue.severity]}`}>{issue.severity}</td>
                <td className="px-4 py-3 text-gray-500">{issue.suggestedFix}</td>
                <td className="px-4 py-3">
                  <button onClick={() => addToast('success', `AI fix applied for ${issue.product}`)} className="btn-secondary text-xs">
                    <Sparkles className="h-3 w-3" /> Apply AI Fix
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
