'use client';

import ProductTabs from '@/components/product/ProductTabs';
import CreateProductWizard from '@/components/product/CreateProductWizard';

export default function CreateProductPage() {
  return (
    <div className="page-container pb-20 lg:pb-6">
      <ProductTabs />
      <CreateProductWizard mode="upload" />
    </div>
  );
}
