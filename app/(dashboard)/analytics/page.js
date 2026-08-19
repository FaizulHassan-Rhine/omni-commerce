'use client';

import { Suspense } from 'react';
import AnalyticsHub from '@/components/analytics/AnalyticsHub';

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div className="page-container pb-20 py-12 text-center text-sm text-text-muted">Loading analytics...</div>}>
      <AnalyticsHub />
    </Suspense>
  );
}
