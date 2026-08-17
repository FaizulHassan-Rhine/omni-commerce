'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import PlatformIcon from '@/components/ui/PlatformIcon';
import { campaigns } from '@/data/campaigns';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Search, Filter, Plus } from 'lucide-react';

export default function CampaignsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [objectiveFilter, setObjectiveFilter] = useState('All');

  const filtered = campaigns.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchObjective = objectiveFilter === 'All' || c.objective === objectiveFilter;
    return matchSearch && matchStatus && matchObjective;
  });

  const statuses = ['All', 'Active', 'Draft', 'Paused', 'Completed', 'Needs Review'];
  const objectives = ['All', ...new Set(campaigns.map((c) => c.objective))];

  return (
    <div className="page-container pb-20">
      <PageHeader
        title="All Campaigns"
        subtitle="Manage and monitor your advertising campaigns."
        actions={<Link href="/create/campaign" className="btn-gradient"><Plus className="h-4 w-4" /> Create Campaign</Link>}
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search campaigns..." className="input pl-10" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-auto">
          {statuses.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={objectiveFilter} onChange={(e) => setObjectiveFilter(e.target.value)} className="input w-auto">
          {objectives.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              {['Campaign', 'Status', 'Objective', 'Channels', 'Spend', 'Revenue', 'ROAS', 'Conversions', 'Start Date', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-500 dark:text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3">
                  <Link href={`/campaigns/${c.id}`} className="font-medium text-brand-primary hover:underline dark:text-indigo-400">{c.name}</Link>
                </td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 text-gray-600 dark:text-slate-400">{c.objective}</td>
                <td className="px-4 py-3">
                  <div className="flex -space-x-1">
                    {c.channels.slice(0, 3).map((ch) => <PlatformIcon key={ch} platformId={ch} size="sm" />)}
                  </div>
                </td>
                <td className="px-4 py-3">{formatCurrency(c.spend)}</td>
                <td className="px-4 py-3">{formatCurrency(c.revenue)}</td>
                <td className="px-4 py-3 font-semibold">{c.roas > 0 ? `${c.roas}x` : '—'}</td>
                <td className="px-4 py-3">{c.conversions.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-500">{formatDate(c.startDate)}</td>
                <td className="px-4 py-3">
                  <Link href={`/campaigns/${c.id}`} className="text-brand-primary text-xs dark:text-indigo-400">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
