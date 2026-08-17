'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { ChannelSelector } from '@/components/ui/PublishingStatus';
import { platforms } from '@/data/platforms';
import { resolveImage } from '@/lib/images';
import { Sparkles } from 'lucide-react';

const platformCaptions = {
  instagram: 'Elevate your everyday carry ✨ Premium leather meets minimalist design. #PremiumLeather #EverydayCarry #NovaCommerce',
  linkedin: 'Introducing our latest premium leather accessory — crafted for professionals who value quality craftsmanship and timeless design.',
  tiktok: 'POV: you finally found the perfect wallet 🖤 minimalist vibes only #fyp #wallet #edc',
  facebook: 'Discover our new premium leather wallet — where craftsmanship meets everyday functionality. Shop now!',
  x: 'New drop: Premium leather wallet with RFID protection. Minimalist design, maximum quality. 🖤',
  pinterest: 'Premium Leather Wallet | Minimalist Design | Everyday Carry Essentials | Gift Ideas for Him',
};

export default function SocialPublishingPage() {
  const [caption, setCaption] = useState('Elevate your everyday carry. Premium leather meets minimalist design.');
  const [selected, setSelected] = useState(['instagram']);
  const [generated, setGenerated] = useState({});

  const handleGenerate = () => {
    const caps = {};
    selected.forEach((id) => { caps[id] = platformCaptions[id] || caption; });
    setGenerated(caps);
  };

  return (
    <div className="page-container pb-20">
      <PageHeader title="Social Publishing" subtitle="Compose and publish across social platforms." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card space-y-4">
          <h3 className="font-semibold">Content Editor</h3>
          <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={6} className="input resize-none" placeholder="Write your post..." />
          <button onClick={handleGenerate} className="btn-gradient w-full"><Sparkles className="h-4 w-4" /> Generate Platform Captions</button>
          {Object.entries(generated).map(([platform, text]) => (
            <div key={platform} className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
              <p className="text-xs font-semibold capitalize text-brand-primary mb-1">{platform}</p>
              <p className="text-sm">{text}</p>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 className="font-semibold mb-4">Preview</h3>
          <div className="rounded-xl border border-gray-200 overflow-hidden dark:border-gray-800">
            <img src={resolveImage('/images/ad-square.jpg')} alt="Preview" className="w-full" />
            <div className="p-4">
              <p className="text-sm">{caption}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-4">Platforms</h3>
          <ChannelSelector channels={platforms.social} selected={selected} onChange={setSelected} />
          <button className="btn-gradient w-full mt-4">Schedule Post</button>
        </div>
      </div>
    </div>
  );
}
