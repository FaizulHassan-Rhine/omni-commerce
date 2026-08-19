import { getPlatform } from '@/data/platforms';
import { cleanText } from '@/lib/platform-review';

export const AD_PLATFORM_SPECS = {
  'meta-ads': { aspectClass: 'aspect-square', aspectLabel: 'Feed 1:1 · Facebook & Instagram', mediaType: 'image' },
  'google-ads': { aspectClass: 'aspect-[1.91/1]', aspectLabel: 'Display 1.91:1', mediaType: 'image' },
  'tiktok-ads': { aspectClass: 'aspect-[9/16]', aspectLabel: 'In-feed 9:16', mediaType: 'image' },
  'microsoft-ads': { aspectClass: 'aspect-[1.91/1]', aspectLabel: 'Audience 1.91:1', mediaType: 'image' },
};

export const META_AD_CTAS = ['Shop Now', 'Learn More', 'Sign Up', 'Get Offer', 'Book Now'];
export const GOOGLE_AD_CTAS = ['Shop now', 'Buy now', 'Learn more', 'Get quote', 'Sign up'];
export const TIKTOK_AD_CTAS = ['Shop Now', 'Learn More', 'Download', 'Sign Up'];
export const MICROSOFT_AD_CTAS = ['Shop now', 'Learn more', 'Get offer', 'Sign up'];

export function getCampaignReviewFields(platformId) {
  switch (platformId) {
    case 'meta-ads':
      return [
        { key: 'primaryText', label: 'Primary text', type: 'textarea', rows: 4 },
        { key: 'headline', label: 'Headline', type: 'text' },
        { key: 'linkDescription', label: 'Link description', type: 'text' },
        { key: 'destinationUrl', label: 'Destination URL', type: 'text' },
        { key: 'cta', label: 'Call to action', type: 'select', options: META_AD_CTAS },
        { key: 'placement', label: 'Placement', type: 'select', options: ['Facebook Feed', 'Instagram Feed', 'Stories', 'Reels'] },
      ];
    case 'google-ads':
      return [
        { key: 'headline', label: 'Headline', type: 'text', hint: 'Up to 30 characters recommended' },
        { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
        { key: 'displayPath', label: 'Display path', type: 'text' },
        { key: 'finalUrl', label: 'Final URL', type: 'text' },
        { key: 'cta', label: 'Call to action', type: 'select', options: GOOGLE_AD_CTAS },
      ];
    case 'tiktok-ads':
      return [
        { key: 'adText', label: 'Ad text', type: 'textarea', rows: 3 },
        { key: 'displayName', label: 'Display name', type: 'text' },
        { key: 'landingPageUrl', label: 'Landing page URL', type: 'text' },
        { key: 'cta', label: 'Call to action', type: 'select', options: TIKTOK_AD_CTAS },
      ];
    case 'microsoft-ads':
      return [
        { key: 'headline', label: 'Headline', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
        { key: 'finalUrl', label: 'Final URL', type: 'text' },
        { key: 'cta', label: 'Call to action', type: 'select', options: MICROSOFT_AD_CTAS },
      ];
    default:
      return [
        { key: 'headline', label: 'Headline', type: 'text' },
        { key: 'primaryText', label: 'Primary text', type: 'textarea', rows: 3 },
        { key: 'cta', label: 'Call to action', type: 'text' },
      ];
  }
}

function fieldsForPlatform(platformId, variant, campaign, audience, budgetItem) {
  const headline = cleanText(variant?.headline) || 'Premium Leather Wallet';
  const primaryText = cleanText(variant?.primaryText) || campaign?.primaryText || '';
  const cta = cleanText(variant?.cta) || 'Shop Now';
  const url = 'https://novacommerce.com/shop';

  const base = {
    headline,
    primaryText,
    cta,
    dailyBudget: budgetItem?.dailyBudget ? `$${budgetItem.dailyBudget}/day` : '',
    audienceSummary: audience
      ? `${audience.location} · ${audience.ageMin}-${audience.ageMax} · ${audience.interests}`
      : '',
  };

  switch (platformId) {
    case 'meta-ads':
      return {
        ...base,
        linkDescription: 'Handcrafted full-grain leather. Free shipping over $50.',
        destinationUrl: url,
        placement: 'Facebook Feed',
      };
    case 'google-ads':
      return {
        ...base,
        description: primaryText.slice(0, 90),
        displayPath: 'novacommerce.com/wallets',
        finalUrl: url,
        cta: 'Shop now',
      };
    case 'tiktok-ads':
      return {
        ...base,
        adText: primaryText.split('.')[0] || primaryText,
        displayName: 'Nova Commerce',
        landingPageUrl: url,
      };
    case 'microsoft-ads':
      return {
        ...base,
        description: primaryText.slice(0, 90),
        finalUrl: url,
        cta: 'Shop now',
      };
    default:
      return base;
  }
}

export function generateCampaignAds({
  platformIds = [],
  campaign,
  variant,
  platformAudiences = [],
  platformBudgetPlan,
  sourceImage,
}) {
  return platformIds.map((id) => {
    const platform = getPlatform(id);
    const spec = AD_PLATFORM_SPECS[id] || AD_PLATFORM_SPECS['meta-ads'];
    const audience = platformAudiences.find((item) => item.platformId === id);
    const budgetItem = platformBudgetPlan?.platforms?.find((item) => item.platformId === id);

    return {
      id,
      name: platform.name,
      aspectLabel: spec.aspectLabel,
      aspectClass: spec.aspectClass,
      mediaType: spec.mediaType,
      mediaUrl: sourceImage || campaign?.squareCreative,
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
      ...fieldsForPlatform(id, variant, campaign, audience, budgetItem),
    };
  });
}
