'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import StatusBadge from '@/components/ui/StatusBadge';
import { useApp } from '@/context/AppContext';
import { user as currentUser } from '@/data/users';
import {
  TEAM_ROLES,
  roleBadgeColors,
  roleDescriptions,
  getInitials,
  nameFromEmail,
} from '@/lib/team-roles';
import { cn } from '@/lib/utils';
import { Mail, Plus, UserPlus, X } from 'lucide-react';

const initialMembers = [
  { id: 'tm-1', name: 'Alex Morgan', email: 'alex@novacommerce.com', teamRole: 'Admin', avatar: 'AM' },
  { id: 'tm-2', name: 'Sarah Chen', email: 'sarah@novacommerce.com', teamRole: 'Moderator', avatar: 'SC' },
  { id: 'tm-3', name: 'James Wilson', email: 'james@novacommerce.com', teamRole: 'Reviewer', avatar: 'JW' },
  { id: 'tm-4', name: 'Emily Rodriguez', email: 'emily@novacommerce.com', teamRole: 'Reviewer', avatar: 'ER' },
];

const initialPendingInvites = [
  {
    id: 'inv-1',
    email: 'mike@novacommerce.com',
    teamRole: 'Moderator',
    sentAt: '2026-08-17',
  },
];

const roleOptions = TEAM_ROLES.map((role) => ({ value: role, label: role }));

function RoleBadge({ role }) {
  return (
    <span className={cn('inline-flex rounded-md px-2 py-0.5 text-xs font-semibold', roleBadgeColors[role])}>
      {role}
    </span>
  );
}

export default function TeamManagement() {
  const { addToast } = useApp();
  const isAdmin = currentUser.teamRole === 'Admin';

  const [members, setMembers] = useState(initialMembers);
  const [pendingInvites, setPendingInvites] = useState(initialPendingInvites);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Reviewer');
  const [editRole, setEditRole] = useState('Reviewer');
  const [sending, setSending] = useState(false);

  const openInvite = () => {
    setInviteEmail('');
    setInviteRole('Reviewer');
    setInviteOpen(true);
  };

  const openManage = (member) => {
    setSelectedMember(member);
    setEditRole(member.teamRole);
    setManageOpen(true);
  };

  const sendInvite = async () => {
    const email = inviteEmail.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      addToast('error', 'Please enter a valid email address.');
      return;
    }
    if (members.some((m) => m.email === email)) {
      addToast('error', 'This person is already a team member.');
      return;
    }
    if (pendingInvites.some((inv) => inv.email === email)) {
      addToast('error', 'An invitation is already pending for this email.');
      return;
    }

    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setPendingInvites((prev) => [
      ...prev,
      {
        id: `inv-${Date.now()}`,
        email,
        teamRole: inviteRole,
        sentAt: new Date().toISOString().slice(0, 10),
      },
    ]);
    setSending(false);
    setInviteOpen(false);
    addToast(
      'success',
      `Invitation sent to ${email}. They will join the team once they accept.`
    );
  };

  const cancelInvite = (id) => {
    setPendingInvites((prev) => prev.filter((inv) => inv.id !== id));
    addToast('info', 'Invitation cancelled.');
  };

  const acceptInvite = (invite) => {
    setPendingInvites((prev) => prev.filter((inv) => inv.id !== invite.id));
    const name = nameFromEmail(invite.email);
    setMembers((prev) => [
      ...prev,
      {
        id: `tm-${Date.now()}`,
        name,
        email: invite.email,
        teamRole: invite.teamRole,
        avatar: getInitials(name),
      },
    ]);
    addToast('success', `${name} accepted the invitation and joined the team.`);
  };

  const saveMemberRole = () => {
    if (!selectedMember) return;
    if (selectedMember.id === currentUser.id && editRole !== 'Admin') {
      const adminCount = members.filter((m) => m.teamRole === 'Admin').length;
      if (adminCount <= 1) {
        addToast('error', 'You must keep at least one Admin on the team.');
        return;
      }
    }
    setMembers((prev) =>
      prev.map((m) => (m.id === selectedMember.id ? { ...m, teamRole: editRole } : m))
    );
    setManageOpen(false);
    addToast('success', `${selectedMember.name}'s role updated to ${editRole}.`);
  };

  const removeMember = () => {
    if (!selectedMember) return;
    if (selectedMember.id === currentUser.id) {
      addToast('error', 'You cannot remove yourself from the team.');
      return;
    }
    setMembers((prev) => prev.filter((m) => m.id !== selectedMember.id));
    setManageOpen(false);
    addToast('success', `${selectedMember.name} removed from the team.`);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
      <div className="card space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-text-primary">Team members</h3>
            <p className="mt-0.5 text-xs text-text-muted">
              Roles: Admin, Moderator, and Reviewer
            </p>
          </div>
          {isAdmin && (
            <button type="button" onClick={openInvite} className="btn-secondary text-xs">
              <UserPlus className="h-3.5 w-3.5" /> Invite member
            </button>
          )}
        </div>

        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient text-xs font-bold text-white">
                  {member.avatar}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-text-primary">{member.name}</p>
                    <RoleBadge role={member.teamRole} />
                  </div>
                  <p className="text-xs text-text-muted">{member.email}</p>
                </div>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => openManage(member)}
                  className="text-xs font-medium text-brand-primary hover:underline"
                >
                  Manage
                </button>
              )}
            </div>
          ))}
        </div>

        {isAdmin && (
          <button type="button" onClick={openInvite} className="btn-secondary w-full">
            <Plus className="h-4 w-4" /> Add team member
          </button>
        )}
      </div>

      {pendingInvites.length > 0 && (
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-text-primary">Pending invitations</h3>
            <p className="mt-0.5 text-xs text-text-muted">
              Members appear here until they accept the email invitation.
            </p>
          </div>
          <div className="space-y-3">
            {pendingInvites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-amber-200 bg-amber-50/50 p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                    <Mail className="h-4 w-4 text-amber-700" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium text-text-primary">{invite.email}</p>
                      <RoleBadge role={invite.teamRole} />
                      <StatusBadge status="Pending" />
                    </div>
                    <p className="text-xs text-text-muted">Sent {invite.sentAt} · Awaiting acceptance</p>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => acceptInvite(invite)}
                      className="text-xs font-medium text-brand-primary hover:underline"
                      title="Simulates the invitee accepting via email link"
                    >
                      Simulate accept
                    </button>
                    <button
                      type="button"
                      onClick={() => cancelInvite(invite.id)}
                      className="rounded-lg p-1 text-text-muted hover:bg-white hover:text-red-500"
                      aria-label="Cancel invitation"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite team member" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-text-muted">
            Send an email invitation. The person will join your workspace after they accept.
          </p>
          <div>
            <label className="label">Email address</label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="input"
              autoFocus
            />
          </div>
          <div>
            <label className="label">Role</label>
            <Select
              value={inviteRole}
              onChange={setInviteRole}
              options={roleOptions}
              aria-label="Invite role"
            />
            <p className="mt-1.5 text-xs text-text-muted">{roleDescriptions[inviteRole]}</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setInviteOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="button" onClick={sendInvite} disabled={sending} className="btn-gradient">
              <Mail className="h-4 w-4" />
              {sending ? 'Sending…' : 'Send invitation'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        title="Manage team member"
        size="sm"
      >
        {selectedMember && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gradient text-sm font-bold text-white">
                {selectedMember.avatar}
              </div>
              <div>
                <p className="font-medium text-text-primary">{selectedMember.name}</p>
                <p className="text-sm text-text-muted">{selectedMember.email}</p>
              </div>
            </div>
            <div>
              <label className="label">Team role</label>
              <Select
                value={editRole}
                onChange={setEditRole}
                options={roleOptions}
                aria-label="Member role"
                disabled={selectedMember.id === currentUser.id && members.filter((m) => m.teamRole === 'Admin').length <= 1}
              />
              <p className="mt-1.5 text-xs text-text-muted">{roleDescriptions[editRole]}</p>
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={removeMember}
                disabled={selectedMember.id === currentUser.id}
                className="text-xs font-medium text-red-500 hover:underline disabled:opacity-40"
              >
                Remove member
              </button>
              <div className="flex gap-2">
                <button type="button" onClick={() => setManageOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="button" onClick={saveMemberRole} className="btn-gradient">
                  Save role
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
