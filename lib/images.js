export function getPlaceholderImage(type = 'product', index = 0) {
  const colors = [
    ['#6366F1', '#8B5CF6'],
    ['#8B5CF6', '#06B6D4'],
    ['#06B6D4', '#10B981'],
    ['#F59E0B', '#EF4444'],
    ['#111827', '#374151'],
  ];
  const [c1, c2] = colors[index % colors.length];
  const label = type === 'product' ? 'Product' : type === 'ad' ? 'Creative' : 'Asset';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${c1}"/>
        <stop offset="100%" style="stop-color:${c2}"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#g)"/>
    <rect x="80" y="120" width="240" height="160" rx="12" fill="rgba(255,255,255,0.15)"/>
    <text x="200" y="210" text-anchor="middle" fill="white" font-family="system-ui" font-size="18" font-weight="600">${label}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const productImages = {
  '/images/product-wallet.jpg': getPlaceholderImage('product', 0),
  '/images/product-strap.jpg': getPlaceholderImage('product', 1),
  '/images/product-cardholder.jpg': getPlaceholderImage('product', 2),
  '/images/product-passport.jpg': getPlaceholderImage('product', 3),
  '/images/product-belt.jpg': getPlaceholderImage('product', 4),
  '/images/product-keys.jpg': getPlaceholderImage('product', 5),
  '/images/ad-square.jpg': getPlaceholderImage('ad', 0),
  '/images/ad-vertical.jpg': getPlaceholderImage('ad', 1),
};

export function resolveImage(src) {
  return productImages[src] || src || getPlaceholderImage('product');
}
