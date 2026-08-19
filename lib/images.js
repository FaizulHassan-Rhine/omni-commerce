const productPhotos = [
  '/images/product-wallet.jpg',
  '/images/product-strap.jpg',
  '/images/product-cardholder.jpg',
  '/images/product-passport.jpg',
  '/images/product-belt.jpg',
  '/images/product-keys.jpg',
];

const adPhotos = [
  '/images/ad-square.jpg',
  '/images/ad-vertical.jpg',
];

export function getPlaceholderImage(type = 'product', index = 0) {
  const pool = type === 'ad' ? adPhotos : productPhotos;
  return pool[index % pool.length];
}

export const productImages = {
  '/images/product-wallet.jpg': '/images/product-wallet.jpg',
  '/images/product-strap.jpg': '/images/product-strap.jpg',
  '/images/product-cardholder.jpg': '/images/product-cardholder.jpg',
  '/images/product-passport.jpg': '/images/product-passport.jpg',
  '/images/product-belt.jpg': '/images/product-belt.jpg',
  '/images/product-keys.jpg': '/images/product-keys.jpg',
  '/images/ad-square.jpg': '/images/ad-square.jpg',
  '/images/ad-vertical.jpg': '/images/ad-vertical.jpg',
};

export function resolveImage(src) {
  return src || getPlaceholderImage('product');
}
