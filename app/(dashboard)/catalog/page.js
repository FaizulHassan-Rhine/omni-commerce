'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import PlatformIcon from '@/components/ui/PlatformIcon';
import ProductTabs from '@/components/product/ProductTabs';
import ProductDetailDrawer from '@/components/product/ProductDetailDrawer';
import ApprovalRowActions, { ApproveAction, PublishAction } from '@/components/ui/ApprovalRowActions';
import { ContentScore } from '@/components/ui/AIRecommendation';
import { campaigns as seedCampaigns } from '@/data/campaigns';
import { resolveImage } from '@/lib/images';
import { formatDate, cn } from '@/lib/utils';
import { canApproveItem, canPublishItem, canStartProductCampaign, isItemPublished } from '@/lib/journey';
import { useApp } from '@/context/AppContext';
import { LayoutGrid, LayoutList, Search } from 'lucide-react';
import Select from '@/components/ui/Select';

const STATUS_FILTERS = ['All', 'Draft', 'Pending', 'Approved', 'Published', 'Rejected'];
const productsInCampaign = new Set(seedCampaigns.map((c) => c.productId));

function CampaignAction({ inCampaign, productId, approved }) {
  if (!approved) {
    return <span className="text-xs text-text-muted">Approve first</span>;
  }

  if (inCampaign) {
    return (
      <Link href="/campaigns" className="btn-secondary py-1.5 text-xs whitespace-nowrap">
        Already in campaign
      </Link>
    );
  }

  return (
    <Link href={`/campaigns/create?product=${productId}`} className="btn-gradient py-1.5 text-xs whitespace-nowrap">
      Start campaign
    </Link>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="page-container pb-20 text-sm text-gray-500">Loading products...</div>}>
      <CatalogPageContent />
    </Suspense>
  );
}

function CatalogPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { catalogProducts, workspaceCampaigns, updateProduct, addToast } = useApp();
  const [view, setView] = useState('list');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const campaignProductIds = useMemo(
    () => new Set([...productsInCampaign, ...workspaceCampaigns.map((c) => c.productId)]),
    [workspaceCampaigns]
  );

  useEffect(() => {
    const productId = searchParams.get('product');
    setSelectedProduct(productId ? catalogProducts.find((p) => p.id === productId) || null : null);
  }, [searchParams, catalogProducts]);

  const openProduct = useCallback((product) => {
    setSelectedProduct(product);
    router.replace(`/catalog?product=${product.id}`, { scroll: false });
  }, [router]);

  const closeProduct = useCallback(() => {
    setSelectedProduct(null);
    router.replace('/catalog', { scroll: false });
  }, [router]);

  const updateSelectedProduct = useCallback((patch) => {
    setSelectedProduct((current) => {
      if (!current) return current;
      updateProduct(current.id, patch);
      return { ...current, ...patch };
    });
  }, [updateProduct]);

  const decideProduct = (event, product, action) => {
    event.stopPropagation();
    if (action === 'Approved') {
      updateProduct(product.id, { status: 'Approved', published: false });
      addToast('success', `${product.name} approved. Publish it when you are ready.`);
      return;
    }
    updateProduct(product.id, { status: 'Approved', published: true });
    addToast('success', `${product.name} published.`);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return catalogProducts.filter((p) => {
      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Published' ? p.published === true : p.status === statusFilter);
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [search, statusFilter, catalogProducts]);

  return (
    <div className="page-container pb-20">
      <PageHeader
        title="Products"
        subtitle={`${catalogProducts.length} products created on this platform.`}
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
                {['Product', 'Category', 'Channels', 'Created', 'Health', 'Status', 'Publish', 'Campaign'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="cursor-pointer border-b border-gray-100 hover:bg-gray-50"
                  onClick={() => openProduct(p)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={resolveImage(p.image)} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      <span className="font-medium text-brand-primary">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex -space-x-1">
                      {p.channels.map((ch) => <PlatformIcon key={ch} platformId={ch} size="sm" />)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.createdAt ? formatDate(p.createdAt) : '—'}</td>
                  <td className="px-4 py-3"><ContentScore score={p.contentScore} /></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <StatusBadge status={p.status} />
                      <ApproveAction
                        enabled={canApproveItem(p.status)}
                        onApprove={(event) => decideProduct(event, p, 'Approved')}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                    <PublishAction
                      enabled={canPublishItem(p)}
                      published={isItemPublished(p)}
                      onPublish={(event) => decideProduct(event, p, 'Published')}
                    />
                  </td>
                  <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                    <CampaignAction
                      inCampaign={campaignProductIds.has(p.id)}
                      productId={p.id}
                      approved={canStartProductCampaign(p)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.id} className="card cursor-pointer overflow-hidden p-0" onClick={() => openProduct(p)}>
              <img src={resolveImage(p.image)} alt="" className="h-44 w-full object-cover" />
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 hover:text-brand-primary">{p.name}</h3>
                  <StatusBadge status={p.status} />
                </div>
                <p className="text-sm text-gray-500">{p.category}</p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1">
                    {p.channels.map((ch) => <PlatformIcon key={ch} platformId={ch} size="sm" />)}
                  </div>
                  <ContentScore score={p.contentScore} />
                </div>
                <div className="space-y-2" onClick={(event) => event.stopPropagation()}>
                  <ApproveAction
                    enabled={canApproveItem(p.status)}
                    onApprove={(event) => decideProduct(event, p, 'Approved')}
                  />
                  <ApprovalRowActions
                    canApprove={false}
                    canPublish={canPublishItem(p)}
                    published={isItemPublished(p)}
                    onPublish={(event) => decideProduct(event, p, 'Published')}
                  >
                    <CampaignAction
                      inCampaign={campaignProductIds.has(p.id)}
                      productId={p.id}
                      approved={canStartProductCampaign(p)}
                    />
                  </ApprovalRowActions>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ProductDetailDrawer product={selectedProduct} onClose={closeProduct} onUpdate={updateSelectedProduct} />
    </div>
  );
}
