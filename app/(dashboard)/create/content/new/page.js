'use client';

import { Suspense } from 'react';
import CreateStudioContent from '@/components/studio/CreateStudioContent';

export default function CreateStudioContentPage() {
  return (
    <Suspense fallback={<div className="page-container py-10 text-sm text-text-muted">Loading creator...</div>}>
      <CreateStudioContent />
    </Suspense>
  );
}
