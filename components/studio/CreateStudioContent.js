'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import UploadDropzone, { PromptInput } from '@/components/ui/UploadDropzone';
import CreativeOptions, { defaultCreativeOptions } from '@/components/ui/CreativeOptions';
import AIProcessingLoader from '@/components/ui/AIProcessingLoader';
import Modal from '@/components/ui/Modal';
import StudioImageEditor from '@/components/studio/StudioImageEditor';
import StudioVideoEditor from '@/components/studio/StudioVideoEditor';
import { cropAspectClass, mediaPreviewStyle, overlayClass, overlaySizeClass, withEditDefaults } from '@/lib/studio-edit';
import { AI_STUDIO_STAGES, generateStudioMedia, simulateAIProcessing } from '@/lib/mock-ai';
import { resolveImage } from '@/lib/images';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Play, RefreshCw, Save, Sparkles } from 'lucide-react';

export default function CreateStudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { studioAssets, addStudioAssets, addToast } = useApp();
  const type = searchParams.get('type') === 'video' ? 'video' : 'image';
  const fromId = searchParams.get('from');
  const sourceAsset = fromId ? studioAssets.find((item) => item.id === fromId) : null;

  const initialOptions = useMemo(
    () => ({
      ...defaultCreativeOptions,
      contentTypes:
        type === 'video'
          ? { image: false, video: true }
          : { image: true, video: false },
    }),
    [type]
  );

  const [files, setFiles] = useState(
    sourceAsset?.src
      ? [{ id: sourceAsset.id, name: sourceAsset.name || 'source', preview: sourceAsset.src, file: null }]
      : []
  );
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState(initialOptions);
  const [generating, setGenerating] = useState(false);
  const [aiStage, setAiStage] = useState(0);
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [seed, setSeed] = useState(0);
  const [showComposer, setShowComposer] = useState(true);
  const [regenOpen, setRegenOpen] = useState(false);

  useEffect(() => {
    setOptions(initialOptions);
  }, [initialOptions]);

  useEffect(() => {
    if (!sourceAsset?.src) return;
    setFiles((prev) => (
      prev.length > 0
        ? prev
        : [{ id: sourceAsset.id, name: sourceAsset.name || 'source', preview: sourceAsset.src, file: null }]
    ));
  }, [sourceAsset]);

  const hasInput = files.length > 0 || prompt.trim().length > 0;
  const sourceImage = files[0]?.preview || sourceAsset?.src || null;

  const generate = async () => {
    if (!hasInput) return;
    setGenerating(true);
    setAiStage(0);
    await simulateAIProcessing(AI_STUDIO_STAGES, (stage) => setAiStage(stage), 550);
    const nextSeed = seed + 1;
    setResults(generateStudioMedia({ prompt, sourceImage, options, seed: nextSeed }).map(withEditDefaults));
    setSelectedIndex(0);
    setSeed(nextSeed);
    setGenerating(false);
    setShowComposer(false);
    setRegenOpen(false);
  };

  const saveToLibrary = () => {
    if (!results.length) return;
    addStudioAssets(results.map((item) => ({ ...item, source: 'generated' })));
    addToast('success', 'Saved to Content Studio library.');
    const tab = results.some((item) => item.type === 'video') && !results.some((item) => item.type === 'image')
      ? 'video'
      : results[0]?.type || type;
    router.push(`/create/content?tab=${tab}`);
  };

  const selected = results[selectedIndex] || null;

  const applyPatch = (patch) => {
    setResults((prev) => prev.map((item, index) => (index === selectedIndex ? { ...item, ...patch } : item)));
  };

  const resetSelected = () => {
    if (!selected) return;
    setResults((prev) => prev.map((item, index) => (
      index === selectedIndex
        ? withEditDefaults({ type: item.type, src: item.src, name: item.name })
        : item
    )));
  };

  return (
    <div className="page-container pb-20 lg:pb-6">
      <Link href="/create/content" className="mb-4 inline-flex items-center gap-1 text-sm text-text-muted hover:text-brand-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Content Studio
      </Link>
      <PageHeader
        title={fromId ? 'Edit with AI' : type === 'video' ? 'Create video' : 'Create content'}
        subtitle="Upload an image or write a prompt — at least one is required. Generate image and video assets only."
      />

      {generating ? (
        <AIProcessingLoader stages={AI_STUDIO_STAGES} activeStage={aiStage} />
      ) : (
        <div className={showComposer ? 'grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px]' : ''}>
          <div className="space-y-6">
            {showComposer && (
              <>
                <div className="card space-y-4">
                  <div>
                    <h3 className="font-semibold text-text-primary">Reference image</h3>
                    <p className="text-sm text-text-secondary">Optional if you write a prompt.</p>
                  </div>
                  <UploadDropzone files={files} onUpload={setFiles} />
                </div>

                <div className="card space-y-3">
                  <div>
                    <h3 className="font-semibold text-text-primary">Prompt</h3>
                    <p className="text-sm text-text-secondary">Optional if you upload an image.</p>
                  </div>
                  <PromptInput
                    value={prompt}
                    onChange={setPrompt}
                    placeholder="e.g. Premium leather wallet on marble, soft studio light, lifestyle crop..."
                  />
                </div>

                <button type="button" onClick={generate} disabled={!hasInput} className="btn-gradient w-full py-3">
                  <Sparkles className="h-5 w-5" /> {results.length ? 'Generate again' : 'Generate'}
                </button>
                {!hasInput && (
                  <p className="text-center text-sm text-text-muted">Upload an image or write a prompt to generate.</p>
                )}
              </>
            )}

            {results.length > 0 && selected && (
              <div className="card space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-text-primary">Generated content</h3>
                    <p className="text-sm text-text-secondary">
                      {selected.type === 'video'
                        ? 'Trim, crop frames, and add subtitles, then save to the studio.'
                        : 'Crop, color, filters, and overlay — then save to the studio.'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {!showComposer && (
                      <button type="button" onClick={() => setRegenOpen(true)} className="btn-secondary text-sm">
                        <RefreshCw className="h-4 w-4" /> Regenerate
                      </button>
                    )}
                    <button type="button" onClick={saveToLibrary} className="btn-gradient text-sm">
                      <Save className="h-4 w-4" /> Save to studio
                    </button>
                  </div>
                </div>

                {results.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {results.map((item, index) => (
                      <button
                        key={`${item.type}-${index}`}
                        type="button"
                        onClick={() => setSelectedIndex(index)}
                        className={cn(
                          'relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2',
                          index === selectedIndex ? 'border-brand-primary' : 'border-transparent opacity-70 hover:opacity-100'
                        )}
                      >
                        <img src={resolveImage(item.src)} alt="" className="h-full w-full object-cover" />
                        {item.type === 'video' && (
                          <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                            <Play className="h-3.5 w-3.5 fill-white text-white" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {selected.type === 'video' ? (
                  <StudioVideoEditor draft={selected} onChange={applyPatch} />
                ) : (
                  <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                    <div className="flex items-center justify-center rounded-2xl bg-gray-100 p-4">
                      <div className={cn('relative w-full max-w-xl overflow-hidden rounded-xl bg-black', cropAspectClass(selected.cropPreset))}>
                        <img
                          src={resolveImage(selected.src)}
                          alt=""
                          className="h-full w-full object-cover"
                          style={mediaPreviewStyle(selected)}
                        />
                        {selected.vignette > 0 && (
                          <div
                            className="pointer-events-none absolute inset-0"
                            style={{ boxShadow: `inset 0 0 ${80 + selected.vignette}px rgba(0,0,0,${selected.vignette / 120})` }}
                          />
                        )}
                        {selected.overlayTitle && (
                          <div
                            className={cn('absolute max-w-[82%] font-semibold leading-tight drop-shadow-md', overlayClass(selected.overlayPosition), overlaySizeClass(selected.overlaySize))}
                            style={{ color: selected.overlayColor || '#FFFFFF' }}
                          >
                            {selected.overlayTitle}
                          </div>
                        )}
                      </div>
                    </div>
                    <StudioImageEditor draft={selected} onChange={applyPatch} onReset={resetSelected} />
                  </div>
                )}
              </div>
            )}
          </div>

          {showComposer && (
            <div className="lg:sticky lg:top-20 lg:self-start">
              <CreativeOptions value={options} onChange={setOptions} mediaOnly />
            </div>
          )}
        </div>
      )}

      <Modal open={regenOpen} onClose={() => setRegenOpen(false)} title="Regenerate content" size="lg">
        <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          <div>
            <h3 className="font-semibold text-text-primary">Reference image</h3>
            <p className="mb-3 text-sm text-text-secondary">Optional if you write a prompt.</p>
            <UploadDropzone files={files} onUpload={setFiles} />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Prompt</h3>
            <p className="mb-3 text-sm text-text-secondary">Optional if you upload an image.</p>
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              placeholder="e.g. Premium leather wallet on marble, soft studio light, lifestyle crop..."
            />
          </div>
          <button type="button" onClick={generate} disabled={!hasInput} className="btn-gradient w-full py-3">
            <Sparkles className="h-5 w-5" /> Generate again
          </button>
          {!hasInput && (
            <p className="text-center text-sm text-text-muted">Upload an image or write a prompt to continue.</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
