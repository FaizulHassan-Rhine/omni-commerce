import { redirect } from 'next/navigation';

export default function CreativeIntelligenceRedirect() {
  redirect('/analytics?tab=creative');
}
