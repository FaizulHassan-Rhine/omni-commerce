'use client';

import { cn } from '@/lib/utils';
import { resolveImage } from '@/lib/images';
import { Globe, MoreHorizontal, Play } from 'lucide-react';

function PreviewFrame({ children, className }) {
  return (
    <div className={cn('h-fit overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm', className)}>
      {children}
    </div>
  );
}

function imageStyle(post) {
  const scale = (post.imageScale ?? 100) / 100;
  const x = post.imageOffsetX ?? 0;
  const y = post.imageOffsetY ?? 0;
  const brightness = post.imageBrightness ?? 100;
  const contrast = post.imageContrast ?? 100;
  return {
    transform: `scale(${scale}) translate(${x}px, ${y}px)`,
    filter: `brightness(${brightness}%) contrast(${contrast}%)`,
    transformOrigin: 'center center',
  };
}

function overlayClass(position) {
  switch (position) {
    case 'top-left':
      return 'left-3 top-3';
    case 'top-right':
      return 'right-3 top-3 text-right';
    case 'bottom-right':
      return 'bottom-3 right-3 text-right';
    default:
      return 'bottom-3 left-3';
  }
}

function overlaySize(size) {
  switch (size) {
    case 'small':
      return 'text-sm';
    case 'large':
      return 'text-xl';
    default:
      return 'text-base';
  }
}

function EditableImage({ post, className }) {
  return (
    <div className={cn('relative overflow-hidden bg-gray-100', className)}>
      <img src={resolveImage(post.mediaUrl)} alt="" className="h-full w-full object-cover" style={imageStyle(post)} />
      {post.overlayTitle && (
        <div
          className={cn(
            'absolute max-w-[82%] font-semibold leading-tight drop-shadow-md',
            overlayClass(post.overlayPosition),
            overlaySize(post.overlaySize)
          )}
          style={{ color: post.overlayColor || '#FFFFFF' }}
        >
          {post.overlayTitle}
        </div>
      )}
    </div>
  );
}

export default function CampaignAdNativePreview({ post }) {
  const id = post.id;

  if (id === 'meta-ads') {
    return (
      <PreviewFrame>
        <div className="flex items-center gap-2 px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1877F2] text-xs font-bold text-white">N</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">Nova Commerce</p>
            <p className="text-[11px] text-gray-500">Sponsored · {post.placement || 'Facebook Feed'}</p>
          </div>
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
        </div>
        <p className="px-3 pb-2 text-sm text-gray-800">{post.primaryText}</p>
        <EditableImage post={post} className="aspect-square w-full" />
        <div className="border-t border-gray-100 bg-gray-50 px-3 py-2.5">
          <p className="truncate text-xs uppercase text-gray-500">{post.destinationUrl?.replace('https://', '')}</p>
          <p className="truncate font-semibold text-gray-900">{post.headline}</p>
          <p className="truncate text-xs text-gray-600">{post.linkDescription}</p>
        </div>
        <div className="border-t border-gray-100 px-3 py-2.5">
          <button type="button" className="w-full rounded-md bg-gray-100 py-2 text-sm font-semibold text-gray-800">
            {post.cta || 'Shop Now'}
          </button>
        </div>
      </PreviewFrame>
    );
  }

  if (id === 'google-ads') {
    return (
      <PreviewFrame className="p-3">
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-semibold text-emerald-700">Ad</span>
          <span>{post.displayPath || 'novacommerce.com'}</span>
        </div>
        <p className="text-lg font-medium text-[#1a0dab]">{post.headline}</p>
        <p className="mt-1 text-sm text-gray-700">{post.description}</p>
        <EditableImage post={post} className="mt-3 aspect-[1.91/1] w-full rounded-lg" />
        <div className="mt-3 flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
          <span className="text-sm font-medium text-gray-800">{post.cta || 'Shop now'}</span>
          <Globe className="h-4 w-4 text-gray-400" />
        </div>
      </PreviewFrame>
    );
  }

  if (id === 'tiktok-ads') {
    return (
      <PreviewFrame className="relative mx-auto max-w-[220px] bg-black text-white">
        <EditableImage post={post} className="aspect-[9/16] w-full opacity-95" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-16">
          <p className="text-xs font-semibold">{post.displayName || 'Nova Commerce'}</p>
          <p className="mt-1 text-sm leading-snug">{post.adText || post.primaryText}</p>
          <button type="button" className="mt-3 w-full rounded-md bg-[#fe2c55] py-2 text-sm font-semibold">
            {post.cta || 'Shop Now'}
          </button>
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 space-y-3 text-center text-[10px]">
          <div><Play className="mx-auto h-5 w-5" /><p>Ad</p></div>
        </div>
      </PreviewFrame>
    );
  }

  if (id === 'microsoft-ads') {
    return (
      <PreviewFrame>
        <div className="border-b border-gray-100 px-3 py-2 text-xs text-gray-500">Microsoft Audience Network · Ad</div>
        <EditableImage post={post} className="aspect-[1.91/1] w-full" />
        <div className="space-y-1 px-3 py-3">
          <p className="font-semibold text-gray-900">{post.headline}</p>
          <p className="text-sm text-gray-600">{post.description || post.primaryText}</p>
          <p className="text-xs text-gray-500">{post.finalUrl?.replace('https://', '')}</p>
          <button type="button" className="mt-2 rounded-md bg-[#0078d4] px-4 py-2 text-sm font-semibold text-white">
            {post.cta || 'Shop now'}
          </button>
        </div>
      </PreviewFrame>
    );
  }

  return (
    <PreviewFrame>
      <EditableImage post={post} className={cn('w-full', post.aspectClass || 'aspect-square')} />
      <div className="space-y-1 px-3 py-3">
        <p className="font-semibold text-gray-900">{post.headline}</p>
        <p className="text-sm text-gray-600">{post.primaryText}</p>
      </div>
    </PreviewFrame>
  );
}
