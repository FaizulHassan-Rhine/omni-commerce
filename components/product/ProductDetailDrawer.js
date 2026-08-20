'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/ui/StatusBadge';
import PlatformIcon from '@/components/ui/PlatformIcon';
import AIRecommendation from '@/components/ui/AIRecommendation';
import { getPlatform } from '@/data/platforms';
import { commerceIntelligence } from '@/data/analytics';
import { catalogIssues } from '@/data/catalog-issues';
import { brandKit } from '@/data/brand';
import { resolveImage } from '@/lib/images';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { canApproveItem, canPublishItem, canStartProductCampaign, isItemPublished } from '@/lib/journey';
import { BarChart3, Check, Clock, Globe, Megaphone, Search, Tag, X } from 'lucide-react';

function healthColor(score) {
  if (score >= 90) return 'text-emerald-600 bg-emerald-50';
  if (score >= 75) return 'text-amber-600 bg-amber-50';
  return 'text-red-500 bg-red-50';
}

function marketplaceStatus(product) {
  if (product.published) return 'Published';
  if (product.status === 'Approved') return 'Ready';
  if (product.status === 'Pending') return 'Needs Review';
  if (product.status === 'Rejected') return 'Rejected';
  return 'Draft';
}

function FooterState({ label, icon: Icon, tone = 'success' }) {
  const tones = {
    success: 'bg-emerald-700 text-white',
    published: 'bg-brand-primary text-white',
    rejected: 'bg-red-700 text-white',
  };
  return (
    <div className={cn('flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium', tones[tone])}>
      <Icon className="h-4 w-4" />
      {label}
    </div>
  );
}

function MetricTile({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-100 px-3 py-3 dark:bg-surface-dark-secondary">
      <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-text-primary">{value}</p>
    </div>
  );
}

function AttributeTile({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-200/70 bg-white p-3 dark:bg-surface-dark">
      <p className="text-[11px] text-text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-text-primary">{value}</p>
    </div>
  );
}

function SectionLabel({ icon: Icon, children }) {
  return (
    <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      {children}
    </p>
  );
}

export default function ProductDetailDrawer({ product, onClose, onUpdate }) {
  const { addToast } = useApp();

  useEffect(() => {
    if (!product) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [product, onClose]);

  if (!product) return null;

  const published = isItemPublished(product);
  const canApprove = canApproveItem(product.status);
  const canPublish = canPublishItem(product);

  const handleApprove = () => {
    onUpdate?.({ status: 'Approved', published: false });
    addToast('success', `${product.name} approved. Publish it when you are ready.`);
  };

  const handlePublish = () => {
    if (!canPublish) {
      addToast('error', 'Approve this product before publishing.');
      return;
    }
    onUpdate?.({ status: 'Approved', published: true });
    addToast('success', `${product.name} published.`);
  };

  const intel = commerceIntelligence.find((row) => row.product === product.name);
  const issues = catalogIssues.filter((issue) => issue.productId === product.id);
  const attributes = [
    { label: 'Color', value: product.color },
    { label: 'Material', value: product.material },
    { label: 'SKU', value: product.sku },
    { label: 'Tags', value: product.tags?.join(', ') },
  ].filter((item) => item.value);

  const history = [
    { date: product.createdAt, title: 'Product created', detail: `${product.name} added to catalog.` },
    product.status === 'Draft'
      ? { date: product.createdAt, title: 'Saved as draft', detail: 'Listing is not published yet.' }
      : { date: product.createdAt, title: `Marked ${product.status.toLowerCase()}`, detail: `Current listing status is ${product.status}.` },
    intel
      ? { date: product.createdAt, title: 'Performance synced', detail: `Latest ROAS ${intel.roas}x across connected channels.` }
      : null,
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 lg:left-56 lg:top-16">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close product details"
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-gray-200/80 bg-bg-light shadow-2xl animate-slide-in-right">
        <div className="flex items-start justify-between gap-3 border-b border-gray-200/80 bg-white px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{product.sku}</p>
            <h2 className="mt-1 text-xl font-semibold text-text-primary">{product.name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={product.status} />
              {published ? <StatusBadge status="Published" /> : null}
              <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', healthColor(product.contentScore))}>
                {product.contentScore}% health
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted hover:bg-gray-100 hover:text-text-primary"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <img
            src={resolveImage(product.image)}
            alt={product.name}
            className="aspect-square w-full rounded-xl object-cover"
          />

          <div className="grid grid-cols-2 gap-3">
            <MetricTile label="Price" value={formatCurrency(product.price)} />
            <MetricTile label="Inventory" value={product.stock} />
            <MetricTile label="Category" value={product.category} />
            <MetricTile label="Brand" value={brandKit.brandName} />
          </div>

          <div>
            <SectionLabel>Description</SectionLabel>
            <p className="text-sm leading-relaxed text-text-secondary">{product.description}</p>
            {product.shortDescription && (
              <p className="mt-2 text-sm text-text-muted">{product.shortDescription}</p>
            )}
          </div>

          <div>
            <SectionLabel icon={Tag}>Attributes</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {attributes.map((attr) => (
                <AttributeTile key={attr.label} label={attr.label} value={attr.value} />
              ))}
            </div>
          </div>

          <AIRecommendation>
            Add lifestyle images to improve content score from {product.contentScore} to 95+. Short headlines convert 17% better for this category.
          </AIRecommendation>

          <div>
            <SectionLabel icon={Globe}>Marketplaces</SectionLabel>
            <div className="space-y-2">
              {product.channels.map((id) => (
                <div key={id} className="flex items-center justify-between rounded-xl border border-gray-200/70 bg-white px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <PlatformIcon platformId={id} size="sm" />
                    <span className="text-sm font-medium text-text-primary">{getPlatform(id).name}</span>
                  </div>
                  <StatusBadge status={marketplaceStatus({ ...product, published })} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel icon={Search}>SEO</SectionLabel>
            <div className="space-y-2 rounded-xl border border-gray-200/70 bg-white p-3">
              <div>
                <p className="text-[11px] text-text-muted">SEO title</p>
                <p className="mt-0.5 text-sm font-medium text-text-primary">{product.seoTitle}</p>
              </div>
              <div>
                <p className="text-[11px] text-text-muted">Meta description</p>
                <p className="mt-0.5 text-sm text-text-secondary">{product.seoMetaDescription}</p>
              </div>
              <div>
                <p className="text-[11px] text-text-muted">Keywords</p>
                <p className="mt-0.5 text-sm text-text-secondary">{product.keywords.join(', ')}</p>
              </div>
            </div>
          </div>

          <div>
            <SectionLabel icon={BarChart3}>Performance</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <MetricTile label="Revenue" value={intel ? formatCurrency(intel.revenue) : '—'} />
              <MetricTile label="Ad spend" value={intel ? formatCurrency(intel.adSpend) : '—'} />
              <MetricTile label="ROAS" value={intel ? `${intel.roas}x` : '—'} />
              <MetricTile label="Margin" value={intel ? `${intel.margin}%` : '—'} />
              <MetricTile label="Returns" value={intel ? `${intel.returns}%` : '—'} />
              <MetricTile label="Profit" value={intel ? formatCurrency(intel.profit) : '—'} />
            </div>
            {intel && (
              <div className="mt-3">
                <AIRecommendation title="Performance insight">
                  Recommendation: {intel.recommendation}. Inventory is currently {intel.inventory} units.
                </AIRecommendation>
              </div>
            )}
          </div>

          <div>
            <SectionLabel icon={Clock}>History</SectionLabel>
            <div className="space-y-2">
              {history.map((event, index) => (
                <div key={`${event.title}-${index}`} className="rounded-xl border border-gray-200/70 bg-white p-3">
                  <p className="text-sm font-medium text-text-primary">{event.title}</p>
                  <p className="mt-0.5 text-sm text-text-secondary">{event.detail}</p>
                  <p className="mt-1 text-[11px] text-text-muted">{formatDate(event.date)}</p>
                </div>
              ))}
              {issues.map((issue) => (
                <div key={issue.id} className="rounded-xl border border-gray-200/70 bg-white p-3">
                  <p className="text-sm font-medium text-text-primary">{issue.issue}</p>
                  <p className="mt-0.5 text-sm text-text-secondary">Suggested: {issue.suggestedFix}</p>
                  <p className="mt-1 text-[11px] text-text-muted">{issue.category} · {issue.severity}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-gray-200/80 bg-white px-5 py-3">
          {product.status === 'Rejected' ? (
            <FooterState label="Rejected" icon={X} tone="rejected" />
          ) : (
            <>
              {canApprove ? (
                <button type="button" onClick={handleApprove} className="btn-gradient flex-1 text-sm">
                  <Check className="h-4 w-4" /> Approve
                </button>
              ) : (
                <FooterState label="Approved" icon={Check} />
              )}
              {published ? (
                <FooterState label="Published" icon={Globe} tone="published" />
              ) : (
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={!canPublish}
                  title={canPublish ? 'Publish to channels' : 'Approve first'}
                  className="btn-publish flex-1 text-sm"
                >
                  <Globe className="h-4 w-4" /> Publish
                </button>
              )}
            </>
          )}
          {canStartProductCampaign(product) ? (
            <Link
              href={`/campaigns/create?product=${product.id}`}
              className="btn-secondary flex-1 text-sm"
            >
              <Megaphone className="h-4 w-4" /> Start campaign
            </Link>
          ) : (
            <span className="btn-secondary flex-1 cursor-not-allowed text-sm opacity-50" title="Approve first">
              <Megaphone className="h-4 w-4" /> Start campaign
            </span>
          )}
        </div>
      </aside>
    </div>
  );
}
