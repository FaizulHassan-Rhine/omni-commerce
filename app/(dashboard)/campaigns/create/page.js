'use client';

import CampaignTabs from '@/components/campaign/CampaignTabs';
import CreateCampaignWizard from '@/components/campaign/CreateCampaignWizard';

export default function CreateCampaignPage() {
  return (
    <div className="page-container pb-20 lg:pb-6">
      <CampaignTabs />
      <CreateCampaignWizard />
    </div>
  );
}
