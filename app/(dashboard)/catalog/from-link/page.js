'use client';

import ProductTabs from '@/components/product/ProductTabs';
import CreateProductWizard from '@/components/product/CreateProductWizard';

export default function CreateProductFromLinkPage() {
  return (
    <div className="page-container pb-20 lg:pb-6">
      <ProductTabs />
      <CreateProductWizard mode="link" />
    </div>
  );
}
