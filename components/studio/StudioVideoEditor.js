'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { formatTimecode, mediaPreviewStyle, VIDEO_FRAME_COUNT } from '@/lib/studio-edit';
import { resolveImage } from '@/lib/images';
import { Pause, Play, Plus, Scissors, Subtitles, Trash2 } from 'lucide-react';

function RangeControl({ label, value, min, max, unit = '', step = 1, onChange }) {
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs text-text-secondary">{label}</label>
        <span className="text-[10px] font-semibold text-text-muted">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="range-brand w-full" />
    </div>
  );
}

export default function StudioVideoEditor({ draft, onChange }) {
  const [playing, setPlaying] = useState(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState(null);
  const duration = draft.duration || 8;
  const trimStart = draft.trimStart ?? 0;
  const trimEnd = draft.trimEnd ?? duration;
  const currentTime = Math.min(Math.max(draft.currentTime ?? 0, trimStart), trimEnd);
  const frameIndex = Math.min(VIDEO_FRAME_COUNT - 1, Math.floor((currentTime / duration) * VIDEO_FRAME_COUNT));

  const frames = useMemo(
    () => Array.from({ length: VIDEO_FRAME_COUNT }, (_, i) => ({
      index: i,
      time: (i / VIDEO_FRAME_COUNT) * duration,
    })),
    [duration]
  );

  const onChangeRef = useRef(onChange);
  const draftRef = useRef(draft);
  onChangeRef.current = onChange;
  draftRef.current = draft;

  useEffect(() => {
    if (!playing) return undefined;
    const timer = setInterval(() => {
      const current = draftRef.current;
      const start = current.trimStart ?? 0;
      const end = current.trimEnd ?? current.duration ?? 8;
      const next = (current.currentTime || 0) + 0.1 * (current.playbackSpeed || 1);
      if (next >= end) {
        onChangeRef.current({ currentTime: start });
        setPlaying(false);
        return;
      }
      onChangeRef.current({ currentTime: next });
    }, 100);
    return () => clearInterval(timer);
  }, [playing]);

  const seekTo = (time) => {
    const clamped = Math.min(trimEnd, Math.max(trimStart, time));
    onChange({ currentTime: clamped });
  };

  const addSubtitle = () => {
    const start = Number(currentTime.toFixed(1));
    const clip = {
      id: `sub-${Date.now()}`,
      start,
      end: Math.min(duration, start + 2),
      text: 'Add subtitle',
    };
    onChange({ subtitles: [...(draft.subtitles || []), clip] });
    setSelectedSubtitle(clip.id);
  };

  const updateSubtitle = (id, patch) => {
    onChange({
      subtitles: (draft.subtitles || []).map((item) => (item.id === id ? { ...item, ...patch } : item)),
    });
  };

  const removeSubtitle = (id) => {
    onChange({ subtitles: (draft.subtitles || []).filter((item) => item.id !== id) });
    if (selectedSubtitle === id) setSelectedSubtitle(null);
  };

  const updateFrameCrop = (key, value) => {
    onChange({
      frameCrops: {
        ...(draft.frameCrops || {}),
        [frameIndex]: {
          imageScale: 100,
          imageOffsetX: 0,
          imageOffsetY: 0,
          ...(draft.frameCrops?.[frameIndex] || {}),
          [key]: value,
        },
      },
    });
  };

  const activeSubtitle = (draft.subtitles || []).find((item) => currentTime >= item.start && currentTime <= item.end);
  const selected = (draft.subtitles || []).find((item) => item.id === selectedSubtitle);
  const frameCrop = draft.frameCrops?.[frameIndex] || {};

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <div className="overflow-hidden rounded-2xl bg-black">
          <div className="relative mx-auto max-h-[52vh] overflow-hidden">
            <img
              src={resolveImage(draft.src)}
              alt=""
              className="mx-auto max-h-[52vh] w-full object-contain"
              style={mediaPreviewStyle(draft, frameIndex)}
            />
            {activeSubtitle && (
              <div className="pointer-events-none absolute inset-x-0 bottom-8 text-center">
                <span className="inline-block rounded-md bg-black/70 px-3 py-1.5 text-sm font-medium text-white">
                  {activeSubtitle.text}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-white">
            <button type="button" onClick={() => setPlaying((v) => !v)} className="rounded-full bg-white/15 p-2 hover:bg-white/25">
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
            </button>
            <span className="text-xs tabular-nums">{formatTimecode(currentTime)} / {formatTimecode(duration)}</span>
            <input
              type="range"
              min={trimStart}
              max={trimEnd}
              step={0.1}
              value={currentTime}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="range-brand flex-1"
            />
            <span className="text-xs text-white/70">Frame {frameIndex + 1}</span>
          </div>
        </div>

        <div className="card space-y-4 p-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">Clip</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <RangeControl label="Trim in" value={Number(trimStart.toFixed(1))} min={0} max={trimEnd - 0.3} step={0.1} unit="s" onChange={(v) => onChange({ trimStart: v, currentTime: Math.max(v, currentTime) })} />
              <RangeControl label="Trim out" value={Number(trimEnd.toFixed(1))} min={trimStart + 0.3} max={duration} step={0.1} unit="s" onChange={(v) => onChange({ trimEnd: v, currentTime: Math.min(v, currentTime) })} />
              <RangeControl label="Volume" value={draft.volume ?? 80} min={0} max={100} unit="%" onChange={(v) => onChange({ volume: v })} />
              <RangeControl label="Speed" value={draft.playbackSpeed ?? 1} min={0.5} max={2} step={0.1} unit="x" onChange={(v) => onChange({ playbackSpeed: v })} />
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">Frame {frameIndex + 1} crop</p>
            <div className="mt-3 space-y-3">
              <RangeControl label="Zoom" value={frameCrop.imageScale ?? draft.imageScale ?? 100} min={80} max={180} unit="%" onChange={(v) => updateFrameCrop('imageScale', v)} />
              <RangeControl label="Move X" value={frameCrop.imageOffsetX ?? 0} min={-80} max={80} onChange={(v) => updateFrameCrop('imageOffsetX', v)} />
              <RangeControl label="Move Y" value={frameCrop.imageOffsetY ?? 0} min={-80} max={80} onChange={(v) => updateFrameCrop('imageOffsetY', v)} />
            </div>
          </div>
        </div>
      </div>

      <div className="card space-y-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-text-primary">Timeline</p>
            <p className="text-xs text-text-muted">Frame-by-frame crop, trim, and subtitles</p>
          </div>
          <button type="button" onClick={addSubtitle} className="btn-secondary py-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" /> Add subtitle
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[720px] space-y-2">
            <div className="relative h-6">
              {Array.from({ length: duration + 1 }, (_, i) => (
                <span key={i} className="absolute top-0 text-[10px] text-text-muted" style={{ left: `${(i / duration) * 100}%` }}>
                  {i}s
                </span>
              ))}
            </div>

            <div className="relative">
              <div className="grid grid-cols-12 gap-1 rounded-xl bg-gray-100 p-2">
                {frames.map((frame) => (
                  <button
                    key={frame.index}
                    type="button"
                    onClick={() => seekTo(frame.time)}
                    className={`relative overflow-hidden rounded-md border-2 ${frame.index === frameIndex ? 'border-brand-primary' : 'border-transparent'}`}
                  >
                    <img src={resolveImage(draft.src)} alt="" className="aspect-square w-full object-cover" style={mediaPreviewStyle(draft, frame.index)} />
                    <span className="absolute bottom-0.5 left-0.5 rounded bg-black/60 px-1 text-[9px] text-white">{frame.index + 1}</span>
                  </button>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-y-2 w-0.5 bg-brand-primary" style={{ left: `${(currentTime / duration) * 100}%` }} />
              <div
                className="pointer-events-none absolute inset-y-2 rounded-md bg-black/25"
                style={{ left: 0, width: `${(trimStart / duration) * 100}%` }}
              />
              <div
                className="pointer-events-none absolute inset-y-2 rounded-md bg-black/25"
                style={{ left: `${(trimEnd / duration) * 100}%`, right: 0 }}
              />
            </div>

            <div className="relative h-10 rounded-xl bg-slate-800">
              <div className="absolute inset-y-0 flex items-center gap-1 px-2 text-[10px] font-medium uppercase tracking-wide text-white/50">
                <Subtitles className="h-3 w-3" /> Subs
              </div>
              {(draft.subtitles || []).map((clip) => (
                <button
                  key={clip.id}
                  type="button"
                  onClick={() => {
                    setSelectedSubtitle(clip.id);
                    seekTo(clip.start);
                  }}
                  className={`absolute top-1.5 h-7 overflow-hidden rounded-md px-2 text-left text-[10px] font-medium text-white ${selectedSubtitle === clip.id ? 'bg-amber-500' : 'bg-brand-primary'}`}
                  style={{
                    left: `${(clip.start / duration) * 100}%`,
                    width: `${Math.max(6, ((clip.end - clip.start) / duration) * 100)}%`,
                  }}
                >
                  <span className="block truncate">{clip.text}</span>
                </button>
              ))}
              <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white" style={{ left: `${(currentTime / duration) * 100}%` }} />
            </div>
          </div>
        </div>

        {selected && (
          <div className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 sm:grid-cols-[1fr_auto]">
            <div className="space-y-2">
              <label className="text-xs font-medium text-text-secondary">Subtitle text</label>
              <input value={selected.text} onChange={(e) => updateSubtitle(selected.id, { text: e.target.value })} className="input text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <RangeControl label="Start" value={Number(selected.start.toFixed(1))} min={0} max={selected.end - 0.2} step={0.1} unit="s" onChange={(v) => updateSubtitle(selected.id, { start: v })} />
                <RangeControl label="End" value={Number(selected.end.toFixed(1))} min={selected.start + 0.2} max={duration} step={0.1} unit="s" onChange={(v) => updateSubtitle(selected.id, { end: v })} />
              </div>
            </div>
            <button type="button" onClick={() => removeSubtitle(selected.id)} className="btn-ghost self-end text-red-500">
              <Trash2 className="h-4 w-4" /> Remove
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Scissors className="h-3.5 w-3.5" />
          Shaded ends are trimmed out. Click a frame to crop that moment, then add subtitles on the track below.
        </div>
      </div>
    </div>
  );
}
