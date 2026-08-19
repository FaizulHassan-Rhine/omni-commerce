'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import PlatformIcon from '@/components/ui/PlatformIcon';
import ProductTabs from '@/components/product/ProductTabs';
import { products } from '@/data/products';
import { resolveImage } from '@/lib/images';
import { formatDate, cn } from '@/lib/utils';
import { LayoutGrid, LayoutList, Search } from 'lucide-react';
import Select from '@/components/ui/Select';

const STATUS_FILTERS = ['All', 'Approved', 'Pending', 'Rejected', 'Draft'];

export default function CatalogPage() {
  const [view, setView] = useState('list');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [search, statusFilter]);

  return (
    <div className="page-container pb-20">
      <PageHeader
        title="Products"
        subtitle={`${products.length} products created on this platform.`}
      />
      <ProductTabs />

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input pl-10"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-gray-200 bg-white p-0.5">
            <button
              type="button"
              onClick={() => setView('list')}
              className={cn(
                'rounded-md p-2',
                view === 'list' ? 'bg-brand-gradient-subtle text-brand-primary' : 'text-gray-400 hover:text-gray-600'
              )}
              title="List view"
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setView('grid')}
              className={cn(
                'rounded-md p-2',
                view === 'grid' ? 'bg-brand-gradient-subtle text-brand-primary' : 'text-gray-400 hover:text-gray-600'
              )}
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            aria-label="Filter by status"
            className="min-w-[180px]"
            options={STATUS_FILTERS.map((status) => ({
              value: status,
              label: status === 'All' ? 'All statuses' : status,
            }))}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card py-16 text-center text-sm text-gray-500">No products match this filter.</div>
      ) : view === 'list' ? (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {['Product', 'Category', 'Channels', 'Created', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/catalog/products/${p.id}`} className="flex items-center gap-3">
                      <img src={resolveImage(p.image)} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      <span className="font-medium text-brand-primary">{p.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex -space-x-1">
                      {p.channels.map((ch) => <PlatformIcon key={ch} platformId={ch} size="sm" />)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.createdAt ? formatDate(p.createdAt) : '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <Link key={p.id} href={`/catalog/products/${p.id}`} className="card overflow-hidden transition-shadow hover:shadow-soft">
              <img src={resolveImage(p.image)} alt="" className="h-44 w-full object-cover" />
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  <StatusBadge status={p.status} />
                </div>
                <p className="text-sm text-gray-500">{p.category}</p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1">
                    {p.channels.map((ch) => <PlatformIcon key={ch} platformId={ch} size="sm" />)}
                  </div>
                  <span className="text-xs text-gray-400">{p.createdAt ? formatDate(p.createdAt) : ''}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
