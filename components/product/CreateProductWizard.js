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
  generateProductContent,
  generatePlatformPosts,
  simulateAIProcessing,
} from '@/lib/mock-ai';
import CreativeOptions, { defaultCreativeOptions, formatContentTypes } from '@/components/ui/CreativeOptions';
import { getPlaceholderImage, resolveImage } from '@/lib/images';
import { useApp } from '@/context/AppContext';
import { ArrowRight, ArrowLeft, Sparkles, Link2 } from 'lucide-react';

const uploadSteps = [
  { id: 'input', label: 'Upload Product' },
  { id: 'analysis', label: 'AI Analysis' },
  { id: 'review', label: 'Review Content' },
  { id: 'channels', label: 'Select Channels' },
  { id: 'posts', label: 'Review Posts' },
  { id: 'publish', label: 'Publish' },
];

const linkSteps = [
  { id: 'link', label: 'Paste Link' },
  { id: 'analysis', label: 'AI Analysis' },
  { id: 'review', label: 'Review Content' },
  { id: 'channels', label: 'Select Channels' },
  { id: 'posts', label: 'Review Posts' },
  { id: 'publish', label: 'Publish' },
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
  const { addToast } = useApp();
  const [step, setStep] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
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

  const canGenerate = isLink ? isValidProductUrl(sourceUrl) : uploadedFiles.length > 0;
  const analysisStages = isLink ? AI_LINK_STAGES : AI_CONTENT_STAGES;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setStep(1);
    await simulateAIProcessing(analysisStages, (stage) => setAiStage(stage));
    const generated = generateProductContent(isLink ? sourceUrl : (prompt || 'Classic Leather Wallet'), {
      notes: isLink ? prompt : undefined,
      sourceUrl: isLink ? sourceUrl : undefined,
    });
    if (uploadedFiles[0]?.preview) {
      generated.generatedImage = uploadedFiles[0].preview;
    }
    generated.creativeOptions = creativeOptions;
    setGeneratedImages(
      Array.from({ length: isLink ? 1 : creativeOptions.outputCount }, (_, i) =>
        uploadedFiles[0]?.preview || getPlaceholderImage('product', i)
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
    setPlatformPosts((prev) => prev.map((post) => (post.status === 'published' ? post : { ...post, status: 'draft' })));
    addToast('success', 'All posts saved as drafts');
  };

  const handleLaunchPost = async (id) => {
    const post = platformPosts.find((p) => p.id === id);
    if (!post || post.status === 'published') return;
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 700));
    updatePost(id, { status: 'published' });
    setPublishing(false);
    addToast('success', `Launched to ${post.name}`);
  };

  const handleLaunchAll = async () => {
    setStep(5);
    setPublishing(true);
    const results = [];
    const pending = platformPosts.filter((p) => p.status !== 'published');
    for (const post of pending) {
      await new Promise((r) => setTimeout(r, 700));
      results.push({
        platform: post.name,
        status: 'published',
        message: post.status === 'draft' ? 'Published from draft' : 'Published',
      });
      setPublishResults([...results]);
      updatePost(post.id, { status: 'published' });
    }
    setPublishing(false);
    addToast('success', 'All selected posts launched');
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
  };

  return (
    <div>
      <PageHeader
        title="AI Content Creation"
        subtitle={
          isLink
            ? 'Paste a product link to generate content. Add a note optionally for more context.'
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
                Add a Shopify, Amazon, or store URL. AI will read the page and draft listing content.
              </p>
            </div>
            <div>
              <label className="label">Product URL</label>
              <div className="relative">
                <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://yourstore.com/products/classic-leather-wallet"
                  className="input pl-10"
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center gap-2">
                <label className="label mb-0">Write something</label>
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-text-muted">Optional</span>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder="Add extra context — tone, audience, or what to emphasize…"
                className="input resize-none"
              />
            </div>
          </div>
          <button onClick={handleGenerate} disabled={!canGenerate} className="btn-gradient w-full py-3">
            Next <ArrowRight className="h-4 w-4" />
          </button>
          {!canGenerate && (
            <p className="text-center text-sm text-text-muted">Paste a valid product URL to continue.</p>
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
            <h3 className="font-semibold text-text-primary dark:text-white mb-4">
              {publishing ? 'Publishing in progress...' : 'Publishing complete!'}
            </h3>
            {publishResults && <PublishingStatus items={publishResults} />}
          </div>
          {!publishing && (
            <div className="flex gap-3 justify-center">
              <Link href="/catalog" className="btn-secondary">View Catalog</Link>
              <Link href="/campaigns/create" className="btn-secondary">Make Campaign</Link>
              <button type="button" className="btn-gradient" onClick={resetWizard}>
                Create Another
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
