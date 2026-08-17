'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import { approvals } from '@/data/approvals';
import { resolveImage } from '@/lib/images';
import { formatDate } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { Check, X, MessageSquare } from 'lucide-react';

export default function ApprovalsPage() {
  const { addToast } = useApp();
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState('');

  const handleAction = (action) => {
    addToast('success', `Creative ${action.toLowerCase()}!`);
    setSelected(null);
    setComment('');
  };

  return (
    <div className="page-container pb-20">
      <PageHeader title="Approval Center" subtitle="Review and approve creative assets before publishing." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {approvals.map((a) => (
          <div key={a.id} className="card cursor-pointer hover:border-brand-primary/30" onClick={() => setSelected(a)}>
            <img src={resolveImage(a.asset)} alt={a.assetName} className="w-full rounded-xl aspect-video object-cover" />
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{a.assetName}</p>
                <StatusBadge status={a.status} />
              </div>
              <p className="text-xs text-gray-500 mt-1">{a.campaign}</p>
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
            <h3 className="font-semibold mb-4">{selected.assetName}</h3>
            <img src={resolveImage(selected.asset)} alt="" className="w-full rounded-xl mb-4" />
            {selected.comments.length > 0 && (
              <div className="mb-4 space-y-2">
                {selected.comments.map((c, i) => (
                  <div key={i} className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-800">
                    <p className="font-medium text-xs">{c.author}</p>
                    <p className="mt-1">{c.text}</p>
                  </div>
                ))}
              </div>
            )}
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." rows={2} className="input resize-none mb-4" />
            <div className="flex gap-2">
              <button onClick={() => handleAction('Approved')} className="btn-primary flex-1"><Check className="h-4 w-4" /> Approve</button>
              <button onClick={() => handleAction('Changes Requested')} className="btn-secondary flex-1"><MessageSquare className="h-4 w-4" /> Request Changes</button>
              <button onClick={() => handleAction('Rejected')} className="btn-ghost text-red-500"><X className="h-4 w-4" /> Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
