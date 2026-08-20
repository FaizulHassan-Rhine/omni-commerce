import { teamMembers, user as workspaceUser } from '@/data/users';

export const TEAM_ROLES = ['Admin', 'Moderator', 'Reviewer'];

export const APPROVER_ROLES = ['Admin', 'Moderator'];

export const roleDescriptions = {
  Admin: 'Full access — invite members, manage roles, billing, and workspace settings.',
  Moderator: 'Create and edit products, campaigns, and content. Cannot manage team or billing.',
  Reviewer: 'View and approve content. Read-only access to analytics and settings.',
};

export const roleBadgeColors = {
  Admin: 'bg-brand-primary/10 text-brand-primary',
  Moderator: 'bg-blue-100 text-blue-700',
  Reviewer: 'bg-gray-100 text-gray-600',
};

export function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function nameFromEmail(email) {
  const local = email.split('@')[0] || 'member';
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function resolveTeamRole(email) {
  const member = teamMembers.find((item) => item.email.toLowerCase() === email?.trim().toLowerCase());
  return member?.teamRole || workspaceUser.teamRole || 'Reviewer';
}

export function canApproveContent(teamRole) {
  return APPROVER_ROLES.includes(teamRole);
}
