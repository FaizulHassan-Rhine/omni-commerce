export const integrationPermissions = {
  social: ['Publish posts', 'Manage pages', 'Read analytics', 'Manage comments'],
  advertising: ['Create campaigns', 'Manage budgets', 'View analytics', 'Manage audiences'],
  commerce: ['Sync products', 'Manage inventory', 'Process orders', 'View analytics'],
};

export function getIntegrationSettingsFields(category) {
  const common = [
    { key: 'autoSync', label: 'Auto sync', type: 'toggle', description: 'Automatically sync data on a schedule.' },
    { key: 'syncFrequency', label: 'Sync frequency', type: 'select', options: ['Every 15 minutes', 'Every hour', 'Every 6 hours', 'Daily'] },
    { key: 'errorAlerts', label: 'Error alerts', type: 'toggle', description: 'Notify when sync or publish fails.' },
  ];

  if (category === 'social') {
    return [
      ...common,
      { key: 'autoPublish', label: 'Auto-publish approved posts', type: 'toggle', description: 'Publish content after approval without manual action.' },
      { key: 'defaultFormat', label: 'Default post format', type: 'select', options: ['Image', 'Video', 'Carousel', 'Link post'] },
      { key: 'utmTracking', label: 'UTM tracking', type: 'toggle', description: 'Append campaign UTM parameters to outbound links.' },
      { key: 'hashtagLibrary', label: 'Use brand hashtag library', type: 'toggle' },
    ];
  }

  if (category === 'advertising') {
    return [
      ...common,
      { key: 'budgetSync', label: 'Sync budget changes', type: 'toggle', description: 'Push budget updates from OmniCommerce to ad platforms.' },
      { key: 'conversionTracking', label: 'Conversion tracking', type: 'toggle' },
      { key: 'audienceSync', label: 'Audience sync', type: 'toggle', description: 'Keep retargeting audiences updated automatically.' },
      { key: 'reportingWindow', label: 'Reporting window', type: 'select', options: ['Last 7 days', 'Last 14 days', 'Last 30 days', 'Last 90 days'] },
    ];
  }

  return [
    ...common,
    { key: 'productSync', label: 'Product catalog sync', type: 'toggle' },
    { key: 'inventorySync', label: 'Inventory sync', type: 'toggle', description: 'Update stock levels across connected stores.' },
    { key: 'orderWebhooks', label: 'Order webhooks', type: 'toggle' },
    { key: 'priceRules', label: 'Price rule handling', type: 'select', options: ['Mirror source store', 'Apply markup', 'Manual review'] },
  ];
}

export function defaultIntegrationSettings(category) {
  const fields = getIntegrationSettingsFields(category);
  const settings = {};
  fields.forEach((field) => {
    if (field.type === 'toggle') settings[field.key] = true;
    else if (field.type === 'select') settings[field.key] = field.options[0];
  });
  return settings;
}
