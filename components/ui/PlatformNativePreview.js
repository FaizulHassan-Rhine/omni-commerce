'use client';

import { cn } from '@/lib/utils';
import { resolveImage } from '@/lib/images';
import { Globe, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ThumbsUp, Repeat2, Play, ShoppingBag, MapPin, Music2 } from 'lucide-react';

function PreviewFrame({ children, className }) {
  return (
    <div className={cn('h-fit overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm', className)}>
      {children}
    </div>
  );
}

function Avatar({ letter = 'N', color = '#3D6B8E' }) {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: color }}>
      {letter}
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
        <div className={cn('absolute max-w-[82%] font-semibold leading-tight drop-shadow-md', overlayClass(post.overlayPosition), overlaySize(post.overlaySize))} style={{ color: post.overlayColor || '#FFFFFF' }}>
          {post.overlayTitle}
        </div>
      )}
    </div>
  );
}

export default function PlatformNativePreview({ post }) {
  const id = post.id;

  if (id === 'facebook') {
    return (
      <PreviewFrame>
        <div className="flex items-center gap-2 px-3 py-2.5">
          <Avatar color="#1877F2" letter="N" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900">Nova Commerce</p>
            <p className="flex items-center gap-1 text-[11px] text-gray-500">Sponsored · <Globe className="h-3 w-3" /></p>
          </div>
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
        </div>
        <p className="whitespace-pre-wrap px-3 pb-2 text-sm text-gray-800">{post.primaryText}</p>
        <EditableImage post={post} className="aspect-square w-full" />
        <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50 px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-[11px] uppercase text-gray-400">novacommerce.com</p>
            <p className="truncate text-sm font-semibold text-gray-900">{post.headline}</p>
            <p className="truncate text-xs text-gray-500">{post.linkDescription}</p>
          </div>
          <span className="shrink-0 rounded-md bg-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-800">{post.cta}</span>
        </div>
        <div className="flex border-t border-gray-100 text-xs font-medium text-gray-500">
          {['Like', 'Comment', 'Share'].map((a) => (
            <span key={a} className="flex-1 py-2.5 text-center">{a}</span>
          ))}
        </div>
      </PreviewFrame>
    );
  }

  if (id === 'instagram') {
    return (
      <PreviewFrame className="max-w-[320px]">
        <div className="flex items-center gap-2 px-3 py-2">
          <Avatar color="#E4405F" letter="n" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">novacommerce</p>
            <p className="flex items-center gap-1 text-[10px] text-gray-500"><MapPin className="h-2.5 w-2.5" /> {post.location}</p>
          </div>
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
        </div>
        <div className="relative aspect-[4/5] bg-gray-100">
          <EditableImage post={post} className="h-full w-full" />
          {post.productTag && (
            <span className="absolute bottom-3 left-3 rounded-full bg-black/70 px-2 py-1 text-[10px] font-medium text-white">
              <ShoppingBag className="mr-1 inline h-3 w-3" /> {post.productTag}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex gap-3 text-gray-800">
            <Heart className="h-5 w-5" />
            <MessageCircle className="h-5 w-5" />
            <Send className="h-5 w-5" />
          </div>
          <Bookmark className="h-5 w-5" />
        </div>
        <div className="space-y-1 px-3 pb-3 text-sm">
          {post.hideLikeCount !== 'On' && <p className="font-semibold">2,418 likes</p>}
          <p>
            <span className="font-semibold">novacommerce </span>
            <span className="whitespace-pre-wrap text-gray-800">{post.caption}</span>
          </p>
          {post.firstComment && <p className="text-xs text-gray-400">View all 86 comments</p>}
        </div>
      </PreviewFrame>
    );
  }

  if (id === 'linkedin') {
    return (
      <PreviewFrame>
        <div className="flex items-start gap-2 px-3 py-3">
          <Avatar color="#0A66C2" letter="N" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900">Nova Commerce</p>
            <p className="text-[11px] text-gray-500">12,480 followers · 2h · {post.visibility === 'Anyone' ? 'Public' : post.visibility}</p>
          </div>
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
        </div>
        <p className="whitespace-pre-wrap px-3 pb-3 text-sm leading-relaxed text-gray-800">{post.postText}</p>
        <EditableImage post={post} className="aspect-[1.91/1] w-full" />
        {post.headline && (
          <div className="border-t border-gray-100 px-3 py-2">
            <p className="text-sm font-semibold text-gray-900">{post.headline}</p>
            <p className="text-xs text-blue-700">{post.cta} →</p>
          </div>
        )}
        <div className="flex justify-around border-t border-gray-100 py-2 text-[11px] font-medium text-gray-500">
          <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" /> Like</span>
          <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> Comment</span>
          <span className="flex items-center gap-1"><Repeat2 className="h-3.5 w-3.5" /> Repost</span>
          <span className="flex items-center gap-1"><Send className="h-3.5 w-3.5" /> Send</span>
        </div>
      </PreviewFrame>
    );
  }

  if (id === 'tiktok') {
    return (
      <PreviewFrame className="relative mx-auto max-w-[220px] bg-black text-white">
        <div className={cn('relative', post.aspectClass || 'aspect-[9/16]')}>
          <EditableImage post={post} className="h-full w-full opacity-90" />
          <div className="absolute inset-0 flex items-center justify-center">
            {post.mediaType === 'video' && (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80">
                <Play className="h-5 w-5 text-black" />
              </div>
            )}
          </div>
          <div className="absolute bottom-3 left-3 right-12 space-y-1 text-xs">
            <p className="font-semibold">@novacommerce</p>
            <p className="line-clamp-3">{post.caption}</p>
            <p className="flex items-center gap-1 text-[11px] text-white/80"><Music2 className="h-3 w-3" /> {post.sound}</p>
          </div>
          <div className="absolute bottom-8 right-2 space-y-3 text-center text-[10px]">
            <div><Heart className="mx-auto h-6 w-6 fill-white" /><p>24.1K</p></div>
            <div><MessageCircle className="mx-auto h-6 w-6" /><p>412</p></div>
            <div><Send className="mx-auto h-6 w-6" /><p>Share</p></div>
          </div>
        </div>
      </PreviewFrame>
    );
  }

  if (id === 'x') {
    return (
      <PreviewFrame>
        <div className="flex gap-3 p-3">
          <Avatar color="#000000" letter="N" />
          <div className="min-w-0 flex-1">
            <p className="text-sm"><span className="font-bold">Nova Commerce</span> <span className="text-gray-400">@novacommerce · 2h</span></p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900">{post.tweet}</p>
            <div className="mt-2 overflow-hidden rounded-2xl border border-gray-200">
              <EditableImage post={post} className="aspect-video w-full" />
              {post.linkTitle && (
                <div className="border-t border-gray-100 px-3 py-2">
                  <p className="text-sm font-semibold">{post.linkTitle}</p>
                  <p className="truncate text-xs text-gray-400">{post.linkUrl}</p>
                </div>
              )}
            </div>
            <div className="mt-2 flex justify-between pr-8 text-gray-400">
              <MessageCircle className="h-4 w-4" />
              <Repeat2 className="h-4 w-4" />
              <Heart className="h-4 w-4" />
              <Send className="h-4 w-4" />
            </div>
          </div>
        </div>
      </PreviewFrame>
    );
  }

  if (id === 'pinterest') {
    return (
      <PreviewFrame className="max-w-[240px]">
        <div className="relative">
          <EditableImage post={post} className="aspect-[2/3] w-full" />
          <span className="absolute right-2 top-2 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">Save</span>
        </div>
        <div className="space-y-1 p-3">
          <p className="font-semibold text-gray-900">{post.pinTitle}</p>
          <p className="line-clamp-2 text-xs text-gray-500">{post.description}</p>
          <p className="text-[11px] text-gray-400">{post.board}</p>
        </div>
      </PreviewFrame>
    );
  }

  if (id === 'shopify' || id === 'woocommerce') {
    return (
      <PreviewFrame>
        <EditableImage post={post} className="aspect-square w-full" />
        <div className="space-y-3 p-4">
          <p className="text-[11px] uppercase tracking-wide text-gray-400">{post.vendor}</p>
          <h4 className="text-lg font-semibold text-gray-900">{post.productTitle}</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">{post.price}</span>
            {post.compareAt && <span className="text-sm text-gray-400 line-through">{post.compareAt}</span>}
          </div>
          <button type="button" className="w-full rounded-md bg-gray-900 py-2.5 text-sm font-semibold text-white">Add to cart</button>
          <p className="line-clamp-3 text-sm text-gray-600">{post.description}</p>
        </div>
      </PreviewFrame>
    );
  }

  if (['amazon', 'amazon-seller', 'walmart', 'daraz', 'alibaba'].includes(id)) {
    const marketplace = {
      amazon: { color: '#FF9900', cart: 'Add to Cart' },
      'amazon-seller': { color: '#FF9900', cart: 'Add to Cart' },
      walmart: { color: '#0071CE', cart: 'Add to cart' },
      daraz: { color: '#F85606', cart: 'Buy Now' },
      alibaba: { color: '#FF6A00', cart: 'Start order' },
    }[id];
    return (
      <PreviewFrame>
        <div className="grid gap-3 p-3 sm:grid-cols-2">
          <div className="rounded-md ring-1 ring-gray-100">
            <EditableImage post={post} className="aspect-square w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold leading-snug text-gray-900">{post.listingTitle}</p>
            <p className="text-xl font-bold" style={{ color: marketplace.color }}>{post.price}</p>
            <p className="text-xs text-gray-500">{post.brand} · {post.category || post.productType}</p>
            <button type="button" className="w-full rounded-md py-2 text-xs font-bold text-white" style={{ background: marketplace.color }}>
              {marketplace.cart}
            </button>
          </div>
        </div>
      </PreviewFrame>
    );
  }

  return (
    <PreviewFrame>
      <EditableImage post={post} className={cn('w-full', post.aspectClass)} />
      <p className="p-3 text-sm text-gray-700">{post.caption}</p>
    </PreviewFrame>
  );
}
