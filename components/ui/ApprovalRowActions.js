'use client';

import { Check, Globe } from 'lucide-react';

export default function ApprovalRowActions({ needsAction, onApprove, onPublish, children }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {needsAction ? (
        <>
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
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onPublish?.(event);
            }}
            className="btn-gradient px-3 py-1.5 text-xs"
          >
            <Globe className="h-3.5 w-3.5" /> Publish
          </button>
        </>
      ) : null}
      {children}
    </div>
  );
}
