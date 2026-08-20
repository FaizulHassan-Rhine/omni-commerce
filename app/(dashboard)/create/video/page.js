import { redirect } from 'next/navigation';

export default function CreateVideoRedirect() {
  redirect('/create/content/new?type=video');
}
