export const catalogIssues = [
  { id: 'issue-1', productId: 'prod-1', product: 'Classic Leather Wallet', issue: 'Material attribute missing', severity: 'Medium', suggestedFix: 'Genuine Leather', category: 'Attributes' },
  { id: 'issue-2', productId: 'prod-3', product: 'Minimalist Card Holder', issue: 'Low-quality main image', severity: 'High', suggestedFix: 'Regenerate with AI Content', category: 'Images' },
  { id: 'issue-3', productId: 'prod-3', product: 'Minimalist Card Holder', issue: 'SEO meta description too short', severity: 'Medium', suggestedFix: 'Expand to 150+ characters with keywords', category: 'SEO' },
  { id: 'issue-4', productId: 'prod-4', product: 'Travel Passport Cover', issue: 'Out of stock on Amazon', severity: 'High', suggestedFix: 'Restock inventory or pause listing', category: 'Inventory' },
  { id: 'issue-5', productId: 'prod-4', product: 'Travel Passport Cover', issue: 'Missing GTIN for Walmart', severity: 'Medium', suggestedFix: 'Add UPC: 123456789012', category: 'Channel' },
  { id: 'issue-6', productId: 'prod-2', product: 'Premium Watch Strap', issue: 'Incomplete product description', severity: 'Low', suggestedFix: 'Add sizing guide and compatibility info', category: 'Content' },
  { id: 'issue-7', productId: 'prod-5', product: 'Executive Belt', issue: 'Color variant images missing', severity: 'Medium', suggestedFix: 'Upload brown and tan variants', category: 'Images' },
  { id: 'issue-8', productId: 'prod-6', product: 'Key Organizer', issue: 'Daraz listing not optimized', severity: 'Low', suggestedFix: 'Adapt content for Daraz marketplace', category: 'Channel' },
];

export const catalogSummary = {
  totalProducts: 1284,
  needAttention: 197,
  missingAttributes: 56,
  lowQualityImages: 34,
  seoIssues: 21,
  channelIssues: 15,
};
