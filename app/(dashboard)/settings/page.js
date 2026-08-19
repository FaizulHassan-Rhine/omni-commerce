'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import SettingsTabs from '@/components/settings/SettingsTabs';
import TeamManagement from '@/components/settings/TeamManagement';
import { user, workspace } from '@/data/users';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { CreditCard } from 'lucide-react';

const billingHistory = [
  { id: 'inv-1', date: '2026-08-01', amount: 149, status: 'Paid' },
  { id: 'inv-2', date: '2026-07-01', amount: 149, status: 'Paid' },
  { id: 'inv-3', date: '2026-06-01', amount: 149, status: 'Paid' },
];

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState('profile');

  const save = () => addToast('success', 'Settings saved!');

  return (
    <div className="page-container pb-20">
      <PageHeader title="Settings" subtitle="Manage your workspace and preferences." />
      <SettingsTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'profile' && (
        <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
          <div className="card space-y-4">
            <h3 className="font-semibold text-text-primary">Profile</h3>
            <div>
              <label className="label">Name</label>
              <input defaultValue={user.name} className="input" />
            </div>
            <div>
              <label className="label">Email</label>
              <input defaultValue={user.email} className="input" />
            </div>
            <div>
              <label className="label">Team role</label>
              <input defaultValue={user.teamRole} className="input" disabled />
            </div>
          </div>
          <div className="card space-y-4">
            <h3 className="font-semibold text-text-primary">Appearance</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">Theme</p>
                <p className="text-xs text-text-muted">Switch between light and dark mode.</p>
              </div>
              <button type="button" onClick={toggleTheme} className="btn-secondary text-xs capitalize">
                {theme} mode
              </button>
            </div>
          </div>
          <button type="button" onClick={save} className="btn-gradient">
            Save changes
          </button>
        </div>
      )}

      {activeTab === 'workspace' && (
        <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
          <div className="card space-y-4">
            <h3 className="font-semibold text-text-primary">Workspace</h3>
            <div>
              <label className="label">Company</label>
              <input defaultValue={workspace.name} className="input" />
            </div>
            <div>
              <label className="label">Plan</label>
              <input defaultValue={workspace.plan} className="input" disabled />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Products', value: workspace.products },
                { label: 'Campaigns', value: workspace.activeCampaigns },
                { label: 'Platforms', value: workspace.connectedPlatforms },
                { label: 'Team', value: workspace.teamMembers },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                  <p className="text-xs text-text-muted">{item.label}</p>
                  <p className="text-lg font-bold text-text-primary">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <button type="button" onClick={save} className="btn-gradient">
            Save changes
          </button>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
          <div className="card space-y-4">
            <h3 className="font-semibold text-text-primary">Current plan</h3>
            <div className="rounded-xl border border-brand-primary/20 bg-brand-gradient-subtle p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-brand-primary">{workspace.plan} Plan</p>
                  <p className="text-sm text-text-secondary">$149/month · billed monthly</p>
                </div>
                <button type="button" className="btn-secondary text-xs">Upgrade</button>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <CreditCard className="h-5 w-5 text-text-muted" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">Visa ending in 4242</p>
                <p className="text-xs text-text-muted">Expires 09/2028</p>
              </div>
              <button type="button" className="text-xs font-medium text-brand-primary hover:underline">
                Update
              </button>
            </div>
          </div>
          <div className="card space-y-3">
            <h3 className="font-semibold text-text-primary">Billing history</h3>
            {billingHistory.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800/50">
                <div>
                  <p className="text-sm font-medium text-text-primary">{invoice.date}</p>
                  <p className="text-xs text-text-muted">{invoice.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-text-primary">${invoice.amount}</p>
                  <p className="text-xs text-emerald-600">{invoice.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'team' && <TeamManagement />}
    </div>
  );
}
