export const landingNav = [
  { label: 'Product', href: '/#product' },
  { label: 'Solutions', href: '/#solutions' },
  { label: 'AI Tools', href: '/#ai-tools' },
  { label: 'Integrations', href: '/connections' },
  { label: 'Pricing', href: '/#pricing' },
];

export const mobileNav = [
  { href: '/dashboard', label: 'Home', match: ['/dashboard'] },
  { href: '/create/content', label: 'Create', match: ['/create'] },
  { href: '/campaigns', label: 'Campaigns', match: ['/campaigns'] },
  { href: '/analytics/performance', label: 'Analytics', match: ['/analytics'] },
  { href: '/connections', label: 'Connect', match: ['/connections'] },
];

export const dashboardNav = [
  { name: 'Overview', href: '/dashboard', icon: 'LayoutDashboard' },
  {
    name: 'Create',
    icon: 'Sparkles',
    children: [
      { name: 'AI Content', href: '/create/content' },
      { name: 'AI Campaign', href: '/create/campaign' },
    ],
  },
  {
    name: 'Catalog',
    icon: 'Package',
    children: [
      { name: 'Products', href: '/catalog' },
      { name: 'Catalog Intelligence', href: '/catalog/intelligence' },
      { name: 'Catalog Guardian', href: '/catalog/guardian' },
    ],
  },
  {
    name: 'Publishing',
    icon: 'Send',
    children: [
      { name: 'Social Publishing', href: '/publishing/social' },
      { name: 'Marketplace Publishing', href: '/publishing/marketplaces' },
      { name: 'Content Calendar', href: '/publishing/calendar' },
    ],
  },
  {
    name: 'Campaigns',
    icon: 'Megaphone',
    children: [
      { name: 'All Campaigns', href: '/campaigns' },
      { name: 'Create Campaign', href: '/campaigns/new' },
      { name: 'Creative Library', href: '/creatives' },
    ],
  },
  {
    name: 'Analytics',
    icon: 'BarChart3',
    children: [
      { name: 'Performance', href: '/analytics/performance' },
      { name: 'Creative Intelligence', href: '/analytics/creative-intelligence' },
      { name: 'Commerce Intelligence', href: '/analytics/commerce' },
      { name: 'AI Analyst', href: '/analytics/ai-analyst' },
    ],
  },
  {
    name: 'Workspace',
    icon: 'FolderOpen',
    children: [
      { name: 'Assets', href: '/assets' },
      { name: 'Approvals', href: '/approvals' },
      { name: 'Brand Kit', href: '/brand' },
    ],
  },
  { name: 'Connections', href: '/connections', icon: 'Plug' },
  { name: 'Settings', href: '/settings', icon: 'Settings' },
];

/** Route → page title for topbar breadcrumb */
export const routeTitles = {
  '/dashboard': { section: 'Overview', title: 'Dashboard' },
  '/create/content': { section: 'Create', title: 'AI Content' },
  '/create/campaign': { section: 'Create', title: 'AI Campaign' },
  '/catalog': { section: 'Catalog', title: 'Products' },
  '/catalog/intelligence': { section: 'Catalog', title: 'Catalog Intelligence' },
  '/catalog/guardian': { section: 'Catalog', title: 'Catalog Guardian' },
  '/publishing/social': { section: 'Publishing', title: 'Social Publishing' },
  '/publishing/marketplaces': { section: 'Publishing', title: 'Marketplace Publishing' },
  '/publishing/calendar': { section: 'Publishing', title: 'Content Calendar' },
  '/campaigns': { section: 'Campaigns', title: 'All Campaigns' },
  '/campaigns/new': { section: 'Campaigns', title: 'Create Campaign' },
  '/creatives': { section: 'Campaigns', title: 'Creative Library' },
  '/analytics/performance': { section: 'Analytics', title: 'Performance' },
  '/analytics/creative-intelligence': { section: 'Analytics', title: 'Creative Intelligence' },
  '/analytics/commerce': { section: 'Analytics', title: 'Commerce Intelligence' },
  '/analytics/ai-analyst': { section: 'Analytics', title: 'AI Analyst' },
  '/assets': { section: 'Workspace', title: 'Assets' },
  '/approvals': { section: 'Workspace', title: 'Approvals' },
  '/brand': { section: 'Workspace', title: 'Brand Kit' },
  '/connections': { section: 'Integrations', title: 'Connections' },
  '/settings': { section: 'Settings', title: 'Settings' },
};

export function isNavActive(pathname, href) {
  if (href === '/dashboard') return pathname === '/dashboard';
  if (href === '/catalog') return pathname === '/catalog' || pathname.startsWith('/catalog/');
  if (href === '/campaigns') return pathname === '/campaigns' || pathname.startsWith('/campaigns/');
  if (href === '/creatives') return pathname === '/creatives';
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

  if (pathname.startsWith('/catalog/products/')) {
    return { section: 'Catalog', title: 'Product Details' };
  }
  if (pathname.startsWith('/campaigns/') && pathname !== '/campaigns/new') {
    return { section: 'Campaigns', title: 'Campaign Details' };
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
