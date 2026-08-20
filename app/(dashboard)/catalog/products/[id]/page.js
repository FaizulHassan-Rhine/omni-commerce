import { redirect } from 'next/navigation';

export default async function ProductDetailRedirect({ params }) {
  const { id } = await params;
  redirect(`/catalog?product=${id}`);
}
