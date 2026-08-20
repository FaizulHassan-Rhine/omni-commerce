import { catalogIssues } from '@/data/catalog-issues';
import { campaigns } from '@/data/campaigns';
import { products } from '@/data/products';
import { commerceIntelligence } from '@/data/analytics';

function productImage(name) {
  return products.find((p) => p.name === name)?.image || products[0]?.image;
}

function productHref(name) {
  const product = products.find((p) => p.name === name);
  return product ? `/catalog?product=${product.id}` : '/catalog';
}

export function getGuardianIssues() {
  const productItems = catalogIssues.map((issue) => ({
    id: issue.id,
    entityType: 'product',
    name: issue.product,
    href: productHref(issue.product),
    image: productImage(issue.product),
    severity: issue.severity === 'High' ? 'Error' : issue.severity === 'Medium' ? 'Warning' : 'Info',
    category: issue.category,
    issue: issue.issue,
    suggestedFix: issue.suggestedFix,
  }));

  const campaignItems = [];

  campaigns.forEach((campaign) => {
    if (campaign.roas > 0 && campaign.roas < 2.5) {
      campaignItems.push({
        id: `camp-roas-${campaign.id}`,
        entityType: 'campaign',
        name: campaign.name,
        href: `/campaigns/${campaign.id}`,
        image: products.find((p) => p.id === campaign.productId)?.image,
        severity: 'Error',
        category: 'Performance',
        issue: `ROAS is ${campaign.roas}x — below the 2.5x target.`,
        suggestedFix: 'Pause or refresh creatives and reallocate budget to higher-ROAS campaigns.',
      });
    }
    if (campaign.status === 'Needs Review') {
      campaignItems.push({
        id: `camp-review-${campaign.id}`,
        entityType: 'campaign',
        name: campaign.name,
        href: `/campaigns/${campaign.id}`,
        image: products.find((p) => p.id === campaign.productId)?.image,
        severity: 'Warning',
        category: 'Review',
        issue: 'Campaign needs review before continuing spend.',
        suggestedFix: 'Audit audience, creative fatigue, and daily budget before restarting.',
      });
    }
    if (campaign.status === 'Paused') {
      campaignItems.push({
        id: `camp-paused-${campaign.id}`,
        entityType: 'campaign',
        name: campaign.name,
        href: `/campaigns/${campaign.id}`,
        image: products.find((p) => p.id === campaign.productId)?.image,
        severity: 'Warning',
        category: 'Status',
        issue: 'Campaign is paused and not collecting conversions.',
        suggestedFix: 'Refresh creative, then relaunch with a tighter audience.',
      });
    }
    if (campaign.status === 'Draft') {
      campaignItems.push({
        id: `camp-draft-${campaign.id}`,
        entityType: 'campaign',
        name: campaign.name,
        href: `/campaigns/create`,
        image: products.find((p) => p.id === campaign.productId)?.image,
        severity: 'Info',
        category: 'Launch',
        issue: 'Draft campaign has not launched yet.',
        suggestedFix: 'Complete setup and publish when listings and creatives are ready.',
      });
    }
  });

  commerceIntelligence
    .filter((row) => row.recommendation === 'Reduce Spend' || row.recommendation === 'Restock')
    .forEach((row) => {
      campaignItems.push({
        id: `intel-${row.product}`,
        entityType: 'product',
        name: row.product,
        href: productHref(row.product),
        image: productImage(row.product),
        severity: row.recommendation === 'Restock' ? 'Error' : 'Warning',
        category: row.recommendation === 'Restock' ? 'Inventory' : 'Spend',
        issue:
          row.recommendation === 'Restock'
            ? 'Out of stock — ads risk wasted spend.'
            : `Low ROAS (${row.roas}x) vs ad spend — reduce or refresh.`,
        suggestedFix:
          row.recommendation === 'Restock'
            ? 'Restock inventory or pause marketplace ads until available.'
            : 'Cut spend 20–30% and test new creatives before scaling again.',
      });
    });

  return [...productItems, ...campaignItems];
}

export function getGuardianCounts(issues) {
  return {
    error: issues.filter((i) => i.severity === 'Error').length,
    warning: issues.filter((i) => i.severity === 'Warning').length,
    info: issues.filter((i) => i.severity === 'Info').length,
    resolved: issues.filter((i) => i.resolved).length,
  };
}
