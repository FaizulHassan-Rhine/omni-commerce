export const landingNav = [
  { label: 'Product', href: '/#product' },
  { label: 'Solutions', href: '/#solutions' },
  { label: 'AI Tools', href: '/#ai-tools' },
  { label: 'Integrations', href: '/connections' },
  { label: 'Pricing', href: '/#pricing' },
];

export const mobileNav = [
  { href: '/dashboard', label: 'Overview', match: ['/dashboard'] },
  { href: '/catalog', label: 'Product', match: ['/catalog'] },
  { href: '/campaigns', label: 'Campaign', match: ['/campaigns'] },
  { href: '/create/content', label: 'Studio', match: ['/create', '/creatives', '/publishing'] },
  { href: '/analytics', label: 'Analytics', match: ['/analytics'] },
];

export const dashboardNav = [
  { name: 'Overview', href: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Product', href: '/catalog', icon: 'Package' },
  { name: 'Campaign', href: '/campaigns', icon: 'Megaphone' },
  { name: 'Content Studio', href: '/create/content', icon: 'Clapperboard' },
  { name: 'AI Guardian', href: '/guardian', icon: 'Shield', glow: true },
  { name: 'Analytics', href: '/analytics', icon: 'BarChart3' },
  { name: 'Integration', href: '/connections', icon: 'Plug' },
  { name: 'Setting', href: '/settings', icon: 'Settings' },
];

/** Route → page title for topbar breadcrumb */
export const routeTitles = {
  '/dashboard': { section: 'Overview', title: 'Dashboard' },
  '/create/content': { section: 'Content Studio', title: 'Content Studio' },
  '/create/content/new': { section: 'Content Studio', title: 'Create Content' },
  '/create/campaign': { section: 'Campaign', title: 'AI Campaign' },
  '/catalog': { section: 'Product', title: 'Products' },
  '/catalog/create': { section: 'Product', title: 'Create Product' },
  '/catalog/from-link': { section: 'Product', title: 'Create Product with Link' },
  '/catalog/intelligence': { section: 'Product', title: 'Catalog Intelligence' },
  '/guardian': { section: 'AI Guardian', title: 'AI Guardian' },
  '/publishing/social': { section: 'Content Studio', title: 'Social Publishing' },
  '/publishing/marketplaces': { section: 'Content Studio', title: 'Marketplace Publishing' },
  '/publishing/calendar': { section: 'Content Studio', title: 'Content Calendar' },
  '/campaigns': { section: 'Campaign', title: 'Campaigns' },
  '/campaigns/create': { section: 'Campaign', title: 'Create Campaign' },
  '/campaigns/new': { section: 'Campaign', title: 'Create Campaign' },
  '/creatives': { section: 'Content Studio', title: 'Creative Library' },
  '/analytics': { section: 'Analytics', title: 'Analytics' },
  '/analytics/performance': { section: 'Analytics', title: 'Analytics' },
  '/analytics/creative-intelligence': { section: 'Analytics', title: 'Creative Intelligence' },
  '/analytics/commerce': { section: 'Analytics', title: 'Commerce Intelligence' },
  '/analytics/ai-analyst': { section: 'Analytics', title: 'AI Analyst' },
  '/assets': { section: 'Content Studio', title: 'Assets' },
  '/brand': { section: 'Setting', title: 'Brand Kit' },
  '/connections': { section: 'Integration', title: 'Integrations' },
  '/settings': { section: 'Setting', title: 'Settings' },
};

export function isNavActive(pathname, href) {
  if (href === '/dashboard') return pathname === '/dashboard';
  if (href === '/catalog') return pathname === '/catalog' || pathname.startsWith('/catalog/');
  if (href === '/campaigns') {
    return pathname === '/campaigns' || pathname.startsWith('/campaigns/') || pathname.startsWith('/create/campaign');
  }
  if (href === '/create/content') {
    return (
      pathname.startsWith('/create/content') ||
      pathname.startsWith('/create/image') ||
      pathname.startsWith('/create/video') ||
      pathname.startsWith('/creatives') ||
      pathname.startsWith('/publishing') ||
      pathname.startsWith('/assets')
    );
  }
  if (href === '/guardian') return pathname === '/guardian' || pathname.startsWith('/guardian/');
  if (href === '/analytics') return pathname.startsWith('/analytics');
  if (href === '/connections') return pathname.startsWith('/connections');
  if (href === '/settings') return pathname.startsWith('/settings') || pathname.startsWith('/brand');
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isMobileNavActive(pathname, item) {
  return item.match.some((prefix) =>
    prefix === '/dashboard'
      ? pathname === '/dashboard'
      : pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function getRouteMeta(pathname) {
  if (routeTitles[pathname]) return routeTitles[pathname];

  if (pathname.startsWith('/create/content/edit/')) {
    return { section: 'Content Studio', title: 'Edit Content' };
  }
  if (pathname.startsWith('/catalog')) {
    return { section: 'Product', title: 'Products' };
  }
  if (pathname.startsWith('/campaigns/') && pathname !== '/campaigns/new' && pathname !== '/campaigns/create') {
    return { section: 'Campaign', title: 'Campaign Details' };
  }

  return { section: 'OmniCommerce AI', title: 'Dashboard' };
}

export function getFlatNavLinks() {
  const links = [];
  dashboardNav.forEach((item) => {
    if (item.href) links.push({ name: item.name, href: item.href });
    item.children?.forEach((child) => links.push({ name: child.name, href: child.href }));
  });
  return links;
}
