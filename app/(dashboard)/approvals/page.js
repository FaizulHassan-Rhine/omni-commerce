'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import { resolveImage } from '@/lib/images';
import { formatDate } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { canApproveContent, resolveTeamRole } from '@/lib/team-roles';
import { Check, X, MessageSquare } from 'lucide-react';

export default function ApprovalsPage() {
  const { addToast, approvals, updateApproval } = useApp();
  const { user } = useAuth();
  const teamRole = resolveTeamRole(user?.email);
  const canApprove = canApproveContent(teamRole);
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState('');

  const handleAction = async (action) => {
    if (!selected) return;
    if (!canApprove) {
      addToast('error', 'Only Admin or Moderator can approve or reject for publish.');
      return;
    }

    const reviewer = user?.name || 'Alex Morgan';
    const nextComments = comment.trim()
      ? [...(selected.comments || []), { author: reviewer, text: comment.trim(), time: new Date().toISOString() }]
      : selected.comments || [];

    if (action === 'Approved') {
      updateApproval(selected.id, {
        status: 'Approved',
        reviewer,
        comments: nextComments,
      });
      addToast('success', 'Approved. Publishing to the selected channel...');
      setSelected(null);
      setComment('');
      await new Promise((r) => setTimeout(r, 900));
      updateApproval(selected.id, { status: 'Published', reviewer, comments: nextComments });
      addToast('success', `${selected.assetName} published.`);
      return;
    }

    updateApproval(selected.id, {
      status: action,
      reviewer,
      comments: nextComments,
    });
    addToast('success', `Marked as ${action.toLowerCase()}.`);
    setSelected(null);
    setComment('');
  };

  return (
    <div className="page-container pb-20">
      <PageHeader
        title="Approval Center"
        subtitle="Launch requests wait here. Admin or Moderator approval is required before publish."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {approvals.map((a) => (
          <div key={a.id} className="card cursor-pointer hover:border-brand-primary/30" onClick={() => setSelected(a)}>
            <img src={resolveImage(a.asset)} alt={a.assetName} className="w-full rounded-xl aspect-video object-cover" />
            <div className="mt-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-sm">{a.assetName}</p>
                <StatusBadge status={a.status} />
              </div>
              <p className="text-xs text-gray-500 mt-1">{a.campaign}{a.platform ? ` · ${a.platform}` : ''}</p>
              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>{a.creator}</span>
                <span>{formatDate(a.createdDate)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 dark:bg-surface-dark animate-slide-up">
            <h3 className="font-semibold mb-1">{selected.assetName}</h3>
            <p className="mb-4 text-xs text-text-muted">
              {selected.campaign}{selected.platform ? ` · ${selected.platform}` : ''} · Submitted by {selected.creator}
            </p>
            <img src={resolveImage(selected.asset)} alt="" className="w-full rounded-xl mb-4" />
            {selected.comments?.length > 0 && (
              <div className="mb-4 space-y-2">
                {selected.comments.map((c, i) => (
                  <div key={i} className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-800">
                    <p className="font-medium text-xs">{c.author}</p>
                    <p className="mt-1">{c.text}</p>
                  </div>
                ))}
              </div>
            )}
            {selected.status === 'Awaiting Review' ? (
              <>
                {!canApprove && (
                  <p className="mb-3 text-sm text-amber-700">
                    Waiting for an Admin or Moderator to approve this before it can publish.
                  </p>
                )}
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." rows={2} className="input resize-none mb-4" />
                <div className="flex gap-2">
                  <button onClick={() => handleAction('Approved')} disabled={!canApprove} className="btn-primary flex-1">
                    <Check className="h-4 w-4" /> Approve & publish
                  </button>
                  <button onClick={() => handleAction('Changes Requested')} disabled={!canApprove} className="btn-secondary flex-1">
                    <MessageSquare className="h-4 w-4" /> Request Changes
                  </button>
                  <button onClick={() => handleAction('Rejected')} disabled={!canApprove} className="btn-ghost text-red-500">
                    <X className="h-4 w-4" /> Reject
                  </button>
                </div>
              </>
            ) : (
              <div className="flex justify-end">
                <button type="button" onClick={() => setSelected(null)} className="btn-secondary">Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
