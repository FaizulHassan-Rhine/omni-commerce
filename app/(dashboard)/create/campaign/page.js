'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import ProgressStepper from '@/components/ui/ProgressStepper';
import UploadDropzone, { PromptInput } from '@/components/ui/UploadDropzone';
import AIProcessingLoader from '@/components/ui/AIProcessingLoader';
import { BudgetAllocator } from '@/components/ui/PublishingStatus';
import PlatformIcon, { PlatformCard } from '@/components/ui/PlatformIcon';
import AIRecommendation, { AIConfidenceBadge } from '@/components/ui/AIRecommendation';
import { products } from '@/data/products';
import CreativeOptions, { defaultCreativeOptions, formatContentTypes } from '@/components/ui/CreativeOptions';
import { getPlaceholderImage, resolveImage } from '@/lib/images';
import { AI_CAMPAIGN_STAGES, generateCampaignContent, generateAudienceSuggestions, simulateAIProcessing } from '@/lib/mock-ai';
import { useApp } from '@/context/AppContext';
import { ArrowRight, ArrowLeft, Sparkles, Wand2 } from 'lucide-react';

const steps = [
  { id: 'product', label: 'Choose Product' },
  { id: 'objective', label: 'Campaign Goal' },
  { id: 'audience', label: 'Audience' },
  { id: 'budget', label: 'Budget' },
  { id: 'generate', label: 'Generate Campaign' },
  { id: 'review', label: 'Review Creative' },
  { id: 'platforms', label: 'Ad Platforms' },
  { id: 'launch', label: 'Launch' },
];

const objectives = ['Sales', 'Conversions', 'Traffic', 'Brand Awareness', 'Engagement', 'Leads', 'Product Launch', 'Retargeting'];

const adPlatforms = [
  { id: 'meta-ads', name: 'Meta Ads' },
  { id: 'google-ads', name: 'Google Ads' },
  { id: 'tiktok-ads', name: 'TikTok Ads' },
  { id: 'microsoft-ads', name: 'Microsoft Ads' },
];

export default function CreateCampaignPage() {
  const router = useRouter();
  const { addToast } = useApp();
  const [step, setStep] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [creativeOptions, setCreativeOptions] = useState(defaultCreativeOptions);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const canContinue = uploadedFiles.length > 0 || !!selectedProduct;
  const [objective, setObjective] = useState('Sales');
  const [audience, setAudience] = useState({ location: 'United States', ageMin: 24, ageMax: 40, gender: 'All', interests: '', customerType: 'New', languages: 'English', device: 'All' });
  const [aiAudience, setAiAudience] = useState(null);
  const [budget, setBudget] = useState({ daily: 150, total: 4500, startDate: '2026-08-20', endDate: '2026-09-20' });
  const [aiStage, setAiStage] = useState(0);
  const [campaign, setCampaign] = useState(null);
  const [activeVariant, setActiveVariant] = useState(0);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['meta-ads', 'google-ads', 'tiktok-ads', 'microsoft-ads']);
  const [allocations, setAllocations] = useState({ 'Meta Ads': 35, 'Google Ads': 30, 'TikTok Ads': 20, 'Microsoft Ads': 15 });
  const [launchStage, setLaunchStage] = useState(-1);
  const [launchComplete, setLaunchComplete] = useState(false);

  const launchStages = [
    'Preparing creative assets...',
    'Validating platform requirements...',
    'Uploading Meta campaign...',
    'Uploading Google campaign...',
    'Configuring TikTok campaign...',
    'Campaign launched successfully.',
  ];

  const handleGenerateAudience = () => {
    setAiAudience(generateAudienceSuggestions());
  };

  const handleGenerateCampaign = async () => {
    setStep(4);
    await simulateAIProcessing(AI_CAMPAIGN_STAGES, (stage) => setAiStage(stage), 700);
    const productName = selectedProduct?.name || prompt || 'Premium Leather Wallet';
    const camp = generateCampaignContent({ objective, productName });
    camp.creativeOptions = creativeOptions;
    if (uploadedFiles[0]?.preview) {
      camp.generatedImage = uploadedFiles[0].preview;
      camp.squareCreative = uploadedFiles[0].preview;
    }
    setCampaign(camp);
    setStep(5);
  };

  const handleLaunch = async () => {
    setStep(7);
    for (let i = 0; i < launchStages.length; i++) {
      setLaunchStage(i);
      await new Promise((r) => setTimeout(r, 1000));
    }
    setLaunchComplete(true);
    addToast('success', 'Campaign launched successfully!');
    setTimeout(() => router.push('/campaigns/camp-1'), 2000);
  };

  return (
    <div className="page-container pb-20">
      <PageHeader title="Create Ad Campaign" subtitle="AI-powered campaign creation from product to launch." />
      <ProgressStepper steps={steps} currentStep={step} className="mb-8" />

      {step === 0 && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] animate-fade-in">
          <div className="space-y-6">
            <div className="card">
              <h3 className="font-semibold text-text-primary mb-1">Upload product images</h3>
              <p className="text-sm text-text-secondary mb-4">Upload an image or select from catalog below.</p>
              <UploadDropzone files={uploadedFiles} onUpload={setUploadedFiles} />
            </div>
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold text-text-primary">Add context prompt</h3>
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-text-muted">Optional</span>
              </div>
              <PromptInput value={prompt} onChange={setPrompt} placeholder="Describe your product or campaign idea (optional)..." />
            </div>
            <div className="card">
              <h3 className="font-semibold mb-4">Or select from catalog</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {products.slice(0, 6).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left cursor-pointer transition-all ${selectedProduct?.id === p.id ? 'border-brand-primary bg-brand-gradient-subtle' : 'border-gray-200 hover:border-brand-primary/30'}`}
                  >
                    <img src={resolveImage(p.image)} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-gray-500">${p.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
              <button onClick={() => setStep(1)} disabled={!canContinue} className="btn-gradient sm:w-auto">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
              {!canContinue && (
                <p className="text-sm text-text-muted sm:ml-2">Upload an image or select a catalog product to continue.</p>
              )}
            </div>
          </div>
          <div className="lg:sticky lg:top-20 lg:self-start">
            <CreativeOptions value={creativeOptions} onChange={setCreativeOptions} />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="mx-auto max-w-2xl animate-fade-in">
          <div className="card">
            <h3 className="font-semibold mb-4">Campaign Objective</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {objectives.map((obj) => (
                <button key={obj} onClick={() => setObjective(obj)} className={`rounded-xl border p-3 text-sm font-medium cursor-pointer transition-all ${objective === obj ? 'border-brand-primary bg-brand-gradient-subtle text-brand-primary' : 'border-gray-200 dark:border-gray-800'}`}>
                  {obj}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button onClick={() => setStep(0)} className="btn-secondary"><ArrowLeft className="h-4 w-4" /> Back</button>
            <button onClick={() => setStep(2)} className="btn-gradient">Continue <ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
          <div className="card space-y-4">
            <h3 className="font-semibold">Target Audience</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { key: 'location', label: 'Location' },
                { key: 'gender', label: 'Gender' },
                { key: 'interests', label: 'Interests' },
                { key: 'customerType', label: 'Customer Type' },
                { key: 'languages', label: 'Languages' },
                { key: 'device', label: 'Device Preference' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="label">{f.label}</label>
                  <input value={audience[f.key]} onChange={(e) => setAudience({ ...audience, [f.key]: e.target.value })} className="input" />
                </div>
              ))}
              <div>
                <label className="label">Age Range</label>
                <div className="flex gap-2">
                  <input type="number" value={audience.ageMin} onChange={(e) => setAudience({ ...audience, ageMin: e.target.value })} className="input" />
                  <span className="self-center text-gray-400">to</span>
                  <input type="number" value={audience.ageMax} onChange={(e) => setAudience({ ...audience, ageMax: e.target.value })} className="input" />
                </div>
              </div>
            </div>
            <button onClick={handleGenerateAudience} className="btn-secondary w-full">
              <Wand2 className="h-4 w-4" /> Generate Audience with AI
            </button>
            {aiAudience && (
              <AIRecommendation title="AI Audience Suggestions">
                <p><strong>Primary:</strong> {aiAudience.primary}</p>
                <p className="mt-1"><strong>Secondary:</strong> {aiAudience.secondary}</p>
              </AIRecommendation>
            )}
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="btn-secondary"><ArrowLeft className="h-4 w-4" /> Back</button>
            <button onClick={() => setStep(3)} className="btn-gradient">Continue <ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
          <div className="card space-y-4">
            <h3 className="font-semibold">Campaign Budget</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">Daily Budget ($)</label><input type="number" value={budget.daily} onChange={(e) => setBudget({ ...budget, daily: e.target.value })} className="input" /></div>
              <div><label className="label">Total Budget ($)</label><input type="number" value={budget.total} onChange={(e) => setBudget({ ...budget, total: e.target.value })} className="input" /></div>
              <div><label className="label">Start Date</label><input type="date" value={budget.startDate} onChange={(e) => setBudget({ ...budget, startDate: e.target.value })} className="input" /></div>
              <div><label className="label">End Date</label><input type="date" value={budget.endDate} onChange={(e) => setBudget({ ...budget, endDate: e.target.value })} className="input" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mt-4">
              {[{ l: 'Est. Reach', v: '245K-380K' }, { l: 'Est. Clicks', v: '12.4K-18.6K' }, { l: 'Est. Conversions', v: '620-930' }, { l: 'Est. CPA', v: '$18.50-$24.20' }].map((m) => (
                <div key={m.l} className="rounded-xl bg-brand-gradient-subtle p-3 text-center">
                  <p className="text-xs text-gray-500">{m.l}</p>
                  <p className="font-bold text-brand-primary dark:text-indigo-400">{m.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="btn-secondary"><ArrowLeft className="h-4 w-4" /> Back</button>
            <button onClick={handleGenerateCampaign} className="btn-gradient"><Sparkles className="h-4 w-4" /> Generate Campaign</button>
          </div>
        </div>
      )}

      {step === 4 && <AIProcessingLoader stages={AI_CAMPAIGN_STAGES} activeStage={aiStage} />}

      {step === 5 && campaign && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-4 flex-wrap">
            <AIConfidenceBadge confidence={91} />
            <h3 className="text-lg font-semibold">{campaign.campaignName}</h3>
            {campaign.creativeOptions && (
              <span className="text-xs text-text-muted rounded-lg bg-gray-50 px-2 py-1">
                {formatContentTypes(campaign.creativeOptions.contentTypes)} · {campaign.creativeOptions.descriptionSize} · {campaign.creativeOptions.outputCount} outputs
              </span>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {campaign.variants.map((v, i) => (
              <button key={v.id} onClick={() => setActiveVariant(i)} className={`whitespace-nowrap rounded-xl border px-4 py-2 text-sm font-medium cursor-pointer ${activeVariant === i ? 'border-brand-primary bg-brand-gradient-subtle text-brand-primary' : 'border-gray-200 dark:border-gray-800'}`}>
                {v.name}
              </button>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card">
              <img src={resolveImage(campaign.squareCreative)} alt="Creative" className="w-full rounded-xl mb-4" />
              <div className="grid grid-cols-3 gap-2">
                <img src={resolveImage(campaign.storyCreative)} alt="Story" className="rounded-lg" />
                <img src={resolveImage(campaign.squareCreative)} alt="Square" className="rounded-lg" />
                <img src={resolveImage(campaign.verticalCreative)} alt="Vertical" className="rounded-lg" />
              </div>
              <div className="mt-3 rounded-xl bg-gray-100 p-4 text-center text-sm text-gray-500 dark:bg-gray-800">Video ad preview placeholder</div>
            </div>
            <div className="card space-y-4">
              <div><label className="label">Headline</label><input value={campaign.variants[activeVariant].headline} className="input" readOnly /></div>
              <div><label className="label">Primary Text</label><textarea value={campaign.variants[activeVariant].primaryText} rows={3} className="input resize-none" readOnly /></div>
              <div><label className="label">CTA</label><input value={campaign.variants[activeVariant].cta} className="input" readOnly /></div>
              <div><label className="label">Creative Concept</label><p className="text-sm text-gray-600 dark:text-slate-400">{campaign.creativeConcept}</p></div>
              <AIRecommendation>{campaign.campaignSummary}</AIRecommendation>
            </div>
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(3)} className="btn-secondary"><ArrowLeft className="h-4 w-4" /> Back</button>
            <button onClick={() => setStep(6)} className="btn-gradient">Select Ad Platforms <ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
          <div className="card">
            <h3 className="font-semibold mb-4">Ad Channel Selection</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {adPlatforms.map((p) => (
                <PlatformCard
                  key={p.id}
                  platformId={p.id}
                  selected={selectedPlatforms.includes(p.id)}
                  onClick={() => setSelectedPlatforms((prev) => prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id])}
                  allocation={allocations[p.name]}
                />
              ))}
            </div>
            <div className="mt-6">
              <BudgetAllocator allocations={allocations} onChange={setAllocations} />
            </div>
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(5)} className="btn-secondary"><ArrowLeft className="h-4 w-4" /> Back</button>
            <button onClick={() => setStep(7)} className="btn-gradient">Review & Launch <ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {step === 7 && (
        <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
          {!launchComplete ? (
            <>
              <div className="card">
                <h3 className="font-semibold mb-4">Campaign Review</h3>
                {launchStage < 0 ? (
                  <div className="space-y-3 text-sm">
                    {['Campaign Overview', 'Creative', 'Copy', 'Audience', 'Budget', 'Channels', 'Schedule', 'Tracking'].map((s) => (
                      <div key={s} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                        <span>{s}</span><span className="text-emerald-500">Ready</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {launchStages.map((s, i) => (
                      <div key={s} className={`flex items-center gap-3 text-sm ${i <= launchStage ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                        <div className={`h-2 w-2 rounded-full ${i < launchStage ? 'bg-emerald-500' : i === launchStage ? 'bg-brand-primary animate-pulse' : 'bg-gray-300'}`} />
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {launchStage < 0 && (
                <button onClick={handleLaunch} className="btn-gradient w-full py-3">Launch Campaign</button>
              )}
            </>
          ) : (
            <div className="card text-center py-8">
              <Sparkles className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold">Campaign launched successfully!</h3>
              <p className="text-gray-500 mt-2">Redirecting to campaign dashboard...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
