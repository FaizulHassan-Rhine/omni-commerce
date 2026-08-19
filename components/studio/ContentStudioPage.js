'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import PlatformIcon from '@/components/ui/PlatformIcon';
import Select from '@/components/ui/Select';
import PlatformPostReview from '@/components/ui/PlatformPostReview';
import CampaignAdReview from '@/components/ui/CampaignAdReview';
import ContentStudioTabs from '@/components/studio/ContentStudioTabs';
import StudioAIEditPanel from '@/components/studio/StudioAIEditPanel';
import { products } from '@/data/products';
import { campaigns } from '@/data/campaigns';
import { getProduct } from '@/data/products';
import { generateCampaignAds } from '@/lib/campaign-review';
import { generateCampaignContent, generatePlatformPosts } from '@/lib/mock-ai';
import { getReviewFields } from '@/lib/platform-review';
import { getCampaignReviewFields } from '@/lib/campaign-review';
import { applyAiRegeneration } from '@/lib/studio-ai';
import { resolveImage } from '@/lib/images';
import { formatDate, cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import {
  ArrowLeft,
  LayoutGrid,
  LayoutList,
  Pencil,
  Plus,
  Search,
  Sparkles,
  UserRound,
} from 'lucide-react';

const PRODUCT_STATUS = ['All', 'Approved', 'Pending', 'Rejected', 'Draft'];
const CAMPAIGN_STATUS = ['All', 'Active', 'Draft', 'Paused', 'Completed', 'Needs Review'];

function buildProductContent(product) {
  return {
    title: product.name,
    description: product.description,
    shortDescription: product.shortDescription,
    socialCaption: product.shortDescription,
    seoTitle: product.seoTitle,
    seoMetaDescription: product.seoMetaDescription,
    category: product.category,
    color: product.color,
    material: product.material,
    tags: product.tags,
    keywords: product.keywords,
    cta: 'Shop Now',
  };
}

function StudioActionButtons({ onEdit, onAiEdit, onRetouch, compact = false }) {
  const btnClass = compact ? 'btn-secondary flex-1 min-w-0 text-xs' : 'btn-secondary py-1.5 text-xs';
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={onEdit} className={btnClass}>
        <Pencil className="h-3.5 w-3.5 shrink-0" /> Edit
      </button>
      <button type="button" onClick={onAiEdit} className={btnClass}>
        <Sparkles className="h-3.5 w-3.5 shrink-0" /> Edit with AI
      </button>
      <button type="button" onClick={onRetouch} className={btnClass}>
        <UserRound className="h-3.5 w-3.5 shrink-0" /> Human retouch
      </button>
    </div>
  );
}

export default function ContentStudioPage() {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState('products');
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [retouchMap, setRetouchMap] = useState({});
  const [editMode, setEditMode] = useState('manual');

  const [editingProduct, setEditingProduct] = useState(null);
  const [productPosts, setProductPosts] = useState([]);
  const [activePostId, setActivePostId] = useState(null);

  const [editingCampaign, setEditingCampaign] = useState(null);
  const [campaignAds, setCampaignAds] = useState([]);
  const [activeCampaignAdId, setActiveCampaignAdId] = useState(null);

  const filteredProducts = useMemo(() => {
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

  const filteredCampaigns = useMemo(() => {
    const q = search.trim().toLowerCase();
    return campaigns.filter((c) => {
      const product = getProduct(c.productId);
      const matchStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.objective.toLowerCase().includes(q) ||
        product?.name.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [search, statusFilter]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearch('');
    setStatusFilter('All');
    setEditingProduct(null);
    setProductPosts([]);
    setActivePostId(null);
    setEditingCampaign(null);
    setCampaignAds([]);
  };

  const buildCampaignAds = (campaign) => {
    const product = getProduct(campaign.productId);
    const generated = generateCampaignContent({ objective: campaign.objective, productName: product?.name || campaign.name });
    const adPlatformIds = ['meta-ads', 'google-ads', 'tiktok-ads', 'microsoft-ads', 'linkedin-ads', 'amazon-ads', 'pinterest-ads', 'youtube-ads', 'x-ads'];
    const platformIds = campaign.channels.filter((id) => adPlatformIds.includes(id));
    const resolvedPlatforms = platformIds.length > 0 ? platformIds : ['meta-ads'];
    return generateCampaignAds({
      platformIds: resolvedPlatforms,
      campaign: generated,
      variant: generated.variants[0],
      sourceImage: product?.image,
    });
  };

  const openProductEditor = (product, mode = 'manual') => {
    setEditMode(mode);
    const posts = generatePlatformPosts({
      channels: product.channels,
      content: buildProductContent(product),
      creativeOptions: { contentTypes: { image: true, video: false } },
      sourceImage: resolveImage(product.image),
    });
    setEditingProduct(product);
    setProductPosts(posts);
    setActivePostId(posts[0]?.id || null);
    setEditingCampaign(null);
  };

  const openCampaignEditor = (campaign, mode = 'manual') => {
    setEditMode(mode);
    const ads = buildCampaignAds(campaign);
    setEditingCampaign(campaign);
    setCampaignAds(ads);
    setActiveCampaignAdId(ads[0]?.id || null);
    setEditingProduct(null);
  };

  const sendHumanRetouch = (type, id, label) => {
    setRetouchMap((prev) => ({ ...prev, [`${type}-${id}`]: 'in-retouch' }));
    addToast('success', `"${label}" sent to post-production for manual perfection.`);
  };

  const regenerateAllProductPosts = async (notes) => {
    await new Promise((r) => setTimeout(r, 900));
    setProductPosts((prev) =>
      prev.map((post) => applyAiRegeneration(post, getReviewFields(post.id), notes))
    );
    addToast('success', 'AI regenerated all platform variants.');
  };

  const regenerateAllCampaignAds = async (notes) => {
    await new Promise((r) => setTimeout(r, 900));
    setCampaignAds((prev) =>
      prev.map((ad) => applyAiRegeneration(ad, getCampaignReviewFields(ad.id), notes))
    );
    addToast('success', 'AI regenerated all ad platform variants.');
  };

  const updateProductPost = (id, patch) => {
    setProductPosts((prev) => prev.map((post) => (post.id === id ? { ...post, ...patch } : post)));
  };

  const updateCampaignAd = (adId, patch) => {
    setCampaignAds((prev) => prev.map((ad) => (ad.id === adId ? { ...ad, ...patch } : ad)));
  };

  const isInRetouch = (type, id) => retouchMap[`${type}-${id}`] === 'in-retouch';

  const activeProductPost = productPosts.find((post) => post.id === activePostId) || productPosts[0];
  const activeCampaignAd = campaignAds.find((ad) => ad.id === activeCampaignAdId) || campaignAds[0];

  if (editingProduct && productPosts.length > 0) {
    return (
      <div className="page-container pb-20 lg:pb-6 animate-fade-in">
        <button type="button" onClick={() => setEditingProduct(null)} className="btn-secondary mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to products
        </button>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">{editingProduct.name}</h2>
            <p className="text-sm text-text-secondary">
              {editMode === 'ai'
                ? 'Use AI to regenerate and optimize copy per platform with native previews.'
                : 'Review and fine-tune content per platform — same layout as product review.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isInRetouch('product', editingProduct.id) && (
              <span className="rounded-md bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">In human retouch</span>
            )}
            {editMode === 'manual' ? (
              <button type="button" onClick={() => setEditMode('ai')} className="btn-secondary">
                <Sparkles className="h-4 w-4" /> Switch to AI edit
              </button>
            ) : (
              <button type="button" onClick={() => setEditMode('manual')} className="btn-secondary">
                <Pencil className="h-4 w-4" /> Switch to manual edit
              </button>
            )}
            <button
              type="button"
              onClick={() => sendHumanRetouch('product', editingProduct.id, editingProduct.name)}
              className="btn-secondary"
            >
              <UserRound className="h-4 w-4" /> Human retouch
            </button>
            <button type="button" onClick={() => addToast('success', 'Product creative saved.')} className="btn-gradient">
              Save changes
            </button>
          </div>
        </div>

        <PlatformPostReview
          posts={productPosts}
          activeId={activePostId}
          onSelect={setActivePostId}
          onChange={updateProductPost}
          showImageTools={editMode === 'manual'}
          showLaunchActions={false}
          showBulkLaunchActions={false}
          sidePanel={
            editMode === 'ai' && activeProductPost ? (
              <StudioAIEditPanel
                post={activeProductPost}
                fields={getReviewFields(activeProductPost.id)}
                onChange={(patch) => updateProductPost(activeProductPost.id, patch)}
                onToast={addToast}
                onRegenerateAll={regenerateAllProductPosts}
              />
            ) : null
          }
        />
      </div>
    );
  }

  if (editingCampaign && campaignAds.length > 0) {
    return (
      <div className="page-container pb-20 lg:pb-6 animate-fade-in">
        <button type="button" onClick={() => setEditingCampaign(null)} className="btn-secondary mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to campaigns
        </button>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">{editingCampaign.name}</h2>
            <p className="text-sm text-text-secondary">
              {editMode === 'ai'
                ? 'Use AI to regenerate and optimize ad copy per platform.'
                : 'Review campaign ads per platform with native preview and edit tools.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isInRetouch('campaign', editingCampaign.id) && (
              <span className="rounded-md bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">In human retouch</span>
            )}
            {editMode === 'manual' ? (
              <button type="button" onClick={() => setEditMode('ai')} className="btn-secondary">
                <Sparkles className="h-4 w-4" /> Switch to AI edit
              </button>
            ) : (
              <button type="button" onClick={() => setEditMode('manual')} className="btn-secondary">
                <Pencil className="h-4 w-4" /> Switch to manual edit
              </button>
            )}
            <button
              type="button"
              onClick={() => sendHumanRetouch('campaign', editingCampaign.id, editingCampaign.name)}
              className="btn-secondary"
            >
              <UserRound className="h-4 w-4" /> Human retouch
            </button>
            <button type="button" onClick={() => addToast('success', 'Campaign creative saved.')} className="btn-gradient">
              Save changes
            </button>
          </div>
        </div>

        <CampaignAdReview
          ads={campaignAds}
          activeId={activeCampaignAdId}
          onSelect={setActiveCampaignAdId}
          onChange={updateCampaignAd}
          showImageTools={editMode === 'manual'}
          sidePanel={
            editMode === 'ai' && activeCampaignAd ? (
              <StudioAIEditPanel
                post={activeCampaignAd}
                fields={getCampaignReviewFields(activeCampaignAd.id)}
                onChange={(patch) => updateCampaignAd(activeCampaignAd.id, patch)}
                onToast={addToast}
                onRegenerateAll={regenerateAllCampaignAds}
              />
            ) : null
          }
        />
      </div>
    );
  }

  const items = activeTab === 'products' ? filteredProducts : filteredCampaigns;
  const statusOptions = activeTab === 'products' ? PRODUCT_STATUS : CAMPAIGN_STATUS;

  return (
    <div className="page-container pb-20 lg:pb-6">
      <PageHeader
        title="Content Studio"
        subtitle="Manage all product and campaign creatives. Edit manually, with AI tools, or send for human retouch."
        actions={
          activeTab === 'products' ? (
            <Link href="/catalog/create" className="btn-gradient">
              <Plus className="h-4 w-4" /> Create product
            </Link>
          ) : (
            <Link href="/campaigns/create" className="btn-gradient">
              <Plus className="h-4 w-4" /> Create campaign
            </Link>
          )
        }
      />

      <ContentStudioTabs activeTab={activeTab} onChange={handleTabChange} />

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={activeTab === 'products' ? 'Search products...' : 'Search campaigns...'}
            className="input pl-10"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-gray-200 bg-white p-0.5">
            <button
              type="button"
              onClick={() => setView('list')}
              className={cn('rounded-md p-2', view === 'list' ? 'bg-brand-gradient-subtle text-brand-primary' : 'text-gray-400 hover:text-gray-600')}
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setView('grid')}
              className={cn('rounded-md p-2', view === 'grid' ? 'bg-brand-gradient-subtle text-brand-primary' : 'text-gray-400 hover:text-gray-600')}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            aria-label="Filter by status"
            className="min-w-[180px]"
            options={statusOptions.map((status) => ({
              value: status,
              label: status === 'All' ? 'All statuses' : status,
            }))}
          />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="card py-16 text-center text-sm text-gray-500">No items match this filter.</div>
      ) : view === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {activeTab === 'products'
            ? filteredProducts.map((product) => (
                <div key={product.id} className="card overflow-hidden p-0">
                  <img src={resolveImage(product.image)} alt={product.name} className="aspect-[4/3] w-full object-cover" />
                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-text-primary">{product.name}</p>
                        <p className="text-xs text-text-muted">{product.category}</p>
                      </div>
                      <StatusBadge status={isInRetouch('product', product.id) ? 'Pending' : product.status} />
                    </div>
                    <div className="flex -space-x-1">
                      {product.channels.map((ch) => (
                        <PlatformIcon key={ch} platformId={ch} size="sm" />
                      ))}
                    </div>
                    <StudioActionButtons
                      onEdit={() => openProductEditor(product, 'manual')}
                      onAiEdit={() => openProductEditor(product, 'ai')}
                      onRetouch={() => sendHumanRetouch('product', product.id, product.name)}
                      compact
                    />
                  </div>
                </div>
              ))
            : filteredCampaigns.map((campaign) => {
                const product = getProduct(campaign.productId);
                return (
                  <div key={campaign.id} className="card overflow-hidden p-0">
                    <img src={resolveImage(product?.image)} alt={campaign.name} className="aspect-[4/3] w-full object-cover" />
                    <div className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-text-primary">{campaign.name}</p>
                          <p className="text-xs text-text-muted">{campaign.objective}</p>
                        </div>
                        <StatusBadge status={isInRetouch('campaign', campaign.id) ? 'Awaiting Review' : campaign.status} />
                      </div>
                      <div className="flex -space-x-1">
                        {campaign.channels.map((ch) => (
                          <PlatformIcon key={ch} platformId={ch} size="sm" />
                        ))}
                      </div>
                      <StudioActionButtons
                        onEdit={() => openCampaignEditor(campaign, 'manual')}
                        onAiEdit={() => openCampaignEditor(campaign, 'ai')}
                        onRetouch={() => sendHumanRetouch('campaign', campaign.id, campaign.name)}
                        compact
                      />
                    </div>
                  </div>
                );
              })}
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {(activeTab === 'products'
                  ? ['Product', 'Category', 'Channels', 'Created', 'Status', 'Actions']
                  : ['Campaign', 'Objective', 'Channels', 'Start', 'Status', 'Actions']
                ).map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeTab === 'products'
                ? filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={resolveImage(product.image)} alt="" className="h-10 w-10 rounded-lg object-cover" />
                          <span className="font-medium text-text-primary">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{product.category}</td>
                      <td className="px-4 py-3">
                        <div className="flex -space-x-1">
                          {product.channels.map((ch) => (
                            <PlatformIcon key={ch} platformId={ch} size="sm" />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{formatDate(product.createdAt)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={isInRetouch('product', product.id) ? 'Pending' : product.status} />
                      </td>
                      <td className="px-4 py-3">
                        <StudioActionButtons
                          onEdit={() => openProductEditor(product, 'manual')}
                          onAiEdit={() => openProductEditor(product, 'ai')}
                          onRetouch={() => sendHumanRetouch('product', product.id, product.name)}
                        />
                      </td>
                    </tr>
                  ))
                : filteredCampaigns.map((campaign) => {
                    const product = getProduct(campaign.productId);
                    return (
                      <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={resolveImage(product?.image)} alt="" className="h-10 w-10 rounded-lg object-cover" />
                            <span className="font-medium text-text-primary">{campaign.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{campaign.objective}</td>
                        <td className="px-4 py-3">
                          <div className="flex -space-x-1">
                            {campaign.channels.map((ch) => (
                              <PlatformIcon key={ch} platformId={ch} size="sm" />
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{formatDate(campaign.startDate)}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={isInRetouch('campaign', campaign.id) ? 'Awaiting Review' : campaign.status} />
                        </td>
                        <td className="px-4 py-3">
                          <StudioActionButtons
                            onEdit={() => openCampaignEditor(campaign, 'manual')}
                            onAiEdit={() => openCampaignEditor(campaign, 'ai')}
                            onRetouch={() => sendHumanRetouch('campaign', campaign.id, campaign.name)}
                          />
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
