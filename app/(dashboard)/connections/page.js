'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import PlatformIcon from '@/components/ui/PlatformIcon';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import { platforms } from '@/data/platforms';
import { useApp } from '@/context/AppContext';
import { formatRelativeTime } from '@/lib/utils';
import { Settings, Plug, Unplug } from 'lucide-react';

const categories = [
  { key: 'social', label: 'Social Media', items: platforms.social },
  { key: 'advertising', label: 'Advertising', items: platforms.advertising },
  { key: 'commerce', label: 'Commerce', items: platforms.commerce },
];

const permissions = {
  social: ['Publish posts', 'Manage pages', 'Read analytics', 'Manage ads'],
  advertising: ['Create campaigns', 'Manage budgets', 'View analytics', 'Manage audiences'],
  commerce: ['Sync products', 'Manage inventory', 'Process orders', 'View analytics'],
};

export default function ConnectionsPage() {
  const { connections, connectPlatform, disconnectPlatform } = useApp();
  const [modalPlatform, setModalPlatform] = useState(null);
  const [selectedPerms, setSelectedPerms] = useState([]);

  const getConnection = (platformId) => connections.find((c) => c.platformId === platformId);

  const handleConnect = () => {
    if (modalPlatform) {
      connectPlatform(modalPlatform.id, `@${modalPlatform.name.replace(/\s/g, '')}`);
      setModalPlatform(null);
      setSelectedPerms([]);
    }
  };

  return (
    <div className="page-container pb-20">
      <PageHeader title="Connections" subtitle="Connect your social, advertising, and commerce accounts." />

      {categories.map((cat) => (
        <div key={cat.key} className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{cat.label}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cat.items.map((platform) => {
              const conn = getConnection(platform.id);
              const isConnected = conn?.connected;
              return (
                <div key={platform.id} className="card">
                  <div className="flex items-start gap-4">
                    <PlatformIcon platformId={platform.id} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{platform.name}</h3>
                        <StatusBadge status={isConnected ? 'Connected' : 'Disconnected'} />
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                        Connect {platform.name} to sync and publish content.
                      </p>
                      {isConnected && (
                        <div className="mt-2 text-xs text-gray-500">
                          <p>Account: {conn.account}</p>
                          <p>Last sync: {formatRelativeTime(conn.lastSync)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    {isConnected ? (
                      <>
                        <button className="btn-secondary flex-1 text-xs"><Settings className="h-3.5 w-3.5" /> Settings</button>
                        <button onClick={() => disconnectPlatform(platform.id)} className="btn-ghost text-xs text-red-500">
                          <Unplug className="h-3.5 w-3.5" /> Disconnect
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setModalPlatform(platform)} className="btn-primary flex-1 text-xs">
                        <Plug className="h-3.5 w-3.5" /> Connect
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <Modal open={!!modalPlatform} onClose={() => setModalPlatform(null)} title={`Connect ${modalPlatform?.name}`}>
        <p className="text-sm text-gray-500 mb-4">Choose permissions:</p>
        <div className="space-y-2 mb-6">
          {(permissions[modalPlatform?.category] || permissions.social).map((perm) => (
            <label key={perm} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer dark:border-gray-800">
              <input
                type="checkbox"
                checked={selectedPerms.includes(perm)}
                onChange={(e) => setSelectedPerms(e.target.checked ? [...selectedPerms, perm] : selectedPerms.filter((p) => p !== perm))}
                className="accent-brand-primary"
              />
              <span className="text-sm">{perm}</span>
            </label>
          ))}
        </div>
        <button onClick={handleConnect} className="btn-gradient w-full">Continue</button>
      </Modal>
    </div>
  );
}
