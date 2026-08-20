export function withEditDefaults(asset) {
  return {
    imageScale: 100,
    imageOffsetX: 0,
    imageOffsetY: 0,
    imageBrightness: 100,
    imageContrast: 100,
    saturation: 100,
    warmth: 0,
    blur: 0,
    vignette: 0,
    rotate: 0,
    flipH: false,
    flipV: false,
    cropPreset: 'original',
    filter: 'original',
    overlayTitle: '',
    overlayPosition: 'bottom-left',
    overlaySize: 'medium',
    overlayColor: '#FFFFFF',
    duration: 8,
    trimStart: 0,
    trimEnd: 8,
    currentTime: 0,
    volume: 80,
    playbackSpeed: 1,
    subtitles: [],
    frameCrops: {},
    ...asset,
  };
}

export function mediaPreviewStyle(asset, frameIndex = null) {
  const crop = frameIndex != null ? asset.frameCrops?.[frameIndex] : null;
  const scale = crop?.imageScale ?? asset.imageScale ?? 100;
  const x = crop?.imageOffsetX ?? asset.imageOffsetX ?? 0;
  const y = crop?.imageOffsetY ?? asset.imageOffsetY ?? 0;
  const warmth = asset.warmth ?? 0;
  const hue = warmth * 0.6;
  const sepia = Math.max(0, warmth) * 0.35;

  return {
    transform: [
      `scale(${scale / 100})`,
      `translate(${x}px, ${y}px)`,
      `rotate(${asset.rotate ?? 0}deg)`,
      `scaleX(${asset.flipH ? -1 : 1})`,
      `scaleY(${asset.flipV ? -1 : 1})`,
    ].join(' '),
    filter: [
      `brightness(${asset.imageBrightness ?? 100}%)`,
      `contrast(${asset.imageContrast ?? 100}%)`,
      `saturate(${asset.saturation ?? 100}%)`,
      `hue-rotate(${hue}deg)`,
      `sepia(${sepia}%)`,
      `blur(${asset.blur ?? 0}px)`,
    ].join(' '),
  };
}

export function cropAspectClass(preset) {
  if (preset === '1:1') return 'aspect-square';
  if (preset === '4:5') return 'aspect-[4/5]';
  if (preset === '2:3') return 'aspect-[2/3]';
  if (preset === '9:16') return 'aspect-[9/16]';
  if (preset === '16:9') return 'aspect-video';
  if (preset === '1.91:1') return 'aspect-[1.91/1]';
  return 'aspect-square';
}

export function platformAspectToCrop(aspect) {
  if (!aspect) return 'original';
  if (aspect === '1:1') return '1:1';
  if (aspect === '4:5') return '4:5';
  if (aspect === '2:3') return '2:3';
  if (aspect === '9:16') return '9:16';
  if (aspect === '16:9') return '16:9';
  if (aspect === '1.91:1') return '1.91:1';
  return 'original';
}

export function overlayClass(position) {
  if (position === 'top-left') return 'top-4 left-4 text-left';
  if (position === 'top-right') return 'top-4 right-4 text-right';
  if (position === 'bottom-right') return 'bottom-4 right-4 text-right';
  return 'bottom-4 left-4 text-left';
}

export function overlaySizeClass(size) {
  if (size === 'small') return 'text-sm';
  if (size === 'large') return 'text-2xl';
  return 'text-lg';
}

export function formatTimecode(seconds) {
  const safe = Math.max(0, Number(seconds) || 0);
  const m = Math.floor(safe / 60);
  const s = Math.floor(safe % 60);
  const ms = Math.floor((safe % 1) * 10);
  return `${m}:${String(s).padStart(2, '0')}.${ms}`;
}

export const IMAGE_FILTERS = [
  { id: 'original', label: 'Original', patch: { saturation: 100, warmth: 0, imageContrast: 100, imageBrightness: 100 } },
  { id: 'vivid', label: 'Vivid', patch: { saturation: 130, warmth: 5, imageContrast: 112, imageBrightness: 104 } },
  { id: 'warm', label: 'Warm', patch: { saturation: 110, warmth: 28, imageContrast: 105, imageBrightness: 102 } },
  { id: 'cool', label: 'Cool', patch: { saturation: 95, warmth: -22, imageContrast: 108, imageBrightness: 100 } },
  { id: 'mono', label: 'B&W', patch: { saturation: 0, warmth: 0, imageContrast: 115, imageBrightness: 102 } },
  { id: 'fade', label: 'Fade', patch: { saturation: 80, warmth: 8, imageContrast: 86, imageBrightness: 110 } },
];

export const CROP_PRESETS = ['original', '1:1', '4:5', '2:3', '9:16', '16:9', '1.91:1'];
export const VIDEO_FRAME_COUNT = 12;
