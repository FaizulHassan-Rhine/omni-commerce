'use client';

import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import { ContentScore } from '@/components/ui/AIRecommendation';
import PlatformIcon from '@/components/ui/PlatformIcon';
import { products } from '@/data/products';
import { resolveImage } from '@/lib/images';
import { formatCurrency } from '@/lib/utils';
import { AlertTriangle, Plus } from 'lucide-react';

export default function CatalogPage() {
  return (
    <div className="page-container pb-20">
      <PageHeader
        title="Product Catalog"
        subtitle="1,284 products across all channels."
        actions={<Link href="/create/content" className="btn-gradient"><Plus className="h-4 w-4" /> Add Product</Link>}
      />

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Content Score', 'Channels', 'Status'].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3">
                  <Link href={`/catalog/products/${p.id}`} className="flex items-center gap-3">
                    <img src={resolveImage(p.image)} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                    <span className="font-medium text-brand-primary dark:text-indigo-400">{p.name}</span>
                    {p.contentScore < 80 && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-500">{p.sku}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">{formatCurrency(p.price)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3"><ContentScore score={p.contentScore} /></td>
                <td className="px-4 py-3">
                  <div className="flex -space-x-1">{p.channels.map((ch) => <PlatformIcon key={ch} platformId={ch} size="sm" />)}</div>
                </td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
