import { delay } from './utils';
import { getPlatform, getPlatformCreativeSpec } from '@/data/platforms';
import { extraFieldsForPlatform } from '@/lib/platform-review';
import { products } from '@/data/products';
import { getPlaceholderImage } from '@/lib/images';

function decodeDisplayText(value) {
  if (value == null) return '';
  let text = String(value);
  try {
    text = decodeURIComponent(text);
  } catch {
    /* already decoded */
  }
  return text.replace(/%20/gi, ' ').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export const AI_CONTENT_STAGES = [
  'Analyzing product...',
  'Identifying attributes...',
  'Generating product content...',
  'Optimizing for SEO...',
  'Creating social content...',
  'Preparing results...',
];

export const AI_LINK_STAGES = [
  'Analyzing fetched listing...',
  'Identifying product attributes...',
  'Generating product content...',
  'Optimizing for SEO...',
  'Creating social content...',
  'Preparing results...',
];

export const FETCH_LINK_STAGES = [
  'Connecting to the product page...',
  'Reading listing details...',
  'Extracting images and attributes...',
];

export const AI_CAMPAIGN_STAGES = [
  'Analyzing product positioning...',
  'Researching audience segments...',
  'Generating ad copy variants...',
  'Creating creative concepts...',
  'Optimizing budget allocation...',
  'Preparing campaign assets...',
];

export const AI_IMAGE_STAGES = [
  'Processing product image...',
  'Applying background style...',
  'Enhancing lighting...',
  'Generating variations...',
  'Finalizing outputs...',
];

export const AI_STUDIO_STAGES = [
  'Reading your brief...',
  'Composing the scene...',
  'Generating visual variants...',
  'Rendering outputs...',
  'Preparing library assets...',
];

export const AI_PLATFORM_STAGES = [
  'Matching selected platform aspect ratios...',
  'Generating channel-specific creatives...',
  'Adapting captions and CTAs...',
  'Preparing image and video variants...',
  'Ready for review...',
];

export async function simulateAIProcessing(stages, onStageChange, stageDuration = 800) {
  for (let i = 0; i < stages.length; i++) {
    onStageChange(i, stages[i]);
    await delay(stageDuration);
  }
}

export function generateStudioMedia({ prompt, sourceImage, options, seed = 0 }) {
  const count = Number(options?.outputCount) || 2;
  const types = options?.contentTypes || { image: true, video: false };
  const items = [];
  const title = (prompt || 'Studio creative').trim().split(' ').slice(0, 5).join(' ') || 'Studio creative';

  if (types.image) {
    for (let i = 0; i < count; i++) {
      items.push({
        type: 'image',
        src: sourceImage || getPlaceholderImage('product', seed + i),
        name: `${title} — image ${i + 1}`,
      });
    }
  }

  if (types.video) {
    const videoCount = Math.max(1, Math.ceil(count / 2));
    for (let i = 0; i < videoCount; i++) {
      items.push({
        type: 'video',
        src: sourceImage || getPlaceholderImage('ad', seed + i),
        name: `${title} — video ${i + 1}`,
      });
    }
  }

  return items;
}

function productBaseName(input) {
  if (!input || typeof input !== 'string') return 'Classic Leather Wallet';
  const trimmed = decodeDisplayText(input.trim());
  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const slug = decodeDisplayText(url.pathname.split('/').filter(Boolean).pop() || '');
    if (slug && !slug.includes('.')) return slug;
    return url.hostname.replace(/^www\./, '').split('.')[0];
  } catch {
    const words = trimmed.split(' ').slice(0, 6).join(' ');
    if (!words || /^uploaded product$/i.test(words)) return 'Classic Leather Wallet';
    return words;
  }
}

export function fetchProductFromLink(url) {
  const sourceUrl = url?.trim() || '';
  const name = productBaseName(sourceUrl);
  const haystack = sourceUrl.toLowerCase();
  const match = products.find((product) => {
    const slug = product.name.toLowerCase().replace(/\s+/g, '-');
    return (
      haystack.includes(product.id) ||
      haystack.includes(product.sku.toLowerCase()) ||
      haystack.includes(slug) ||
      product.name.toLowerCase().includes(name.toLowerCase())
    );
  });

  const store = (() => {
    try {
      return new URL(sourceUrl.startsWith('http') ? sourceUrl : `https://${sourceUrl}`).hostname.replace(/^www\./, '');
    } catch {
      return 'Store listing';
    }
  })();

  if (match) {
    return {
      name: match.name,
      sku: match.sku,
      price: match.price,
      stock: match.stock,
      category: match.category,
      description: match.description,
      shortDescription: match.shortDescription,
      color: match.color,
      material: match.material,
      tags: match.tags,
      image: match.image,
      sourceUrl,
      store,
    };
  }

  const title = name.replace(/\b\w/g, (char) => char.toUpperCase());
  return {
    name: title,
    sku: 'IMP-001',
    price: 89.99,
    stock: 24,
    category: 'Fashion Accessories',
    description: `Product listing imported from the store page for ${title.toLowerCase()}.`,
    shortDescription: `${title} imported from the product URL.`,
    color: 'Midnight Black',
    material: 'Full-Grain Leather',
    tags: title.toLowerCase().split(' ').filter(Boolean).slice(0, 4),
    image: '/images/product-wallet.jpg',
    sourceUrl,
    store,
  };
}

export function generateProductContent(input, options = {}) {
  const isPrompt = typeof input === 'string';
  const rawName = options.notes
    ? decodeDisplayText(options.notes).split(' ').slice(0, 6).join(' ')
    : isPrompt
      ? productBaseName(input)
      : 'Classic Leather Wallet';
  const baseName = decodeDisplayText(rawName) || 'Classic Leather Wallet';

  return {
    title: `Nova ${baseName} — Handcrafted Excellence`,
    description: `Experience the perfect blend of style and functionality with our ${baseName.toLowerCase()}. Crafted from premium full-grain leather with meticulous attention to detail, this accessory elevates your everyday carry. Features RFID-blocking technology, 8 card slots, and a slim profile that fits comfortably in any pocket.`,
    shortDescription: `Premium ${baseName.toLowerCase()} with minimalist design and RFID protection.`,
    category: 'Fashion Accessories',
    tags: ['leather', 'wallet', 'premium', 'minimalist', 'mens-accessories', 'RFID'],
    seoTitle: `${baseName} | Premium Handcrafted Leather | Nova Commerce`,
    seoMetaDescription: `Shop our premium ${baseName.toLowerCase()}. Full-grain leather, RFID protection, minimalist design. Free shipping on orders over $50.`,
    keywords: ['leather wallet', 'premium wallet', 'mens wallet', 'RFID wallet', 'minimalist wallet'],
    highlights: [
      'Full-grain genuine leather',
      'RFID-blocking technology',
      'Slim 0.4" profile',
      '8 card slots + bill compartment',
      'Lifetime craftsmanship warranty',
    ],
    suggestedAudience: 'Men aged 25-45 interested in premium fashion accessories and minimalist lifestyle',
    pricePositioning: 'Premium ($79-$129)',
    color: 'Midnight Black',
    material: 'Full-Grain Leather',
    attributes: {
      dimensions: '4.3" x 3.1" x 0.4"',
      weight: '2.8 oz',
      closure: 'Bifold',
      lining: 'Microfiber',
    },
    socialCaption: 'Elevate your everyday carry. ✨ Our new premium leather wallet combines timeless craftsmanship with modern RFID protection. Because the details matter.',
    hashtags: ['#PremiumLeather', '#MinimalistStyle', '#EverydayCarry', '#NovaCommerce', '#MensFashion'],
    cta: 'Shop Now — Limited Edition',
    contentTone: 'Premium, confident, minimalist',
    generatedImage: '/images/product-wallet.jpg',
    sourceUrl: options.sourceUrl || null,
  };
}

export function generateCampaignContent(config) {
  const { objective = 'Sales', productName = 'Premium Leather Wallet' } = config;

  return {
    campaignName: `${productName} — ${objective} Campaign Q3`,
    headline: 'Crafted for the Modern Gentleman',
    primaryText: `Discover the ${productName} — where premium craftsmanship meets everyday functionality. Limited time offer: Free engraving with every purchase.`,
    shortCaption: 'Premium leather. Minimalist design. Elevated everyday carry. 🖤',
    longCaption: `Every detail matters when it comes to the accessories you carry daily. Our ${productName} is handcrafted from full-grain leather, featuring RFID protection and a slim profile that fits seamlessly into your lifestyle. Join thousands of satisfied customers who've upgraded their everyday carry.`,
    cta: 'Shop Now',
    hashtags: ['#PremiumLeather', '#EverydayCarry', '#NovaCommerce', '#MensStyle'],
    landingPageMessage: 'Welcome to premium craftsmanship. Your perfect wallet awaits.',
    creativeConcept: 'Luxury lifestyle photography with urban backdrop, emphasizing craftsmanship details and premium materials.',
    generatedImage: '/images/ad-square.jpg',
    storyCreative: '/images/ad-vertical.jpg',
    squareCreative: '/images/ad-square.jpg',
    verticalCreative: '/images/ad-vertical.jpg',
    audienceRecommendations: {
      primary: 'Men aged 24-40 interested in premium fashion accessories',
      secondary: 'Gift shoppers aged 25-45 looking for luxury presents',
    },
    campaignSummary: `A ${objective.toLowerCase()}-focused campaign targeting premium accessory enthusiasts with emotional storytelling and product-focused creatives across Meta, Google, and TikTok.`,
    variants: [
      {
        id: 'a',
        name: 'Variant A — Emotional',
        headline: 'Carry Confidence Every Day',
        primaryText: 'Some things you touch every day deserve to be extraordinary. Our handcrafted leather wallet is more than an accessory — it\'s a statement.',
        cta: 'Discover Yours',
        tone: 'Emotional',
      },
      {
        id: 'b',
        name: 'Variant B — Product Focused',
        headline: 'Full-Grain Leather. RFID Protected.',
        primaryText: '8 card slots. Slim 0.4" profile. Full-grain leather with lifetime warranty. The wallet engineered for modern life.',
        cta: 'View Details',
        tone: 'Product',
      },
      {
        id: 'c',
        name: 'Variant C — Offer Focused',
        headline: '25% Off — Limited Time',
        primaryText: 'Upgrade your everyday carry with our premium leather wallet. Free engraving + free shipping on orders over $50. Offer ends Sunday.',
        cta: 'Claim Offer',
        tone: 'Offer',
      },
    ],
    estimates: {
      reach: '245,000 - 380,000',
      clicks: '12,400 - 18,600',
      conversions: '620 - 930',
      cpa: '$18.50 - $24.20',
    },
  };
}

function captionForPlatform(id, content) {
  const base = content?.socialCaption || 'New product drop. Shop now.';
  const hashtags = (content?.hashtags || []).join(' ');
  const title = content?.title || 'Premium product';
  const cta = content?.cta || 'Shop Now';

  switch (id) {
    case 'instagram':
      return `${base}\n\n${hashtags}`;
    case 'linkedin':
      return `${title} is now available. Built for professionals who value craftsmanship and everyday utility.\n\n${cta}`;
    case 'tiktok':
      return `${base.split('.')[0]}. Wait till the end 👀\n\n${hashtags}`;
    case 'x':
      return `${base.slice(0, 220)}${hashtags ? `\n${hashtags.split(' ').slice(0, 3).join(' ')}` : ''}`;
    case 'pinterest':
      return `${title} — ${content?.shortDescription || base} ${hashtags}`;
    case 'facebook':
      return `${base}\n\n${cta}`;
    default:
      return `${title}\n\n${content?.shortDescription || base}\n\n${cta}`;
  }
}

export function generatePlatformPosts({ channels, content, creativeOptions, sourceImage }) {
  const wantImage = creativeOptions?.contentTypes?.image !== false;
  const wantVideo = !!creativeOptions?.contentTypes?.video;

  return (channels || []).map((id) => {
    const spec = getPlatformCreativeSpec(id);
    const platform = getPlatform(id);
    let mediaType = spec.preferred || 'image';
    if (wantVideo && !wantImage) mediaType = 'video';
    else if (wantImage && !wantVideo) mediaType = 'image';
    else if (wantVideo && wantImage) mediaType = spec.preferred === 'video' ? 'video' : 'image';

    return {
      id,
      name: platform.name,
      aspect: spec.aspect,
      aspectClass: spec.aspectClass,
      aspectLabel: spec.label,
      mediaType,
      mediaUrl: sourceImage || content?.generatedImage,
      caption: captionForPlatform(id, content),
      cta: content?.cta || 'Shop Now',
      status: 'ready',
      imageScale: 100,
      imageOffsetX: 0,
      imageOffsetY: 0,
      imageBrightness: 100,
      imageContrast: 100,
      overlayTitle: '',
      overlayPosition: 'bottom-left',
      overlaySize: 'medium',
      overlayColor: '#FFFFFF',
      ...extraFieldsForPlatform(id, content),
    };
  });
}

export function generateAudienceSuggestions() {
  return {
    primary: 'Men aged 24-40 interested in premium fashion accessories',
    secondary: 'Gift shoppers aged 25-45 looking for luxury presents',
    interests: ['Luxury fashion', 'Minimalist lifestyle', 'Premium accessories', 'Gift giving'],
    locations: ['United States', 'United Kingdom', 'Canada', 'Australia'],
  };
}

const AD_PLATFORM_PROFILES = {
  'meta-ads': {
    name: 'Meta Ads',
    avgCpc: 1.35,
    avgCpm: 11.8,
    suggestedDaily: 85,
    location: 'United States, Canada, UK',
    ageMin: 25,
    ageMax: 44,
    gender: 'All',
    interests: 'Premium fashion, lifestyle, gift buyers',
    customerType: 'New + Retargeting',
    device: 'Mobile-first',
    languages: 'English',
    aiNote: 'Meta performs best with broad interest stacks plus lookalike purchasers.',
  },
  'google-ads': {
    name: 'Google Ads',
    avgCpc: 2.15,
    avgCpm: 18.4,
    suggestedDaily: 70,
    location: 'United States',
    ageMin: 28,
    ageMax: 50,
    gender: 'All',
    interests: 'High-intent shoppers, brand + product search',
    customerType: 'High-intent',
    device: 'All devices',
    languages: 'English',
    aiNote: 'Google works well for purchase-intent keywords and Shopping placements.',
  },
  'tiktok-ads': {
    name: 'TikTok Ads',
    avgCpc: 0.95,
    avgCpm: 8.6,
    suggestedDaily: 55,
    location: 'United States, Canada',
    ageMin: 22,
    ageMax: 38,
    gender: 'All',
    interests: 'Trend-led lifestyle, unboxing, style discovery',
    customerType: 'New',
    device: 'Mobile only',
    languages: 'English',
    aiNote: 'TikTok favors short-form creative with strong hook in the first 2 seconds.',
  },
  'microsoft-ads': {
    name: 'Microsoft Ads',
    avgCpc: 1.75,
    avgCpm: 14.2,
    suggestedDaily: 45,
    location: 'United States, UK, Australia',
    ageMin: 30,
    ageMax: 52,
    gender: 'All',
    interests: 'Professional buyers, premium accessories, LinkedIn overlap',
    customerType: 'New + Returning',
    device: 'Desktop + Mobile',
    languages: 'English',
    aiNote: 'Microsoft often delivers lower CPC for professional and premium audiences.',
  },
};

export function generatePlatformAudienceSuggestions(platformIds = [], objective = 'Sales') {
  return platformIds.map((id) => {
    const profile = AD_PLATFORM_PROFILES[id];
    if (!profile) return null;
    return {
      platformId: id,
      platformName: profile.name,
      location: profile.location,
      ageMin: profile.ageMin,
      ageMax: profile.ageMax,
      gender: profile.gender,
      interests: profile.interests,
      customerType: profile.customerType,
      device: profile.device,
      languages: profile.languages,
      aiNote: profile.aiNote,
      objective,
    };
  }).filter(Boolean);
}

export function generatePlatformBudgetPlan(platformIds = [], objective = 'Sales') {
  const platforms = platformIds
    .map((id) => {
      const profile = AD_PLATFORM_PROFILES[id];
      if (!profile) return null;
      return { id, profile };
    })
    .filter(Boolean);

  const totalSuggestedDaily = platforms.reduce((sum, item) => sum + item.profile.suggestedDaily, 0);

  const platformPlans = platforms.map(({ id, profile }) => {
    const allocationPct = Math.round((profile.suggestedDaily / totalSuggestedDaily) * 100);
    return {
      platformId: id,
      platformName: profile.name,
      dailyBudget: profile.suggestedDaily,
      avgCpc: profile.avgCpc,
      avgCpm: profile.avgCpm,
      allocationPct,
      estReach: `${Math.round(profile.suggestedDaily * 180)}-${Math.round(profile.suggestedDaily * 260)}`,
      estClicks: `${Math.round((profile.suggestedDaily / profile.avgCpc) * 0.65)}-${Math.round((profile.suggestedDaily / profile.avgCpc) * 0.95)}`,
    };
  });

  const totalDaily = platformPlans.reduce((sum, p) => sum + p.dailyBudget, 0);

  return {
    startDate: '2026-08-20',
    endDate: '2026-09-20',
    totalDaily,
    totalCampaign: totalDaily * 30,
    platforms: platformPlans,
    aiNote: `${objective} campaigns usually perform best when higher-intent platforms (Google, Microsoft) get steady budget while Meta/TikTok drive discovery.`,
  };
}

export function generateAIAnalystResponse(question) {
  const responses = {
    default: {
      explanation: 'Based on your recent performance data, I\'ve identified several key trends affecting your marketing outcomes.',
      metrics: [
        { label: 'ROAS Change', value: '-8.3%', trend: 'down' },
        { label: 'CPA Change', value: '+12.1%', trend: 'up' },
        { label: 'Conversion Rate', value: '-4.2%', trend: 'down' },
      ],
      recommendations: [
        'Review underperforming ad creatives and pause fatiguing assets',
        'Reallocate 15% budget from Meta to Google Shopping',
        'Test new lifestyle-focused creative variants',
      ],
      actions: [
        { label: 'Pause Creative C', type: 'danger' },
        { label: 'Move 15% budget to Google', type: 'primary' },
        { label: 'Generate new Meta creatives', type: 'secondary' },
      ],
    },
    roas: {
      explanation: 'ROAS decreased mainly because Meta CPA increased by 21% while conversion rate dropped 13%. Creative fatigue on Variant C is the primary driver, with frequency reaching 4.2x on core audiences.',
      metrics: [
        { label: 'Meta CPA', value: '+21%', trend: 'up' },
        { label: 'Conversion Rate', value: '-13%', trend: 'down' },
        { label: 'Creative Frequency', value: '4.2x', trend: 'up' },
      ],
      recommendations: [
        'Pause Creative Variant C immediately — CTR dropped 34% over 7 days',
        'Move 15% budget to Google Shopping where ROAS is 6.8x',
        'Launch 2 new lifestyle creative variants for Meta retargeting',
      ],
      actions: [
        { label: 'Pause Creative C', type: 'danger' },
        { label: 'Move 15% budget to Google Shopping', type: 'primary' },
        { label: 'Generate new Meta creatives', type: 'secondary' },
      ],
    },
    launch: {
      explanation: 'Before you launch or scale, AI Guardian is flagging listing gaps that can block marketplaces and ads. Resolve those first, then put budget behind products with healthy images, attributes, and inventory.',
      metrics: [
        { label: 'Open issues', value: '12', trend: 'up' },
        { label: 'Errors', value: '5', trend: 'up' },
        { label: 'Warnings', value: '7', trend: 'neutral' },
      ],
      recommendations: [
        'Open AI Guardian from the left sidebar to review errors and warnings',
        'Fix missing attributes, low-quality images, and out-of-stock listings first',
        'Then start or scale campaigns on products that are ready to publish',
      ],
      actions: [
        { label: 'Open AI Guardian', type: 'primary' },
      ],
    },
    budget: {
      explanation: 'The Classic Leather Wallet and Premium Watch Strap show the strongest ROAS-to-margin ratio. Increasing budget on these products by 20% could yield an estimated $12,400 additional revenue.',
      metrics: [
        { label: 'Top Product ROAS', value: '7.2x', trend: 'up' },
        { label: 'Margin', value: '62%', trend: 'up' },
        { label: 'Inventory Days', value: '45', trend: 'neutral' },
      ],
      recommendations: [
        'Increase Classic Leather Wallet campaign budget by 20%',
        'Create dedicated retargeting for cart abandoners',
        'Cross-sell Premium Watch Strap in post-purchase emails',
      ],
      actions: [
        { label: 'Increase wallet budget +20%', type: 'primary' },
        { label: 'Create retargeting campaign', type: 'secondary' },
        { label: 'View product analytics', type: 'ghost' },
      ],
    },
  };

  const q = question.toLowerCase();
  if (q.includes('roas')) return responses.roas;
  if (q.includes('guardian') || q.includes('issue') || q.includes('fix') || q.includes('launch') || q.includes('error')) {
    return responses.launch;
  }
  if (q.includes('budget') || q.includes('product')) return responses.budget;
  return responses.default;
}
