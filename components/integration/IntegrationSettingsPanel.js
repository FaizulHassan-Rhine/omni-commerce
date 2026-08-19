'use client';

import Select from '@/components/ui/Select';
import { getIntegrationSettingsFields } from '@/lib/integration-settings';

function ToggleRow({ field, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-gray-200 p-4">
      <div>
        <p className="text-sm font-medium text-text-primary">{field.label}</p>
        {field.description && <p className="mt-0.5 text-xs text-text-muted">{field.description}</p>}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-brand-primary"
      />
    </label>
  );
}

export default function IntegrationSettingsPanel({ platform, category, settings, onChange }) {
  const fields = getIntegrationSettingsFields(category);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
        <p className="text-sm font-medium text-text-primary">Connected account</p>
        <p className="mt-1 text-sm text-text-secondary">{platform.account}</p>
        <p className="mt-2 text-xs text-text-muted">
          Manage sync behavior, publishing defaults, and automation for {platform.name}.
        </p>
      </div>

      <div className="space-y-3">
        {fields.map((field) => {
          if (field.type === 'toggle') {
            return (
              <ToggleRow
                key={field.key}
                field={field}
                checked={!!settings[field.key]}
                onChange={(value) => onChange({ ...settings, [field.key]: value })}
              />
            );
          }

          if (field.type === 'select') {
            return (
              <div key={field.key}>
                <label className="label">{field.label}</label>
                <Select
                  value={settings[field.key] || field.options[0]}
                  onChange={(value) => onChange({ ...settings, [field.key]: value })}
                  options={field.options}
                  aria-label={field.label}
                />
                {field.description && <p className="mt-1 text-[11px] text-text-muted">{field.description}</p>}
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
