import { redirect } from 'next/navigation';

export default function CommerceRedirect() {
  redirect('/analytics?tab=commerce');
}
