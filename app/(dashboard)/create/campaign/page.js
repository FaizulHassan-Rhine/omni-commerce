import { redirect } from 'next/navigation';

export default function CreateCampaignRedirect() {
  redirect('/campaigns/create');
}
