'use client';

import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import { commerceIntelligence } from '@/data/analytics';
import { formatCurrency } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

const recColors = {
  Scale: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Maintain: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Reduce Spend': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Restock: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Stop Campaign': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function CommerceIntelligencePage() {
  return (
    <div className="page-container pb-20">
      <PageHeader title="Commerce Intelligence" subtitle="Connect product data with advertising performance." />

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              {['Product', 'Revenue', 'Ad Spend', 'ROAS', 'Margin', 'Inventory', 'Returns', 'Profit', 'AI Recommendation'].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {commerceIntelligence.map((row) => (
              <tr key={row.product} className="border-b border-gray-100 dark:border-gray-800">
                <td className="px-4 py-3 font-medium">{row.product}</td>
                <td className="px-4 py-3">{formatCurrency(row.revenue)}</td>
                <td className="px-4 py-3">{formatCurrency(row.adSpend)}</td>
                <td className="px-4 py-3 font-semibold">{row.roas > 0 ? `${row.roas}x` : '—'}</td>
                <td className="px-4 py-3">{row.margin}%</td>
                <td className="px-4 py-3">{row.inventory}</td>
                <td className="px-4 py-3">{row.returns}%</td>
                <td className={`px-4 py-3 font-semibold ${row.profit < 0 ? 'text-red-500' : 'text-emerald-600'}`}>{formatCurrency(row.profit)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${recColors[row.recommendation]}`}>
                    <Sparkles className="h-3 w-3" /> {row.recommendation}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
