import { products, getProduct } from './products';
import { campaigns } from './campaigns';
import { creatives } from './creatives';

export function getInitialStudioLibrary() {
  const images = products.map((product) => ({
    id: `img-${product.id}`,
    type: 'image',
    src: product.image,
    source: 'product',
    sourceId: product.id,
    name: product.name,
    createdAt: product.createdAt,
  }));

  campaigns.forEach((campaign) => {
    const product = getProduct(campaign.productId);
    if (!product) return;
    images.push({
      id: `img-${campaign.id}`,
      type: 'image',
      src: product.image,
      source: 'campaign',
      sourceId: campaign.id,
      name: campaign.name,
      createdAt: campaign.startDate,
    });
  });

  creatives.forEach((creative) => {
    if (images.some((item) => item.src === creative.preview && item.source === 'campaign')) return;
    images.push({
      id: `img-${creative.id}`,
      type: 'image',
      src: creative.preview,
      source: 'campaign',
      sourceId: creative.campaignId,
      name: creative.name,
      createdAt: '2026-08-10',
    });
  });

  const videos = [
    {
      id: 'vid-camp-1',
      type: 'video',
      src: '/images/ad-vertical.jpg',
      source: 'campaign',
      sourceId: 'camp-1',
      name: 'Summer Leather Collection',
      createdAt: '2026-08-02',
    },
    {
      id: 'vid-camp-2',
      type: 'video',
      src: '/images/product-strap.jpg',
      source: 'campaign',
      sourceId: 'camp-2',
      name: 'Watch Strap Launch',
      createdAt: '2026-08-06',
    },
    {
      id: 'vid-camp-5',
      type: 'video',
      src: '/images/ad-square.jpg',
      source: 'campaign',
      sourceId: 'camp-5',
      name: 'TikTok Viral Push',
      createdAt: '2026-08-12',
    },
    {
      id: 'vid-prod-1',
      type: 'video',
      src: '/images/product-wallet.jpg',
      source: 'product',
      sourceId: 'prod-1',
      name: 'Classic Leather Wallet',
      createdAt: '2026-08-02',
    },
    {
      id: 'vid-prod-6',
      type: 'video',
      src: '/images/product-keys.jpg',
      source: 'product',
      sourceId: 'prod-6',
      name: 'Key Organizer',
      createdAt: '2026-08-10',
    },
    {
      id: 'vid-camp-7',
      type: 'video',
      src: '/images/product-belt.jpg',
      source: 'campaign',
      sourceId: 'camp-7',
      name: 'Executive Belt Promo',
      createdAt: '2026-07-28',
    },
  ];

  return [...images, ...videos];
}
