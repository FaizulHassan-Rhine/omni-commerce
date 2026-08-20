'use client';

import { Suspense } from 'react';
import CampaignTabs from '@/components/campaign/CampaignTabs';
import CreateCampaignWizard from '@/components/campaign/CreateCampaignWizard';

export default function CreateCampaignPage() {
  return (
    <div className="page-container pb-20 lg:pb-6">
      <CampaignTabs />
      <Suspense fallback={<div className="py-10 text-sm text-text-muted">Loading campaign setup...</div>}>
        <CreateCampaignWizard />
      </Suspense>
    </div>
  );
}
