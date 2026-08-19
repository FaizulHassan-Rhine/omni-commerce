'use client';

import Select from '@/components/ui/Select';
import { RotateCcw, SlidersHorizontal, Type } from 'lucide-react';

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
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-brand w-full"
      />
    </div>
  );
}

export default function PostImageEditTools({ post, onChange, onReset }) {
  const update = (key, value) => onChange({ [key]: value });

  return (
    <div className="card h-fit min-w-0 overflow-hidden p-5 xl:sticky xl:top-24">
      <div className="mb-5 flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient-subtle">
            <SlidersHorizontal className="h-4 w-4 text-brand-primary" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary">Edit Tools</h4>
            <p className="text-xs text-text-muted">Fine-tune image before launch</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-text-primary"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      <div className="space-y-5">
        <ToolSection title="Image">
          <RangeControl
            label="Crop / zoom"
            value={post.imageScale ?? 100}
            min={80}
            max={150}
            unit="%"
            onChange={(v) => update('imageScale', v)}
          />
          <div className="grid grid-cols-2 gap-3">
            <RangeControl
              label="Move X"
              value={post.imageOffsetX ?? 0}
              min={-80}
              max={80}
              onChange={(v) => update('imageOffsetX', v)}
            />
            <RangeControl
              label="Move Y"
              value={post.imageOffsetY ?? 0}
              min={-80}
              max={80}
              onChange={(v) => update('imageOffsetY', v)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <RangeControl
              label="Brightness"
              value={post.imageBrightness ?? 100}
              min={60}
              max={140}
              unit="%"
              onChange={(v) => update('imageBrightness', v)}
            />
            <RangeControl
              label="Contrast"
              value={post.imageContrast ?? 100}
              min={60}
              max={140}
              unit="%"
              onChange={(v) => update('imageContrast', v)}
            />
          </div>
        </ToolSection>

        <div className="border-t border-gray-100 pt-5">
          <ToolSection title="Text overlay">
            <div className="mb-1 flex items-center gap-2 text-text-muted">
              <Type className="h-3.5 w-3.5" />
              <span className="text-xs">Add title directly on the image</span>
            </div>
            <input
              value={post.overlayTitle || ''}
              onChange={(e) => update('overlayTitle', e.target.value)}
              className="input text-sm"
              placeholder="e.g. Summer Collection"
            />
            <div className="grid min-w-0 grid-cols-2 gap-2">
              <div className="min-w-0">
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Position</label>
                <Select
                  className="w-full min-w-0"
                  buttonClassName="min-w-0 px-2 py-2 text-xs"
                  value={post.overlayPosition || 'bottom-left'}
                  onChange={(value) => update('overlayPosition', value)}
                  options={[
                    { value: 'top-left', label: 'Top left' },
                    { value: 'top-right', label: 'Top right' },
                    { value: 'bottom-left', label: 'Bottom left' },
                    { value: 'bottom-right', label: 'Bottom right' },
                  ]}
                  aria-label="Text position"
                />
              </div>
              <div className="min-w-0">
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Size</label>
                <Select
                  className="w-full min-w-0"
                  buttonClassName="min-w-0 px-2 py-2 text-xs"
                  value={post.overlaySize || 'medium'}
                  onChange={(value) => update('overlaySize', value)}
                  options={[
                    { value: 'small', label: 'Small' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'large', label: 'Large' },
                  ]}
                  aria-label="Text size"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Color</label>
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-2">
                <input
                  type="color"
                  value={post.overlayColor || '#FFFFFF'}
                  onChange={(e) => update('overlayColor', e.target.value)}
                  className="h-9 w-9 shrink-0 cursor-pointer rounded-md border border-gray-200 bg-white p-0.5"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase text-text-primary">{post.overlayColor || '#FFFFFF'}</p>
                  <p className="text-[10px] text-text-muted">Tap swatch to change</p>
                </div>
                <div
                  className="h-9 w-9 shrink-0 rounded-md border border-gray-200 shadow-inner"
                  style={{ backgroundColor: post.overlayColor || '#FFFFFF' }}
                />
              </div>
            </div>
          </ToolSection>
        </div>
      </div>
    </div>
  );
}
