'use client';

import Select from '@/components/ui/Select';
import { CROP_PRESETS, IMAGE_FILTERS } from '@/lib/studio-edit';
import { FlipHorizontal, FlipVertical, RotateCcw, RotateCw, Type } from 'lucide-react';

function ToolSection({ title, children }) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function RangeControl({ label, value, min, max, unit = '', onChange }) {
  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label className="text-xs font-medium text-text-secondary">{label}</label>
        <span className="shrink-0 rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-text-muted">
          {value}{unit}
        </span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="range-brand w-full" />
    </div>
  );
}

export default function StudioImageEditor({ draft, onChange, onReset }) {
  const update = (patch) => onChange(patch);

  return (
    <div className="card h-fit space-y-5 overflow-hidden p-5">
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h4 className="text-sm font-semibold text-text-primary">Image tools</h4>
          <p className="text-xs text-text-muted">Crop, color, filters, and overlay</p>
        </div>
        <button type="button" onClick={onReset} className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:bg-gray-50">
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      <ToolSection title="Crop">
        <div className="flex flex-wrap gap-2">
          {CROP_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => update({ cropPreset: preset })}
              className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${draft.cropPreset === preset ? 'border-brand-primary bg-brand-gradient-subtle text-brand-primary' : 'border-gray-200 text-text-secondary'}`}
            >
              {preset === 'original' ? 'Free' : preset}
            </button>
          ))}
        </div>
        <RangeControl label="Zoom" value={draft.imageScale ?? 100} min={80} max={180} unit="%" onChange={(v) => update({ imageScale: v })} />
        <div className="grid grid-cols-2 gap-3">
          <RangeControl label="Move X" value={draft.imageOffsetX ?? 0} min={-80} max={80} onChange={(v) => update({ imageOffsetX: v })} />
          <RangeControl label="Move Y" value={draft.imageOffsetY ?? 0} min={-80} max={80} onChange={(v) => update({ imageOffsetY: v })} />
        </div>
      </ToolSection>

      <ToolSection title="Transform">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => update({ rotate: ((draft.rotate || 0) - 90 + 360) % 360 })} className="btn-secondary py-1.5 text-xs">
            <RotateCcw className="h-3.5 w-3.5" /> Left
          </button>
          <button type="button" onClick={() => update({ rotate: ((draft.rotate || 0) + 90) % 360 })} className="btn-secondary py-1.5 text-xs">
            <RotateCw className="h-3.5 w-3.5" /> Right
          </button>
          <button type="button" onClick={() => update({ flipH: !draft.flipH })} className="btn-secondary py-1.5 text-xs">
            <FlipHorizontal className="h-3.5 w-3.5" /> Flip H
          </button>
          <button type="button" onClick={() => update({ flipV: !draft.flipV })} className="btn-secondary py-1.5 text-xs">
            <FlipVertical className="h-3.5 w-3.5" /> Flip V
          </button>
        </div>
      </ToolSection>

      <ToolSection title="Filters">
        <div className="grid grid-cols-3 gap-2">
          {IMAGE_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => update({ filter: filter.id, ...filter.patch })}
              className={`rounded-lg border px-2 py-2 text-xs font-medium ${draft.filter === filter.id ? 'border-brand-primary bg-brand-gradient-subtle text-brand-primary' : 'border-gray-200 text-text-secondary'}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </ToolSection>

      <ToolSection title="Adjust">
        <div className="grid grid-cols-2 gap-3">
          <RangeControl label="Brightness" value={draft.imageBrightness ?? 100} min={50} max={150} unit="%" onChange={(v) => update({ imageBrightness: v })} />
          <RangeControl label="Contrast" value={draft.imageContrast ?? 100} min={50} max={160} unit="%" onChange={(v) => update({ imageContrast: v })} />
          <RangeControl label="Saturation" value={draft.saturation ?? 100} min={0} max={180} unit="%" onChange={(v) => update({ saturation: v })} />
          <RangeControl label="Warmth" value={draft.warmth ?? 0} min={-40} max={40} onChange={(v) => update({ warmth: v })} />
          <RangeControl label="Blur" value={draft.blur ?? 0} min={0} max={8} unit="px" onChange={(v) => update({ blur: v })} />
          <RangeControl label="Vignette" value={draft.vignette ?? 0} min={0} max={80} unit="%" onChange={(v) => update({ vignette: v })} />
        </div>
      </ToolSection>

      <ToolSection title="Text overlay">
        <div className="mb-1 flex items-center gap-2 text-text-muted">
          <Type className="h-3.5 w-3.5" />
          <span className="text-xs">Add title on the image</span>
        </div>
        <input value={draft.overlayTitle || ''} onChange={(e) => update({ overlayTitle: e.target.value })} className="input text-sm" placeholder="e.g. Summer Collection" />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Position</label>
            <Select
              className="w-full"
              buttonClassName="px-2 py-2 text-xs"
              value={draft.overlayPosition || 'bottom-left'}
              onChange={(value) => update({ overlayPosition: value })}
              options={[
                { value: 'top-left', label: 'Top left' },
                { value: 'top-right', label: 'Top right' },
                { value: 'bottom-left', label: 'Bottom left' },
                { value: 'bottom-right', label: 'Bottom right' },
              ]}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Size</label>
            <Select
              className="w-full"
              buttonClassName="px-2 py-2 text-xs"
              value={draft.overlaySize || 'medium'}
              onChange={(value) => update({ overlaySize: value })}
              options={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' },
              ]}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-2">
          <input type="color" value={draft.overlayColor || '#FFFFFF'} onChange={(e) => update({ overlayColor: e.target.value })} className="h-9 w-9 cursor-pointer rounded-md border border-gray-200 bg-white p-0.5" />
          <p className="text-xs font-medium uppercase text-text-primary">{draft.overlayColor || '#FFFFFF'}</p>
        </div>
      </ToolSection>
    </div>
  );
}
