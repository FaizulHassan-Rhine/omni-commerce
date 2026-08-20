'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { platforms } from '@/data/platforms';
import PlatformIcon from '@/components/ui/PlatformIcon';
import { Check, ChevronDown, Image, Video } from 'lucide-react';

export const CREATIVE_BACKGROUNDS = ['White studio', 'Luxury studio', 'Outdoor', 'Urban', 'Nature', 'Minimal', 'Custom prompt'];
export const CREATIVE_MODELS = ['No model', 'Male model', 'Female model', 'Lifestyle scene'];
export const CREATIVE_OUTPUT_COUNTS = [1, 2, 4];
export const DESCRIPTION_SIZES = ['Small', 'Medium', 'Large'];
export const CREATIVE_PLATFORM_OPTIONS = [
  ...platforms.social,
  ...platforms.commerce.slice(0, 3),
];

export const defaultCreativeOptions = {
  background: 'White studio',
  model: 'No model',
  outputCount: 2,
  contentTypes: { image: true, video: false },
  descriptionSize: 'Medium',
  platforms: ['instagram', 'facebook', 'tiktok'],
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

function ContentTypeCheckbox({ label, icon: Icon, checked, onChange }) {
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

function PlatformDropdown({ value = [], onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selected = CREATIVE_PLATFORM_OPTIONS.filter((p) => value.includes(p.id));

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const toggle = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((item) => item !== id));
      return;
    }
    onChange([...value, id]);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-left text-sm',
          open && 'border-brand-primary ring-2 ring-brand-primary/15'
        )}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2 truncate text-text-primary">
          {selected.length === 0 ? (
            'Select platforms'
          ) : selected.length <= 2 ? (
            <>
              <span className="flex items-center -space-x-1">
                {selected.map((p) => (
                  <PlatformIcon key={p.id} platformId={p.id} size="sm" className="shadow-none ring-1 ring-white" />
                ))}
              </span>
              <span className="truncate">{selected.map((p) => p.name).join(', ')}</span>
            </>
          ) : (
            <>
              <span className="flex items-center -space-x-1">
                {selected.slice(0, 3).map((p) => (
                  <PlatformIcon key={p.id} platformId={p.id} size="sm" className="shadow-none ring-1 ring-white" />
                ))}
              </span>
              <span className="truncate">{selected.length} platforms selected</span>
            </>
          )}
        </span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-text-muted transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {CREATIVE_PLATFORM_OPTIONS.map((platform) => {
            const active = value.includes(platform.id);
            return (
              <li key={platform.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => toggle(platform.id)}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm',
                    active ? 'bg-brand-gradient-subtle text-brand-primary' : 'text-text-secondary hover:bg-gray-50'
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <PlatformIcon platformId={platform.id} size="sm" className="shadow-none" />
                    <span className="truncate">{platform.name}</span>
                  </span>
                  {active && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function formatContentTypes(contentTypes) {
  const types = [];
  if (contentTypes?.image) types.push('Image');
  if (contentTypes?.video) types.push('Video');
  return types.length ? types.join(' + ') : 'None';
}

export default function CreativeOptions({ value, onChange, className, mediaOnly = false }) {
  const update = (key, val) => onChange({ ...value, [key]: val });

  const toggleContentType = (type, checked) => {
    const next = { ...value.contentTypes, [type]: checked };
    if (!next.image && !next.video) return;
    update('contentTypes', next);
  };

  return (
    <div className={cn('card space-y-4 h-fit', className)}>
      <div>
        <h3 className="font-semibold text-text-primary">Creative settings</h3>
        <p className="text-sm text-text-secondary mt-0.5">
          {mediaOnly ? 'Choose image, video, or both, then tune the look.' : 'Configure content type, visuals, and description length.'}
        </p>
      </div>

      <div>
        <label className="label">Content type</label>
        <div className="flex gap-2">
          <ContentTypeCheckbox
            label="Image"
            icon={Image}
            checked={value.contentTypes?.image ?? true}
            onChange={(checked) => toggleContentType('image', checked)}
          />
          <ContentTypeCheckbox
            label="Video"
            icon={Video}
            checked={value.contentTypes?.video ?? false}
            onChange={(checked) => toggleContentType('video', checked)}
          />
        </div>
        <p className="mt-1.5 text-xs text-text-muted">Select image, video, or both.</p>
      </div>

      <div>
        <label className="label">Platform</label>
        <PlatformDropdown
          value={value.platforms || []}
          onChange={(platforms) => update('platforms', platforms)}
        />
        <p className="mt-1.5 text-xs text-text-muted">
          After generate, preview each platform size in the top tabs.
        </p>
      </div>

      {!mediaOnly && (
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
      )}

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
