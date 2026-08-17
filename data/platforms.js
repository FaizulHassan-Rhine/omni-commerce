export const platforms = {
  social: [
    { id: 'facebook', name: 'Facebook', color: '#1877F2', category: 'social' },
    { id: 'instagram', name: 'Instagram', color: '#E4405F', category: 'social' },
    { id: 'linkedin', name: 'LinkedIn', color: '#0A66C2', category: 'social' },
    { id: 'tiktok', name: 'TikTok', color: '#000000', category: 'social' },
    { id: 'x', name: 'X', color: '#000000', category: 'social' },
    { id: 'pinterest', name: 'Pinterest', color: '#BD081C', category: 'social' },
    { id: 'youtube', name: 'YouTube', color: '#FF0000', category: 'social' },
  ],
  advertising: [
    { id: 'meta-ads', name: 'Meta Ads', color: '#1877F2', category: 'advertising' },
    { id: 'google-ads', name: 'Google Ads', color: '#4285F4', category: 'advertising' },
    { id: 'microsoft-ads', name: 'Microsoft Ads', color: '#00A4EF', category: 'advertising' },
    { id: 'tiktok-ads', name: 'TikTok Ads', color: '#000000', category: 'advertising' },
    { id: 'linkedin-ads', name: 'LinkedIn Ads', color: '#0A66C2', category: 'advertising' },
    { id: 'amazon-ads', name: 'Amazon Ads', color: '#FF9900', category: 'advertising' },
    { id: 'youtube-ads', name: 'YouTube Ads', color: '#FF0000', category: 'advertising' },
    { id: 'pinterest-ads', name: 'Pinterest Ads', color: '#BD081C', category: 'advertising' },
    { id: 'x-ads', name: 'X Ads', color: '#000000', category: 'advertising' },
  ],
  commerce: [
    { id: 'shopify', name: 'Shopify', color: '#96BF48', category: 'commerce' },
    { id: 'woocommerce', name: 'WooCommerce', color: '#96588A', category: 'commerce' },
    { id: 'amazon-seller', name: 'Amazon Seller', color: '#FF9900', category: 'commerce' },
    { id: 'walmart', name: 'Walmart', color: '#0071CE', category: 'commerce' },
    { id: 'daraz', name: 'Daraz', color: '#F85606', category: 'commerce' },
    { id: 'alibaba', name: 'Alibaba', color: '#FF6A00', category: 'commerce' },
  ],
  publishing: [
    { id: 'facebook', name: 'Facebook', color: '#1877F2' },
    { id: 'instagram', name: 'Instagram', color: '#E4405F' },
    { id: 'linkedin', name: 'LinkedIn', color: '#0A66C2' },
    { id: 'tiktok', name: 'TikTok', color: '#000000' },
    { id: 'x', name: 'X', color: '#000000' },
    { id: 'pinterest', name: 'Pinterest', color: '#BD081C' },
    { id: 'shopify', name: 'Shopify', color: '#96BF48' },
    { id: 'woocommerce', name: 'WooCommerce', color: '#96588A' },
    { id: 'amazon', name: 'Amazon', color: '#FF9900' },
    { id: 'walmart', name: 'Walmart', color: '#0071CE' },
    { id: 'daraz', name: 'Daraz', color: '#F85606' },
    { id: 'alibaba', name: 'Alibaba', color: '#FF6A00' },
  ],
};

export const platformCreativeSpecs = {
  facebook: { aspect: '1:1', aspectClass: 'aspect-square', label: 'Feed 1:1', preferred: 'image' },
  instagram: { aspect: '4:5', aspectClass: 'aspect-[4/5]', label: 'Feed 4:5', preferred: 'image' },
  linkedin: { aspect: '1.91:1', aspectClass: 'aspect-[1.91/1]', label: 'Landscape 1.91:1', preferred: 'image' },
  tiktok: { aspect: '9:16', aspectClass: 'aspect-[9/16]', label: 'Vertical 9:16', preferred: 'video' },
  x: { aspect: '16:9', aspectClass: 'aspect-video', label: 'Landscape 16:9', preferred: 'image' },
  pinterest: { aspect: '2:3', aspectClass: 'aspect-[2/3]', label: 'Pin 2:3', preferred: 'image' },
  youtube: { aspect: '16:9', aspectClass: 'aspect-video', label: 'Video 16:9', preferred: 'video' },
  shopify: { aspect: '1:1', aspectClass: 'aspect-square', label: 'Product 1:1', preferred: 'image' },
  woocommerce: { aspect: '1:1', aspectClass: 'aspect-square', label: 'Product 1:1', preferred: 'image' },
  amazon: { aspect: '1:1', aspectClass: 'aspect-square', label: 'Listing 1:1', preferred: 'image' },
  walmart: { aspect: '1:1', aspectClass: 'aspect-square', label: 'Listing 1:1', preferred: 'image' },
  daraz: { aspect: '1:1', aspectClass: 'aspect-square', label: 'Listing 1:1', preferred: 'image' },
  alibaba: { aspect: '1:1', aspectClass: 'aspect-square', label: 'Listing 1:1', preferred: 'image' },
};

export const allPlatforms = [
  ...platforms.social,
  ...platforms.advertising,
  ...platforms.commerce,
];

export function getPlatform(id) {
  return (
    allPlatforms.find((p) => p.id === id) ||
    platforms.publishing.find((p) => p.id === id) ||
    { id, name: id, color: '#6366F1' }
  );
}

export function getPlatformCreativeSpec(id) {
  return platformCreativeSpecs[id] || {
    aspect: '1:1',
    aspectClass: 'aspect-square',
    label: 'Square 1:1',
    preferred: 'image',
  };
}
