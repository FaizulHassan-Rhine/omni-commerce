'use client';

import PageHeader from '@/components/ui/PageHeader';
import { user, workspace, teamMembers } from '@/data/users';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useApp();

  return (
    <div className="page-container pb-20">
      <PageHeader title="Settings" subtitle="Manage your workspace and preferences." />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-4">
          <h3 className="font-semibold">Profile</h3>
          <div><label className="label">Name</label><input defaultValue={user.name} className="input" /></div>
          <div><label className="label">Email</label><input defaultValue={user.email} className="input" /></div>
          <div><label className="label">Role</label><input defaultValue={user.role} className="input" disabled /></div>
        </div>
        <div className="card space-y-4">
          <h3 className="font-semibold">Workspace</h3>
          <div><label className="label">Company</label><input defaultValue={workspace.name} className="input" /></div>
          <div><label className="label">Plan</label><input defaultValue={workspace.plan} className="input" disabled /></div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800"><p className="text-gray-400">Products</p><p className="font-bold">{workspace.products}</p></div>
            <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800"><p className="text-gray-400">Campaigns</p><p className="font-bold">{workspace.activeCampaigns}</p></div>
          </div>
        </div>
        <div className="card space-y-4">
          <h3 className="font-semibold">Appearance</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm">Theme</span>
            <button onClick={toggleTheme} className="btn-secondary text-xs capitalize">{theme} mode</button>
          </div>
        </div>
        <div className="card space-y-4">
          <h3 className="font-semibold">Team Members</h3>
          {teamMembers.map((m) => (
            <div key={m.id} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-xs font-bold text-white">{m.avatar}</div>
              <div><p className="text-sm font-medium">{m.name}</p><p className="text-xs text-gray-400">{m.role}</p></div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => addToast('success', 'Settings saved!')} className="btn-gradient mt-6">Save Changes</button>
    </div>
  );
}
