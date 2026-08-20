import { redirect } from 'next/navigation';

export default function CreateImageRedirect() {
  redirect('/create/content/new?type=image');
}
