'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Tabs, { TabPanel } from '@/components/ui/Tabs';
import StatusBadge from '@/components/ui/StatusBadge';
import PlatformIcon from '@/components/ui/PlatformIcon';
import AIRecommendation, { ContentScore } from '@/components/ui/AIRecommendation';
import { getProduct } from '@/data/products';
import { resolveImage } from '@/lib/images';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'content', label: 'Content' },
  { id: 'media', label: 'Media' },
  { id: 'channels', label: 'Channels' },
  { id: 'seo', label: 'SEO' },
  { id: 'performance', label: 'Performance' },
  { id: 'history', label: 'History' },
];

export default function ProductDetailPage() {
  const params = useParams();
  const product = getProduct(params.id);
  const [activeTab, setActiveTab] = useState('overview');

  if (!product) {
    return (
      <div className="page-container py-20 text-center">
        <h2 className="text-xl font-bold">Product not found</h2>
        <Link href="/catalog" className="btn-primary mt-4 inline-flex">Back to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="page-container pb-20">
      <Link href="/catalog" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Catalog
      </Link>

      <div className="mb-6 flex flex-col gap-6 lg:flex-row">
        <img src={resolveImage(product.image)} alt={product.name} className="h-64 w-64 rounded-2xl object-cover" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <StatusBadge status={product.status} />
            <ContentScore score={product.contentScore} />
          </div>
          <p className="mt-2 text-gray-500">SKU: {product.sku} · {product.category}</p>
          <p className="mt-4 text-2xl font-bold">{formatCurrency(product.price)}</p>
          <p className="text-sm text-gray-500">Stock: {product.stock} units</p>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <TabPanel>
        {activeTab === 'overview' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card space-y-3">
              <h3 className="font-semibold">Product Information</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-gray-500">Material</dt><dd>{product.material}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Color</dt><dd>{product.color}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Tags</dt><dd>{product.tags.join(', ')}</dd></div>
              </dl>
            </div>
            <AIRecommendation>Add lifestyle images to improve content score from {product.contentScore} to 95+. Short headlines convert 17% better for this category.</AIRecommendation>
          </div>
        )}
        {activeTab === 'content' && (
          <div className="card space-y-4">
            <div><label className="label">Title</label><input defaultValue={product.name} className="input" /></div>
            <div><label className="label">Description</label><textarea defaultValue={product.description} rows={4} className="input resize-none" /></div>
            <div><label className="label">Short Description</label><input defaultValue={product.shortDescription} className="input" /></div>
          </div>
        )}
        {activeTab === 'channels' && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {product.channels.map((ch) => (
              <div key={ch} className="card flex items-center gap-3">
                <PlatformIcon platformId={ch} />
                <div><p className="font-medium capitalize">{ch}</p><StatusBadge status="Published" /></div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'seo' && (
          <div className="card space-y-4">
            <div><label className="label">SEO Title</label><input defaultValue={product.seoTitle} className="input" /></div>
            <div><label className="label">Meta Description</label><textarea defaultValue={product.seoMetaDescription} rows={2} className="input resize-none" /></div>
            <div><label className="label">Keywords</label><input defaultValue={product.keywords.join(', ')} className="input" /></div>
          </div>
        )}
        {!['overview', 'content', 'channels', 'seo'].includes(activeTab) && (
          <div className="card p-8 text-center text-gray-500">{activeTab} data for this product.</div>
        )}
      </TabPanel>
    </div>
  );
}
