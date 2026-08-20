'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import ProgressStepper from '@/components/ui/ProgressStepper';
import UploadDropzone, { PromptInput } from '@/components/ui/UploadDropzone';
import AIProcessingLoader from '@/components/ui/AIProcessingLoader';
import PublishingStatus, { ChannelSelector } from '@/components/ui/PublishingStatus';
import PlatformPostReview from '@/components/ui/PlatformPostReview';
import AIRecommendation, { AIConfidenceBadge } from '@/components/ui/AIRecommendation';
import { platforms } from '@/data/platforms';
import {
  AI_CONTENT_STAGES,
  AI_LINK_STAGES,
  AI_PLATFORM_STAGES,
  FETCH_LINK_STAGES,
  fetchProductFromLink,
  generateProductContent,
  generatePlatformPosts,
  simulateAIProcessing,
} from '@/lib/mock-ai';
import CreativeOptions, { defaultCreativeOptions, formatContentTypes } from '@/components/ui/CreativeOptions';
import { getPlaceholderImage, resolveImage } from '@/lib/images';
import { formatCurrency } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { canApproveContent, resolveTeamRole } from '@/lib/team-roles';
import { ArrowRight, ArrowLeft, Sparkles, Link2, Download, Loader2 } from 'lucide-react';

const uploadSteps = [
  { id: 'input', label: 'Upload Product' },
  { id: 'analysis', label: 'AI Analysis' },
  { id: 'review', label: 'Review Content' },
  { id: 'channels', label: 'Select Channels' },
  { id: 'posts', label: 'Review Posts' },
  { id: 'publish', label: 'Approval' },
];

const linkSteps = [
  { id: 'link', label: 'Paste Link' },
  { id: 'analysis', label: 'AI Analysis' },
  { id: 'review', label: 'Review Content' },
  { id: 'channels', label: 'Select Channels' },
  { id: 'posts', label: 'Review Posts' },
  { id: 'publish', label: 'Approval' },
];

function isValidProductUrl(value) {
  if (!value?.trim()) return false;
  try {
    const url = new URL(value.trim().startsWith('http') ? value.trim() : `https://${value.trim()}`);
    return url.hostname.includes('.');
  } catch {
    return false;
  }
}

export default function CreateProductWizard({ mode = 'upload' }) {
  const isLink = mode === 'link';
  const steps = isLink ? linkSteps : uploadSteps;
  const { addToast, upsertProduct } = useApp();
  const { user } = useAuth();
  const canApprove = canApproveContent(resolveTeamRole(user?.email));
  const [step, setStep] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [fetchStage, setFetchStage] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [creativeOptions, setCreativeOptions] = useState(defaultCreativeOptions);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [aiStage, setAiStage] = useState(0);
  const [content, setContent] = useState(null);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [platformPosts, setPlatformPosts] = useState([]);
  const [activePostId, setActivePostId] = useState(null);
  const [publishResults, setPublishResults] = useState(null);
  const [publishing, setPublishing] = useState(false);

  const canGenerate = isLink ? Boolean(fetchedProduct) : uploadedFiles.length > 0;
  const analysisStages = isLink ? AI_LINK_STAGES : AI_CONTENT_STAGES;

  const handleFetchLink = async () => {
    if (!isValidProductUrl(sourceUrl) || fetching) return;
    setFetching(true);
    setFetchedProduct(null);
    setFetchStage(0);
    await simulateAIProcessing(FETCH_LINK_STAGES, (stage) => setFetchStage(stage), 550);
    setFetchedProduct(fetchProductFromLink(sourceUrl));
    setFetching(false);
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setStep(1);
    await simulateAIProcessing(analysisStages, (stage) => setAiStage(stage));
    const generated = generateProductContent(isLink ? (fetchedProduct?.name || sourceUrl) : (prompt || 'Classic Leather Wallet'), {
      sourceUrl: isLink ? sourceUrl : undefined,
    });
    if (uploadedFiles[0]?.preview) {
      generated.generatedImage = uploadedFiles[0].preview;
    } else if (isLink && fetchedProduct?.image) {
      generated.generatedImage = fetchedProduct.image;
    }
    generated.creativeOptions = creativeOptions;
    setGeneratedImages(
      Array.from({ length: isLink ? 1 : creativeOptions.outputCount }, (_, i) =>
        uploadedFiles[0]?.preview || fetchedProduct?.image || getPlaceholderImage('product', i)
      )
    );
    setContent(generated);
    setStep(2);
  };

  const updateField = (field, value) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleGeneratePlatformPosts = async () => {
    if (selectedChannels.length === 0) return;
    setPlatformPosts([]);
    setActivePostId(null);
    setStep(4);
    setAiStage(0);
    await simulateAIProcessing(AI_PLATFORM_STAGES, (stage) => setAiStage(stage), 700);
    const posts = generatePlatformPosts({
      channels: selectedChannels,
      content,
      creativeOptions,
      sourceImage: resolveImage(uploadedFiles[0]?.preview || content?.generatedImage),
    });
    setPlatformPosts(posts);
    setActivePostId(posts[0]?.id || null);
  };

  const updatePost = (id, patch) => {
    setPlatformPosts((prev) => prev.map((post) => (post.id === id ? { ...post, ...patch } : post)));
  };

  const handleDraft = (id) => {
    updatePost(id, { status: 'draft' });
    addToast('success', 'Saved as draft');
  };

  const handleDraftAll = () => {
    setPlatformPosts((prev) => prev.map((post) => (
      post.status === 'published' || post.status === 'pending' ? post : { ...post, status: 'draft' }
    )));
    addToast('success', 'All posts saved as drafts');
  };

  const saveProductForReview = () => {
    if (!content) return null;
    return upsertProduct({
      name: content.title || 'New product',
      sku: `SKU-${Date.now().toString().slice(-6)}`,
      category: content.category || 'Fashion Accessories',
      price: 89.99,
      stock: 100,
      contentScore: 78,
      channels: selectedChannels,
      status: 'Pending',
      published: false,
      createdAt: new Date().toISOString().slice(0, 10),
      image: content.generatedImage || '/images/product-wallet.jpg',
      description: content.description,
      shortDescription: content.shortDescription,
      material: content.material,
      color: content.color,
      tags: content.tags,
      seoTitle: content.seoTitle,
      seoMetaDescription: content.seoMetaDescription,
      keywords: content.keywords,
    });
  };

  const handleLaunchPost = async (id) => {
    const post = platformPosts.find((p) => p.id === id);
    if (!post || post.status === 'published' || post.status === 'pending') return;
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 500));
    saveProductForReview();
    updatePost(id, { status: 'pending' });
    setPublishing(false);
    addToast('success', `Sent for review. Approve ${post.name} from the Products page.`);
  };

  const handleLaunchAll = async () => {
    const pending = platformPosts.filter((p) => p.status !== 'published' && p.status !== 'pending');
    if (pending.length === 0) return;
    setStep(5);
    setPublishing(true);
    saveProductForReview();
    const results = pending.map((post) => ({
      platform: post.name,
      status: 'pending',
      message: 'Awaiting approval',
      postId: post.id,
    }));
    setPlatformPosts((prev) => prev.map((post) => (
      pending.some((item) => item.id === post.id) ? { ...post, status: 'pending' } : post
    )));
    await new Promise((r) => setTimeout(r, 600));
    setPublishResults(results);
    setPublishing(false);
    addToast('success', 'Sent for review. Approve this product on the Products page.');
  };

  const handleApprovalDecision = (item, action) => {
    if (!canApprove) {
      addToast('error', 'Only Admin or Moderator can approve or reject.');
      return;
    }
    setPublishResults((prev) => (prev || []).map((row) => (
      row.platform === item.platform
        ? {
            ...row,
            status: action === 'Approved' ? 'approved' : 'rejected',
            message: action,
          }
        : row
    )));
    if (item.postId) {
      updatePost(item.postId, { status: action === 'Approved' ? 'published' : 'draft' });
    }
    addToast('success', `${item.platform} ${action.toLowerCase()}.`);
  };

  const resetWizard = () => {
    setStep(0);
    setContent(null);
    setPublishResults(null);
    setUploadedFiles([]);
    setPlatformPosts([]);
    setSelectedChannels([]);
    setSourceUrl('');
    setPrompt('');
    setFetchedProduct(null);
    setFetching(false);
    setFetchStage(0);
  };

  return (
    <div>
      <PageHeader
        title="AI Content Creation"
        subtitle={
          isLink
            ? 'Paste a product link, fetch the listing, then generate content with AI.'
            : 'Upload a product image to generate content. Add a prompt optionally for more context.'
        }
      />

      <ProgressStepper steps={steps} currentStep={step} className="mb-8" />

      {step === 0 && !isLink && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] animate-fade-in">
          <div className="space-y-6">
            <div className="card">
              <h3 className="font-semibold text-text-primary mb-1">Upload product images</h3>
              <p className="text-sm text-text-secondary mb-4">Required — AI analyzes your image to generate content.</p>
              <UploadDropzone multiple files={uploadedFiles} onUpload={setUploadedFiles} />
            </div>
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold text-text-primary">Add context prompt</h3>
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-text-muted">Optional</span>
              </div>
              <PromptInput
                value={prompt}
                onChange={setPrompt}
                placeholder="e.g. Premium black leather wallet with minimalist design (optional)"
              />
            </div>
            <button onClick={handleGenerate} disabled={!canGenerate} className="btn-gradient w-full py-3">
              <Sparkles className="h-5 w-5" /> Generate with AI
            </button>
            {!canGenerate && (
              <p className="text-center text-sm text-text-muted">Upload at least one product image to continue.</p>
            )}
          </div>
          <div className="lg:sticky lg:top-20 lg:self-start">
            <CreativeOptions value={creativeOptions} onChange={setCreativeOptions} />
          </div>
        </div>
      )}

      {step === 0 && isLink && (
        <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
          <div className="card space-y-5">
            <div>
              <h3 className="font-semibold text-text-primary mb-1">Paste product link</h3>
              <p className="text-sm text-text-secondary">
                Add a Shopify, Amazon, or store URL. Fetch the listing first, then continue to AI analysis.
              </p>
            </div>
            <div>
              <label className="label">Product URL</label>
              <div className="relative">
                <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => {
                    setSourceUrl(e.target.value);
                    setFetchedProduct(null);
                  }}
                  placeholder="https://yourstore.com/products/classic-leather-wallet"
                  className="input pl-10"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleFetchLink}
              disabled={!isValidProductUrl(sourceUrl) || fetching}
              className="btn-primary w-full py-3"
            >
              {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {fetching ? 'Fetching...' : 'Fetch'}
            </button>

            {fetching && (
              <div className="space-y-2 rounded-xl border border-gray-200/70 bg-gray-50 p-4">
                {FETCH_LINK_STAGES.map((stage, index) => (
                  <div key={stage} className="flex items-center gap-2 text-sm">
                    <div
                      className={
                        index < fetchStage
                          ? 'h-1.5 w-1.5 rounded-full bg-emerald-500'
                          : index === fetchStage
                            ? 'h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse'
                            : 'h-1.5 w-1.5 rounded-full bg-gray-300'
                      }
                    />
                    <span className={index <= fetchStage ? 'text-text-primary' : 'text-text-muted'}>{stage}</span>
                  </div>
                ))}
              </div>
            )}

            {fetchedProduct && !fetching && (
              <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200/70 bg-gray-50 p-4 sm:grid-cols-2">
                <img
                  src={resolveImage(fetchedProduct.image)}
                  alt={fetchedProduct.name}
                  className="aspect-square w-full rounded-xl object-cover"
                />
                <div className="space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-text-muted">{fetchedProduct.store}</p>
                    <h4 className="mt-1 text-lg font-semibold text-text-primary">{fetchedProduct.name}</h4>
                    <p className="mt-1 text-sm text-text-muted">SKU: {fetchedProduct.sku} · {fetchedProduct.category}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Price', value: formatCurrency(fetchedProduct.price) },
                      { label: 'Inventory', value: fetchedProduct.stock },
                      { label: 'Color', value: fetchedProduct.color },
                      { label: 'Material', value: fetchedProduct.material },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl bg-white p-3">
                        <p className="text-[11px] uppercase tracking-wide text-text-muted">{item.label}</p>
                        <p className="mt-0.5 text-sm font-semibold text-text-primary">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-text-secondary">{fetchedProduct.description}</p>
                  {fetchedProduct.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {fetchedProduct.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs text-text-secondary ring-1 ring-gray-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <button onClick={handleGenerate} disabled={!canGenerate} className="btn-gradient w-full py-3">
            Next <ArrowRight className="h-4 w-4" />
          </button>
          {!fetchedProduct && !fetching && (
            <p className="text-center text-sm text-text-muted">Paste a valid product URL and click Fetch to continue.</p>
          )}
        </div>
      )}

      {step === 1 && (
        <AIProcessingLoader stages={analysisStages} activeStage={aiStage} />
      )}

      {step === 2 && content && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <AIConfidenceBadge confidence={84} />
            <AIRecommendation className="flex-1">Content optimized for your brand voice: Premium, confident, minimalist.</AIRecommendation>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="card lg:col-span-1 space-y-3">
              <img src={resolveImage(content.generatedImage)} alt="Generated" className="w-full rounded-lg" />
              {generatedImages.length > 1 && (
                <div className="grid grid-cols-2 gap-2">
                  {generatedImages.slice(1).map((img, i) => (
                    <img key={i} src={img} alt={`Variant ${i + 2}`} className="w-full rounded-lg" />
                  ))}
                </div>
              )}
              {content.sourceUrl && (
                <p className="truncate text-xs text-text-muted" title={content.sourceUrl}>
                  From: {content.sourceUrl}
                </p>
              )}
              <p className="text-xs text-text-muted text-center">
                {formatContentTypes(content.creativeOptions?.contentTypes)} · {content.creativeOptions?.descriptionSize} description · {content.creativeOptions?.background}
              </p>
            </div>
            <div className="card lg:col-span-2 space-y-4">
              {[
                { key: 'title', label: 'Product Title' },
                { key: 'description', label: 'Description', textarea: true },
                { key: 'shortDescription', label: 'Short Description' },
                { key: 'category', label: 'Category' },
                { key: 'seoTitle', label: 'SEO Title' },
                { key: 'seoMetaDescription', label: 'SEO Meta Description', textarea: true },
                { key: 'socialCaption', label: 'Social Caption', textarea: true },
                { key: 'color', label: 'Color' },
                { key: 'material', label: 'Material' },
                { key: 'cta', label: 'CTA' },
                { key: 'contentTone', label: 'Content Tone' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="label">{field.label}</label>
                  {field.textarea ? (
                    <textarea
                      value={content[field.key]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      rows={3}
                      className="input resize-none"
                    />
                  ) : (
                    <input
                      value={content[field.key]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      className="input"
                    />
                  )}
                </div>
              ))}
              <div>
                <label className="label">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {content.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs dark:bg-surface-dark-secondary">{tag}</span>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Hashtags</label>
                <input value={content.hashtags.join(' ')} onChange={(e) => updateField('hashtags', e.target.value.split(' '))} className="input" />
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(0)} className="btn-secondary"><ArrowLeft className="h-4 w-4" /> Back</button>
            <button onClick={() => setStep(3)} className="btn-gradient">Continue to Publishing <ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
          <div className="card">
            <h3 className="font-semibold text-text-primary dark:text-white mb-4">Select publishing destinations</h3>
            <ChannelSelector
              channels={platforms.publishing}
              selected={selectedChannels}
              onChange={setSelectedChannels}
            />
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="btn-secondary"><ArrowLeft className="h-4 w-4" /> Back</button>
            <button onClick={handleGeneratePlatformPosts} disabled={selectedChannels.length === 0} className="btn-gradient">
              <Sparkles className="h-4 w-4" /> Generate ({selectedChannels.length})
            </button>
          </div>
        </div>
      )}

      {step === 4 && platformPosts.length === 0 && (
        <AIProcessingLoader stages={AI_PLATFORM_STAGES} activeStage={aiStage} />
      )}

      {step === 4 && platformPosts.length > 0 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Review platform posts</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Each channel uses its real layout and options — not a generic caption box.
            </p>
          </div>
          <PlatformPostReview
            posts={platformPosts}
            activeId={activePostId}
            onSelect={setActivePostId}
            onChange={(id, patch) => updatePost(id, patch)}
            onDraft={handleDraft}
            onLaunch={handleLaunchPost}
            onDraftAll={handleDraftAll}
            onLaunchAll={handleLaunchAll}
            launching={publishing}
          />
          <div className="flex justify-start">
            <button onClick={() => setStep(3)} className="btn-secondary"><ArrowLeft className="h-4 w-4" /> Back</button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
          <div className="card">
            <h3 className="font-semibold text-text-primary dark:text-white mb-2">
              {publishing ? 'Sending for approval...' : 'Sent for approval'}
            </h3>
            <p className="mb-4 text-sm text-text-secondary">
              These posts wait for approval on the Products page. Approve or publish them there.
            </p>
            {publishResults && (
              <PublishingStatus
                items={publishResults}
                onApprove={(item) => handleApprovalDecision(item, 'Approved')}
                onReject={(item) => handleApprovalDecision(item, 'Rejected')}
              />
            )}
          </div>
          {!publishing && (
            <div className="flex gap-3 justify-center">
              <Link href="/catalog" className="btn-gradient">View Products</Link>
              <button type="button" className="btn-secondary" onClick={resetWizard}>
                Create Another
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
