'use client';

import { Suspense } from 'react';
import ContentStudioPage from '@/components/studio/ContentStudioPage';

export default function CreateContentPage() {
  return (
    <Suspense fallback={<div className="page-container py-10 text-sm text-text-muted">Loading Content Studio...</div>}>
      <ContentStudioPage />
    </Suspense>
  );
}
