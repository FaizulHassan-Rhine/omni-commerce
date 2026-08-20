'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import PlatformIcon from '@/components/ui/PlatformIcon';
import CampaignTabs from '@/components/campaign/CampaignTabs';
import { ApproveAction, PublishAction } from '@/components/ui/ApprovalRowActions';
import { resolveImage } from '@/lib/images';
import { formatDate, cn, getCampaignHealth } from '@/lib/utils';
import { ContentScore } from '@/components/ui/AIRecommendation';
import { useApp } from '@/context/AppContext';
import { canApproveItem, canPublishItem, isItemPublished } from '@/lib/journey';
import { LayoutGrid, LayoutList, Search } from 'lucide-react';
import Select from '@/components/ui/Select';

const STATUS_FILTERS = ['All', 'Draft', 'Needs Review', 'Approved', 'Published', 'Active', 'Paused', 'Completed', 'Rejected'];

export default function CampaignsPage() {
  const { workspaceCampaigns, catalogProducts, updateCampaign, addToast } = useApp();
  const [view, setView] = useState('list');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const productById = useMemo(
    () => Object.fromEntries(catalogProducts.map((p) => [p.id, p])),
    [catalogProducts]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return workspaceCampaigns.filter((c) => {
      const product = productById[c.productId];
      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Published' ? isItemPublished(c) : c.status === statusFilter);
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.objective.toLowerCase().includes(q) ||
        product?.name.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [search, statusFilter, workspaceCampaigns, productById]);

  const decideCampaign = (event, campaign, action) => {
    event.preventDefault();
    event.stopPropagation();
    if (action === 'Approved') {
      updateCampaign(campaign.id, { status: 'Approved', published: false });
      addToast('success', `${campaign.name} approved. Publish it when you are ready to go live.`);
      return;
    }
    updateCampaign(campaign.id, { status: 'Active', published: true });
    addToast('success', `${campaign.name} published.`);
  };

  return (
    <div className="page-container pb-20">
      <PageHeader
        title="Campaigns"
        subtitle={`${workspaceCampaigns.length} campaigns created on this platform.`}
      />
      <CampaignTabs />

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
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
        <div className="card py-16 text-center text-sm text-gray-500">No campaigns match this filter.</div>
      ) : view === 'list' ? (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {['Campaign', 'Objective', 'Channels', 'Created', 'Health', 'Status', 'Publish'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const product = productById[c.productId];
                const health = getCampaignHealth(c);
                return (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link href={`/campaigns/${c.id}`} className="flex items-center gap-3">
                        <img
                          src={resolveImage(product?.image)}
                          alt=""
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <span className="font-medium text-brand-primary">{c.name}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.objective}</td>
                    <td className="px-4 py-3">
                      <div className="flex -space-x-1">
                        {c.channels.map((ch) => <PlatformIcon key={ch} platformId={ch} size="sm" />)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(c.startDate)}</td>
                    <td className="px-4 py-3">
                      {health != null ? <ContentScore score={health} /> : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <StatusBadge status={c.status} />
                        <ApproveAction
                          enabled={canApproveItem(c.status)}
                          onApprove={(event) => decideCampaign(event, c, 'Approved')}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <PublishAction
                        enabled={canPublishItem(c)}
                        published={isItemPublished(c)}
                        onPublish={(event) => decideCampaign(event, c, 'Published')}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => {
            const product = productById[c.productId];
            const health = getCampaignHealth(c);
            return (
              <Link key={c.id} href={`/campaigns/${c.id}`} className="card overflow-hidden transition-shadow hover:shadow-soft">
                <img src={resolveImage(product?.image)} alt="" className="h-44 w-full object-cover" />
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900">{c.name}</h3>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-sm text-gray-500">{c.objective}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-1">
                      {c.channels.map((ch) => <PlatformIcon key={ch} platformId={ch} size="sm" />)}
                    </div>
                    {health != null ? <ContentScore score={health} /> : <span className="text-xs text-gray-400">—</span>}
                  </div>
                  <div onClick={(event) => event.preventDefault()}>
                    <ApproveAction
                      enabled={canApproveItem(c.status)}
                      onApprove={(event) => decideCampaign(event, c, 'Approved')}
                    />
                    <div className="mt-2">
                      <PublishAction
                        enabled={canPublishItem(c)}
                        published={isItemPublished(c)}
                        onPublish={(event) => decideCampaign(event, c, 'Published')}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
