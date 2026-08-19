export const FACEBOOK_CTAS = ['Shop Now', 'Learn More', 'Sign Up', 'Send Message', 'Book Now', 'Contact Us'];
export const LINKEDIN_VISIBILITY = ['Anyone', 'Connections only', 'Group members'];
export const X_REPLY = ['Everyone', 'Accounts you follow', 'Verified accounts', 'Only mentions'];

export function cleanText(value) {
  if (value == null) return '';
  let text = String(value);
  try {
    text = decodeURIComponent(text);
  } catch {
    /* already decoded */
  }
  return text.replace(/%20/gi, ' ').replace(/\s+/g, ' ').trim();
}

function asList(value, joiner = ' ') {
  if (Array.isArray(value)) return value.map(cleanText).filter(Boolean).join(joiner);
  return cleanText(value);
}

function matchOption(value, options, fallback) {
  const raw = cleanText(value);
  if (!raw) return fallback || options[0];
  const lower = raw.toLowerCase();
  const exact = options.find((opt) => opt.toLowerCase() === lower);
  if (exact) return exact;
  const contained = options.find((opt) => lower.includes(opt.toLowerCase()));
  return contained || fallback || options[0];
}

function slugify(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'classic-leather-wallet';
}

export function extraFieldsForPlatform(id, content = {}) {
  const title = cleanText(content.title) || 'Classic Leather Wallet — Handcrafted Excellence';
  const short = cleanText(content.shortDescription) || 'Premium leather wallet with RFID protection.';
  const description = cleanText(content.description) || short;
  const social = cleanText(content.socialCaption) || short;
  const seoTitle = cleanText(content.seoTitle) || title;
  const seoMeta = cleanText(content.seoMetaDescription) || short;
  const category = cleanText(content.category) || 'Fashion Accessories';
  const color = cleanText(content.color);
  const material = cleanText(content.material);
  const ctaRaw = cleanText(content.cta) || 'Shop Now';
  const hashtags = asList(content.hashtags);
  const tags = asList(content.tags, ', ');
  const keywords = asList(content.keywords, ', ');
  const headline = (cleanText(title.replace(/^Nova\s+/i, '').split('—')[0]) || title).slice(0, 60);
  const handle = slugify(headline);
  const url = `https://novacommerce.com/products/${handle}`;
  const facebookCta = matchOption(ctaRaw, FACEBOOK_CTAS, 'Shop Now');

  switch (id) {
    case 'facebook':
      return {
        primaryText: social,
        headline: seoTitle.split('|')[0].trim().slice(0, 40) || headline.slice(0, 40),
        linkDescription: seoMeta.slice(0, 90),
        destinationUrl: url,
        cta: facebookCta,
        audience: 'Public',
      };
    case 'instagram':
      return {
        caption: hashtags ? `${social}\n\n${hashtags}` : social,
        location: 'Nova Studio · New York',
        firstComment: hashtags || '#NovaCommerce #MensFashion',
        productTag: headline,
        altText: [short, color && `Color: ${color}`, material && `Material: ${material}`].filter(Boolean).join('. '),
        hideLikeCount: 'Off',
      };
    case 'linkedin':
      return {
        postText: [
          `${title} is now available.`,
          '',
          description,
          '',
          hashtags,
        ].filter(Boolean).join('\n'),
        headline: seoTitle.split('|')[0].trim() || headline,
        visibility: 'Anyone',
        commentControl: 'Anyone',
        cta: matchOption(ctaRaw, ['Learn more', 'Apply', 'Sign up', 'Subscribe', 'Register'], 'Learn more'),
      };
    case 'tiktok':
      return {
        caption: `${social.split('.')[0]}. Wait till the end 👀\n${hashtags}`.trim(),
        sound: 'Original sound — Nova Commerce',
        cover: '0:02',
        allowComments: 'On',
        allowDuet: 'On',
      };
    case 'x':
      return {
        tweet: `${social.slice(0, 220)}${hashtags ? `\n${hashtags.split(' ').slice(0, 3).join(' ')}` : ''}`.trim(),
        replySetting: 'Everyone',
        linkTitle: headline,
        linkUrl: url,
      };
    case 'pinterest':
      return {
        pinTitle: headline,
        description: `${short} ${hashtags}`.trim(),
        destinationUrl: url,
        board: category,
        altText: short,
      };
    case 'shopify':
    case 'woocommerce':
      return {
        productTitle: headline,
        price: '$89.99',
        compareAt: '$109.00',
        description,
        vendor: 'Nova Commerce',
        productType: category,
        tags: tags || 'leather, wallet, premium',
        sku: 'CLW-001',
        inventory: '342',
        seoHandle: handle,
      };
    case 'amazon':
    case 'amazon-seller':
      return {
        listingTitle: `${headline} | ${material || 'Full-Grain Leather'} | ${color || 'RFID Protected'}`.slice(0, 200),
        bullets: (content.highlights || [
          'Full-grain genuine leather with RFID blocking',
          'Slim 0.4" profile fits any pocket',
          '8 card slots plus bill compartment',
          'Lifetime craftsmanship warranty',
          'Gift-ready packaging included',
        ]).map(cleanText).join('\n'),
        price: '$89.99',
        brand: 'Nova Commerce',
        searchTerms: keywords || 'leather wallet, rfid wallet, mens wallet',
        category,
      };
    case 'walmart':
    case 'daraz':
    case 'alibaba':
      return {
        listingTitle: headline,
        shortDescription: short,
        description,
        price: '$89.99',
        stock: '342',
        brand: 'Nova Commerce',
        category,
      };
    default:
      return { caption: social, cta: facebookCta };
  }
}

export function getReviewFields(id) {
  switch (id) {
    case 'facebook':
      return [
        { key: 'primaryText', label: 'Primary text', type: 'textarea', rows: 4, hint: 'Shown above the image in Feed' },
        { key: 'headline', label: 'Headline', type: 'text', hint: 'Max 40 characters recommended' },
        { key: 'linkDescription', label: 'News feed link description', type: 'text' },
        { key: 'destinationUrl', label: 'Website URL', type: 'text' },
        { key: 'cta', label: 'Call to action button', type: 'select', options: FACEBOOK_CTAS },
        { key: 'audience', label: 'Audience', type: 'select', options: ['Public', 'Friends', 'Specific audience'] },
      ];
    case 'instagram':
      return [
        { key: 'caption', label: 'Caption', type: 'textarea', rows: 5, hint: 'Up to 2,200 characters · hashtags in first comment perform better' },
        { key: 'firstComment', label: 'First comment', type: 'text', hint: 'Auto-post hashtags here' },
        { key: 'location', label: 'Location', type: 'text' },
        { key: 'productTag', label: 'Product tag', type: 'text' },
        { key: 'altText', label: 'Alt text', type: 'textarea', rows: 2 },
        { key: 'hideLikeCount', label: 'Hide like count', type: 'select', options: ['Off', 'On'] },
      ];
    case 'linkedin':
      return [
        { key: 'postText', label: 'Post', type: 'textarea', rows: 5, hint: 'Professional tone · ~150 words' },
        { key: 'headline', label: 'Article / link headline', type: 'text' },
        { key: 'visibility', label: 'Who can see this', type: 'select', options: LINKEDIN_VISIBILITY },
        { key: 'commentControl', label: 'Who can comment', type: 'select', options: ['Anyone', 'Connections only', 'No one'] },
        { key: 'cta', label: 'Link button', type: 'select', options: ['Learn more', 'Apply', 'Sign up', 'Subscribe', 'Register'] },
      ];
    case 'tiktok':
      return [
        { key: 'caption', label: 'Caption', type: 'textarea', rows: 3, hint: 'Hook in the first line' },
        { key: 'sound', label: 'Sound', type: 'text' },
        { key: 'cover', label: 'Cover timestamp', type: 'text' },
        { key: 'allowComments', label: 'Allow comments', type: 'select', options: ['On', 'Off'] },
        { key: 'allowDuet', label: 'Allow Duet & Stitch', type: 'select', options: ['On', 'Off'] },
      ];
    case 'x':
      return [
        { key: 'tweet', label: 'Post', type: 'textarea', rows: 4, hint: '280 character limit' },
        { key: 'replySetting', label: 'Who can reply', type: 'select', options: X_REPLY },
        { key: 'linkTitle', label: 'Link card title', type: 'text' },
        { key: 'linkUrl', label: 'Link', type: 'text' },
      ];
    case 'pinterest':
      return [
        { key: 'pinTitle', label: 'Pin title', type: 'text', hint: '100 characters or less' },
        { key: 'description', label: 'Description', type: 'textarea', rows: 4 },
        { key: 'destinationUrl', label: 'Destination URL', type: 'text' },
        { key: 'board', label: 'Board', type: 'text' },
        { key: 'altText', label: 'Alt text', type: 'text' },
      ];
    case 'shopify':
    case 'woocommerce':
      return [
        { key: 'productTitle', label: 'Product title', type: 'text' },
        { key: 'price', label: 'Price', type: 'text' },
        { key: 'compareAt', label: 'Compare-at price', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea', rows: 4 },
        { key: 'vendor', label: 'Vendor', type: 'text' },
        { key: 'productType', label: 'Product type', type: 'text' },
        { key: 'tags', label: 'Tags', type: 'text' },
        { key: 'sku', label: 'SKU', type: 'text' },
        { key: 'inventory', label: 'Inventory', type: 'text' },
        { key: 'seoHandle', label: 'URL handle', type: 'text' },
      ];
    case 'amazon':
    case 'amazon-seller':
      return [
        { key: 'listingTitle', label: 'Product title', type: 'textarea', rows: 2, hint: 'Front-load brand and key attributes' },
        { key: 'bullets', label: 'Bullet points', type: 'textarea', rows: 6, hint: 'One benefit per line' },
        { key: 'price', label: 'Price', type: 'text' },
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'category', label: 'Browse node / category', type: 'text' },
        { key: 'searchTerms', label: 'Backend search terms', type: 'textarea', rows: 2 },
      ];
    case 'walmart':
    case 'daraz':
    case 'alibaba':
      return [
        { key: 'listingTitle', label: 'Listing title', type: 'text' },
        { key: 'shortDescription', label: 'Short description', type: 'textarea', rows: 2 },
        { key: 'description', label: 'Full description', type: 'textarea', rows: 4 },
        { key: 'price', label: 'Price', type: 'text' },
        { key: 'stock', label: 'Stock', type: 'text' },
        { key: 'brand', label: 'Brand', type: 'text' },
        { key: 'category', label: 'Category', type: 'text' },
      ];
    default:
      return [
        { key: 'caption', label: 'Caption', type: 'textarea', rows: 5 },
        { key: 'cta', label: 'Call to action', type: 'text' },
      ];
  }
}
