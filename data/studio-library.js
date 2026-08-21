import { products, getProduct } from './products';
import { campaigns } from './campaigns';
import { creatives } from './creatives';
import { getPlatformCreativeSpec } from './platforms';

export const STUDIO_DEMO_SOCIAL_PLATFORMS = ['instagram', 'facebook', 'tiktok', 'linkedin'];

function platformAspectToCrop(aspect) {
  if (!aspect) return 'original';
  if (['1:1', '4:5', '2:3', '9:16', '16:9', '1.91:1'].includes(aspect)) return aspect;
  return 'original';
}

function buildPlatformVariants(asset, platformIds) {
  const variants = {};
  platformIds.forEach((id, index) => {
    const spec = getPlatformCreativeSpec(id);
    variants[id] = {
      cropPreset: platformAspectToCrop(spec.aspect),
      overlayTitle: index === 0 ? asset.name : '',
      overlayPosition: 'bottom-left',
      overlaySize: 'medium',
      overlayColor: '#FFFFFF',
      imageScale: 100,
      imageOffsetX: 0,
      imageOffsetY: 0,
      filter: 'original',
    };
  });
  return variants;
}

export function withMultiPlatformDemo(asset, index) {
  if (index > 1 || asset.type !== 'image') return asset;
  const platforms = STUDIO_DEMO_SOCIAL_PLATFORMS;
  const activePlatformId = platforms[0];
  const platformVariants = buildPlatformVariants(asset, platforms);
  return {
    ...asset,
    platforms,
    activePlatformId,
    platformVariants,
    ...platformVariants[activePlatformId],
  };
}

/** Ensure first two image assets carry multi-platform edit data (also migrates localStorage). */
export function ensureMultiPlatformDemos(assets = []) {
  let imageIndex = 0;
  return assets.map((asset) => {
    if (asset.type !== 'image') return asset;
    const index = imageIndex;
    imageIndex += 1;
    if (index > 1) return asset;
    if (asset.platforms?.length > 1 && asset.platformVariants) return asset;
    return withMultiPlatformDemo(asset, index);
  });
}

export function getInitialStudioLibrary() {
  const multiPlatformDemos = [
    {
      id: 'img-multi-1',
      type: 'image',
      src: '/images/ad-square.jpg',
      source: 'campaign',
      sourceId: 'camp-1',
      name: 'Summer Collection — Lifestyle',
      createdAt: '2026-08-16',
    },
    {
      id: 'img-multi-2',
      type: 'image',
      src: '/images/ad-square.jpg',
      source: 'campaign',
      sourceId: 'camp-1',
      name: 'Boutique Floor — Social Pack',
      createdAt: '2026-08-15',
    },
  ].map((asset, index) => withMultiPlatformDemo(asset, index));

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
    if (multiPlatformDemos.some((item) => item.src === creative.preview)) return;
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

  return ensureMultiPlatformDemos([...multiPlatformDemos, ...images, ...videos]);
}
