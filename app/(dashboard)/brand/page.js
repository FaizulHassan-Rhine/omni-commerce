'use client';

import PageHeader from '@/components/ui/PageHeader';
import { brandKit } from '@/data/brand';
import { useApp } from '@/context/AppContext';

export default function BrandKitPage() {
  const { addToast } = useApp();

  return (
    <div className="page-container pb-20">
      <PageHeader title="Brand Kit" subtitle="Define your brand identity to guide AI recommendations." />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-4">
          <div><label className="label">Brand Name</label><input defaultValue={brandKit.brandName} className="input" /></div>
          <div>
            <label className="label">Logo</label>
            <div className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
              <span className="text-sm text-gray-400">Upload logo</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[{ l: 'Primary Color', v: brandKit.primaryColor }, { l: 'Secondary Color', v: brandKit.secondaryColor }, { l: 'Accent Color', v: brandKit.accentColor }].map((c) => (
              <div key={c.l}>
                <label className="label">{c.l}</label>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg border" style={{ backgroundColor: c.v }} />
                  <input defaultValue={c.v} className="input" />
                </div>
              </div>
            ))}
          </div>
          <div><label className="label">Fonts</label><input defaultValue={`${brandKit.fonts.heading} / ${brandKit.fonts.body}`} className="input" /></div>
        </div>
        <div className="card space-y-4">
          <div><label className="label">Brand Voice</label><textarea defaultValue={brandKit.brandVoice} rows={2} className="input resize-none" /></div>
          <div><label className="label">Preferred Words</label><input defaultValue={brandKit.preferredWords.join(', ')} className="input" /></div>
          <div><label className="label">Avoided Words</label><input defaultValue={brandKit.avoidedWords.join(', ')} className="input" /></div>
          <div><label className="label">Product Photography Style</label><textarea defaultValue={brandKit.photographyStyle} rows={2} className="input resize-none" /></div>
          <div><label className="label">Advertising Tone</label><textarea defaultValue={brandKit.advertisingTone} rows={2} className="input resize-none" /></div>
          <div><label className="label">Target Audience</label><textarea defaultValue={brandKit.targetAudience} rows={2} className="input resize-none" /></div>
        </div>
      </div>
      <button onClick={() => addToast('success', 'Brand kit saved!')} className="btn-gradient mt-6">Save Brand Kit</button>
    </div>
  );
}
