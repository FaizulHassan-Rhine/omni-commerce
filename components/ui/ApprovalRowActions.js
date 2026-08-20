'use client';

import { Check, Globe } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';

export function ApproveAction({ enabled, onApprove }) {
  if (!enabled) return null;
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onApprove?.(event);
      }}
      className="btn-gradient px-3 py-1.5 text-xs"
    >
      <Check className="h-3.5 w-3.5" /> Approve
    </button>
  );
}

export function PublishAction({ enabled, published, lockedLabel = 'Approve first', onPublish }) {
  if (published) return <StatusBadge status="Published" />;
  if (enabled) {
    return (
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onPublish?.(event);
        }}
        className="btn-publish px-3 py-1.5 text-xs"
      >
        <Globe className="h-3.5 w-3.5" /> Publish
      </button>
    );
  }
  return <span className="text-xs text-text-muted">{lockedLabel}</span>;
}

export default function ApprovalRowActions({ canApprove, canPublish, published, onApprove, onPublish, children }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <ApproveAction enabled={canApprove} onApprove={onApprove} />
      <PublishAction enabled={canPublish} published={published} onPublish={onPublish} />
      {children}
    </div>
  );
}
