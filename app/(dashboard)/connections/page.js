'use client';

import { useMemo, useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import PlatformIcon from '@/components/ui/PlatformIcon';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import IntegrationTabs from '@/components/integration/IntegrationTabs';
import IntegrationSettingsPanel from '@/components/integration/IntegrationSettingsPanel';
import { platforms } from '@/data/platforms';
import { useApp } from '@/context/AppContext';
import {
  defaultIntegrationSettings,
  integrationPermissions,
} from '@/lib/integration-settings';
import { formatRelativeTime, cn } from '@/lib/utils';
import { Plug, RefreshCw, Search, Settings, Unplug } from 'lucide-react';

const categories = [
  { key: 'social', label: 'Social Media', items: platforms.social },
  { key: 'advertising', label: 'Advertising', items: platforms.advertising },
  { key: 'commerce', label: 'Commerce', items: platforms.commerce },
];

export default function ConnectionsPage() {
  const { connections, connectPlatform, disconnectPlatform, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('social');
  const [search, setSearch] = useState('');
  const [connectModal, setConnectModal] = useState(null);
  const [settingsModal, setSettingsModal] = useState(null);
  const [selectedPerms, setSelectedPerms] = useState([]);
  const [settingsMap, setSettingsMap] = useState({});

  const getConnection = (platformId) => connections.find((c) => c.platformId === platformId);

  const tabCounts = useMemo(() => {
    const counts = {};
    categories.forEach((cat) => {
      const connected = cat.items.filter((p) => getConnection(p.id)?.connected).length;
      counts[cat.key] = { connected, total: cat.items.length };
    });
    return counts;
  }, [connections]);

  const activeCategory = categories.find((cat) => cat.key === activeTab);
  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (activeCategory?.items || []).filter((platform) =>
      !q || platform.name.toLowerCase().includes(q)
    );
  }, [activeCategory, search]);

  const handleConnect = () => {
    if (!connectModal) return;
    connectPlatform(connectModal.id, `@${connectModal.name.replace(/\s/g, '')}`);
    setSettingsMap((prev) => ({
      ...prev,
      [connectModal.id]: defaultIntegrationSettings(connectModal.category),
    }));
    setConnectModal(null);
    setSelectedPerms([]);
  };

  const openSettings = (platform) => {
    const conn = getConnection(platform.id);
    if (!conn?.connected) return;
    setSettingsMap((prev) => ({
      ...prev,
      [platform.id]: prev[platform.id] || defaultIntegrationSettings(platform.category),
    }));
    setSettingsModal({ ...platform, account: conn.account, lastSync: conn.lastSync });
  };

  const saveSettings = () => {
    addToast('success', `${settingsModal?.name} settings saved.`);
    setSettingsModal(null);
  };

  const syncNow = (platformName) => {
    addToast('success', `${platformName} sync started.`);
  };

  return (
    <div className="page-container pb-20">
      <PageHeader
        title="Integrations"
        subtitle="Connect and configure social, advertising, and commerce platforms."
      />

      <IntegrationTabs activeTab={activeTab} onChange={setActiveTab} counts={tabCounts} />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Connected', value: tabCounts[activeTab]?.connected || 0 },
          { label: 'Available', value: tabCounts[activeTab]?.total || 0 },
          { label: 'Needs setup', value: (tabCounts[activeTab]?.total || 0) - (tabCounts[activeTab]?.connected || 0) },
        ].map((stat) => (
          <div key={stat.label} className="card py-4 text-center">
            <p className="text-xs text-text-muted">{stat.label}</p>
            <p className="text-2xl font-bold text-brand-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${activeCategory?.label.toLowerCase()}...`}
          className="input pl-10"
        />
      </div>

      {filteredItems.length === 0 ? (
        <div className="card py-16 text-center text-sm text-text-muted">No integrations match your search.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((platform) => {
            const conn = getConnection(platform.id);
            const isConnected = conn?.connected;

            return (
              <div key={platform.id} className="card">
                <div className="flex items-start gap-4">
                  <PlatformIcon platformId={platform.id} size="lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-text-primary">{platform.name}</h3>
                      <StatusBadge status={isConnected ? 'Connected' : 'Disconnected'} />
                    </div>
                    <p className="mt-1 text-xs text-text-muted">
                      {isConnected
                        ? 'Connected and ready to sync.'
                        : `Connect ${platform.name} to publish and sync data.`}
                    </p>
                    {isConnected && (
                      <div className="mt-2 space-y-0.5 text-xs text-text-muted">
                        <p>Account: {conn.account}</p>
                        <p>Last sync: {formatRelativeTime(conn.lastSync)}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {isConnected ? (
                    <>
                      <button type="button" onClick={() => openSettings(platform)} className="btn-secondary flex-1 text-xs">
                        <Settings className="h-3.5 w-3.5" /> Settings
                      </button>
                      <button type="button" onClick={() => syncNow(platform.name)} className="btn-secondary text-xs">
                        <RefreshCw className="h-3.5 w-3.5" /> Sync
                      </button>
                      <button
                        type="button"
                        onClick={() => disconnectPlatform(platform.id)}
                        className="btn-ghost text-xs text-red-500"
                      >
                        <Unplug className="h-3.5 w-3.5" /> Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConnectModal(platform)}
                      className="btn-primary flex-1 text-xs"
                    >
                      <Plug className="h-3.5 w-3.5" /> Connect
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={!!connectModal}
        onClose={() => setConnectModal(null)}
        title={`Connect ${connectModal?.name}`}
      >
        <p className="mb-4 text-sm text-text-secondary">Choose permissions for this integration:</p>
        <div className="mb-6 space-y-2">
          {(integrationPermissions[connectModal?.category] || integrationPermissions.social).map((perm) => (
            <label
              key={perm}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-lg border p-3',
                selectedPerms.includes(perm) ? 'border-brand-primary bg-brand-gradient-subtle' : 'border-gray-200'
              )}
            >
              <input
                type="checkbox"
                checked={selectedPerms.includes(perm)}
                onChange={(e) =>
                  setSelectedPerms(
                    e.target.checked ? [...selectedPerms, perm] : selectedPerms.filter((p) => p !== perm)
                  )
                }
                className="accent-brand-primary"
              />
              <span className="text-sm">{perm}</span>
            </label>
          ))}
        </div>
        <button type="button" onClick={handleConnect} className="btn-gradient w-full">
          Continue
        </button>
      </Modal>

      <Modal
        open={!!settingsModal}
        onClose={() => setSettingsModal(null)}
        title={`${settingsModal?.name} settings`}
        size="lg"
      >
        {settingsModal && (
          <>
            <IntegrationSettingsPanel
              platform={settingsModal}
              category={settingsModal.category}
              settings={settingsMap[settingsModal.id] || defaultIntegrationSettings(settingsModal.category)}
              onChange={(next) =>
                setSettingsMap((prev) => ({ ...prev, [settingsModal.id]: next }))
              }
            />
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setSettingsModal(null)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="button" onClick={saveSettings} className="btn-gradient flex-1">
                Save settings
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
