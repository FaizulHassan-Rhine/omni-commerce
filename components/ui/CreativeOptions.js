'use client';

import { cn } from '@/lib/utils';
import { Image, Video } from 'lucide-react';

export const CREATIVE_BACKGROUNDS = ['White studio', 'Luxury studio', 'Outdoor', 'Urban', 'Nature', 'Minimal', 'Custom prompt'];
export const CREATIVE_MODELS = ['No model', 'Male model', 'Female model', 'Lifestyle scene'];
export const CREATIVE_OUTPUT_COUNTS = [1, 2, 4];
export const DESCRIPTION_SIZES = ['Small', 'Medium', 'Large'];

export const defaultCreativeOptions = {
  background: 'White studio',
  model: 'No model',
  outputCount: 2,
  contentTypes: { image: true, video: false },
  descriptionSize: 'Medium',
};

function OptionChip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer',
        selected
          ? 'border-brand-primary bg-brand-gradient-subtle text-brand-primary'
          : 'border-gray-200 bg-white text-text-secondary hover:border-brand-primary/30'
      )}
    >
      {label}
    </button>
  );
}

function OptionGroup({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function ContentTypeCheckbox({ id, label, icon: Icon, checked, onChange }) {
  return (
    <label
      className={cn(
        'flex flex-1 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors',
        checked
          ? 'border-brand-primary bg-brand-gradient-subtle text-brand-primary'
          : 'border-gray-200 bg-white text-text-secondary hover:border-brand-primary/30'
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </label>
  );
}

export function formatContentTypes(contentTypes) {
  const types = [];
  if (contentTypes?.image) types.push('Image');
  if (contentTypes?.video) types.push('Video');
  return types.length ? types.join(' + ') : 'None';
}

export default function CreativeOptions({ value, onChange, className }) {
  const update = (key, val) => onChange({ ...value, [key]: val });

  const toggleContentType = (type, checked) => {
    const next = { ...value.contentTypes, [type]: checked };
    // Require at least one content type
    if (!next.image && !next.video) return;
    update('contentTypes', next);
  };

  return (
    <div className={cn('card space-y-4 h-fit', className)}>
      <div>
        <h3 className="font-semibold text-text-primary">Creative settings</h3>
        <p className="text-sm text-text-secondary mt-0.5">Configure content type, visuals, and description length.</p>
      </div>

      <div>
        <label className="label">Content type</label>
        <div className="flex gap-2">
          <ContentTypeCheckbox
            id="content-image"
            label="Image"
            icon={Image}
            checked={value.contentTypes?.image ?? true}
            onChange={(checked) => toggleContentType('image', checked)}
          />
          <ContentTypeCheckbox
            id="content-video"
            label="Video"
            icon={Video}
            checked={value.contentTypes?.video ?? false}
            onChange={(checked) => toggleContentType('video', checked)}
          />
        </div>
        <p className="mt-1.5 text-xs text-text-muted">Select image, video, or both.</p>
      </div>

      <OptionGroup label="Description size">
        {DESCRIPTION_SIZES.map((size) => (
          <OptionChip
            key={size}
            label={size}
            selected={value.descriptionSize === size}
            onClick={() => update('descriptionSize', size)}
          />
        ))}
      </OptionGroup>

      <OptionGroup label="Background">
        {CREATIVE_BACKGROUNDS.map((b) => (
          <OptionChip
            key={b}
            label={b}
            selected={value.background === b}
            onClick={() => update('background', b)}
          />
        ))}
      </OptionGroup>

      <OptionGroup label="Model">
        {CREATIVE_MODELS.map((m) => (
          <OptionChip
            key={m}
            label={m}
            selected={value.model === m}
            onClick={() => update('model', m)}
          />
        ))}
      </OptionGroup>

      <OptionGroup label="Output Count">
        {CREATIVE_OUTPUT_COUNTS.map((c) => (
          <OptionChip
            key={c}
            label={String(c)}
            selected={value.outputCount === c}
            onClick={() => update('outputCount', c)}
          />
        ))}
      </OptionGroup>
    </div>
  );
}
