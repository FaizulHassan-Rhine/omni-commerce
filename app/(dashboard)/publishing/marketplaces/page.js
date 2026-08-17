'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import { products } from '@/data/products';
import { resolveImage } from '@/lib/images';
import { Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const marketplaces = [
  { id: 'amazon', name: 'Amazon', status: 'Ready' },
  { id: 'walmart', name: 'Walmart', status: 'Needs Review', issue: 'Missing GTIN' },
  { id: 'shopify', name: 'Shopify', status: 'Ready' },
  { id: 'daraz', name: 'Daraz', status: 'Ready' },
  { id: 'alibaba', name: 'Alibaba', status: 'Needs Review', issue: 'Content adaptation needed' },
  { id: 'woocommerce', name: 'WooCommerce', status: 'Ready' },
];

export default function MarketplacePublishingPage() {
  const { addToast } = useApp();
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [selectedMarkets, setSelectedMarkets] = useState(['amazon', 'shopify']);

  return (
    <div className="page-container pb-20">
      <PageHeader title="Marketplace Publishing" subtitle="Publish and adapt listings across marketplaces." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card">
          <h3 className="font-semibold mb-4">Select Product</h3>
          <div className="space-y-2">
            {products.map((p) => (
              <button key={p.id} onClick={() => setSelectedProduct(p)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left cursor-pointer ${selectedProduct.id === p.id ? 'border-brand-primary bg-brand-gradient-subtle' : 'border-gray-200 dark:border-gray-800'}`}>
                <img src={resolveImage(p.image)} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                <span className="text-sm font-medium">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="card lg:col-span-2">
          <h3 className="font-semibold mb-4">Marketplace Compatibility</h3>
          <div className="space-y-3">
            {marketplaces.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={selectedMarkets.includes(m.id)} onChange={() => setSelectedMarkets((prev) => prev.includes(m.id) ? prev.filter((x) => x !== m.id) : [...prev, m.id])} className="accent-brand-primary" />
                  <span className="font-medium">{m.name}</span>
                  {m.issue && <span className="text-xs text-amber-500">{m.issue}</span>}
                </div>
                <StatusBadge status={m.status} />
              </div>
            ))}
          </div>
          <button onClick={() => addToast('success', 'AI adapted listing content for selected marketplaces')} className="btn-gradient w-full mt-4">
            <Sparkles className="h-4 w-4" /> AI Adapt & Publish
          </button>
        </div>
      </div>
    </div>
  );
}
