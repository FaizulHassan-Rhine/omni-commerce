'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import ProgressStepper from '@/components/ui/ProgressStepper';
import UploadDropzone, { PromptInput } from '@/components/ui/UploadDropzone';
import AIProcessingLoader from '@/components/ui/AIProcessingLoader';
import CampaignAdReview from '@/components/ui/CampaignAdReview';
import { BudgetAllocator } from '@/components/ui/PublishingStatus';
import { PlatformCard } from '@/components/ui/PlatformIcon';
import AIRecommendation, { AIConfidenceBadge } from '@/components/ui/AIRecommendation';
import Tabs, { TabPanel } from '@/components/ui/Tabs';
import StatusBadge from '@/components/ui/StatusBadge';
import CreativeOptions, { defaultCreativeOptions, formatContentTypes } from '@/components/ui/CreativeOptions';
import { resolveImage } from '@/lib/images';
import { cn } from '@/lib/utils';
import { isItemApproved } from '@/lib/journey';
import { generateCampaignAds } from '@/lib/campaign-review';
import { AI_CAMPAIGN_STAGES, generateCampaignContent, generatePlatformAudienceSuggestions, generatePlatformBudgetPlan, simulateAIProcessing } from '@/lib/mock-ai';
import { useApp } from '@/context/AppContext';
import { ArrowRight, ArrowLeft, Sparkles, Wand2, Search } from 'lucide-react';
import Link from 'next/link';

const steps = [
  { id: 'product', label: 'Choose Product' },
  { id: 'objective', label: 'Campaign Goal' },
  { id: 'platforms', label: 'Ad Platforms' },
  { id: 'audience', label: 'Audience' },
  { id: 'budget', label: 'Budget' },
  { id: 'generate', label: 'Generate Campaign' },
  { id: 'review', label: 'Review Creative' },
  { id: 'launch', label: 'Launch' },
];

const objectives = ['Sales', 'Conversions', 'Traffic', 'Brand Awareness', 'Engagement', 'Leads', 'Product Launch', 'Retargeting'];

const adPlatforms = [
  { id: 'meta-ads', name: 'Meta Ads' },
  { id: 'google-ads', name: 'Google Ads' },
  { id: 'tiktok-ads', name: 'TikTok Ads' },
  { id: 'microsoft-ads', name: 'Microsoft Ads' },
];

export default function CreateCampaignWizard() {
  const searchParams = useSearchParams();
  const { addToast, upsertCampaign, catalogProducts } = useApp();
  const campaignReadyProducts = catalogProducts.filter((product) => isItemApproved(product.status));
  const presetProduct = campaignReadyProducts.find((p) => p.id === searchParams.get('product'));
  const [step, setStep] = useState(presetProduct ? 1 : 0);
  const [prompt, setPrompt] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(presetProduct || null);
  const [creativeOptions, setCreativeOptions] = useState(defaultCreativeOptions);
  const canContinue = uploadedFiles.length > 0 || !!selectedProduct;
  const [objective, setObjective] = useState('Sales');
  const [platformAudiences, setPlatformAudiences] = useState([]);
  const [activeAudienceTab, setActiveAudienceTab] = useState(null);
  const [platformBudgetPlan, setPlatformBudgetPlan] = useState(null);
  const [activeBudgetTab, setActiveBudgetTab] = useState(null);
  const [budget, setBudget] = useState({ startDate: '2026-08-20', endDate: '2026-09-20' });
  const [aiStage, setAiStage] = useState(0);
  const [campaign, setCampaign] = useState(null);
  const [campaignAds, setCampaignAds] = useState([]);
  const [activeCampaignAdId, setActiveCampaignAdId] = useState(null);
  const [activeVariant, setActiveVariant] = useState(0);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [allocations, setAllocations] = useState({});
  const [launchStage, setLaunchStage] = useState(-1);
  const [submittedForApproval, setSubmittedForApproval] = useState(false);

  const launchStages = [
    'Preparing campaign for review...',
    'Adding campaign to Campaigns page...',
    'Queued for approval on the Campaigns page.',
  ];

  const handleGenerateAudience = () => {
    const suggestions = generatePlatformAudienceSuggestions(selectedPlatforms, objective);
    setPlatformAudiences(suggestions);
    setActiveAudienceTab(suggestions[0]?.platformId || null);
  };

  const activeAudience = platformAudiences.find((item) => item.platformId === activeAudienceTab) || platformAudiences[0];

  const handleGenerateBudgetPlan = () => {
    const plan = generatePlatformBudgetPlan(selectedPlatforms, objective);
    setPlatformBudgetPlan(plan);
    setActiveBudgetTab(plan.platforms[0]?.platformId || null);
    setBudget({ startDate: plan.startDate, endDate: plan.endDate });
    const nextAllocations = {};
    plan.platforms.forEach((platform) => {
      nextAllocations[platform.platformName] = platform.allocationPct;
    });
    setAllocations(nextAllocations);
  };

  const activeBudget = platformBudgetPlan?.platforms.find((item) => item.platformId === activeBudgetTab)
    || platformBudgetPlan?.platforms[0];

  const updatePlatformAudience = (platformId, key, value) => {
    setPlatformAudiences((prev) =>
      prev.map((item) => (item.platformId === platformId ? { ...item, [key]: value } : item))
    );
  };

  const updatePlatformBudget = (platformId, dailyBudget) => {
    setPlatformBudgetPlan((prev) => {
      if (!prev) return prev;
      const platforms = prev.platforms.map((item) =>
        item.platformId === platformId ? { ...item, dailyBudget: Number(dailyBudget) || 0 } : item
      );
      const totalDaily = platforms.reduce((sum, item) => sum + item.dailyBudget, 0);
      return {
        ...prev,
        platforms,
        totalDaily,
        totalCampaign: totalDaily * 30,
      };
    });
  };

  const togglePlatform = (platformId) => {
    setSelectedPlatforms((prev) => {
      const next = prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId];
      if (!next.includes(platformId)) {
        setPlatformAudiences((items) => items.filter((item) => item.platformId !== platformId));
        setPlatformBudgetPlan((plan) =>
          plan ? { ...plan, platforms: plan.platforms.filter((item) => item.platformId !== platformId) } : plan
        );
      }
      return next;
    });
  };

  const handleGenerateCampaign = async () => {
    setStep(5);
    await simulateAIProcessing(AI_CAMPAIGN_STAGES, (stage) => setAiStage(stage), 700);
    const productName = selectedProduct?.name || prompt || 'Premium Leather Wallet';
    const camp = generateCampaignContent({ objective, productName });
    camp.creativeOptions = creativeOptions;
    camp.platformAudiences = platformAudiences;
    camp.platformBudgetPlan = platformBudgetPlan;
    camp.selectedPlatforms = selectedPlatforms;
    const imageSource = uploadedFiles[0]?.preview || (selectedProduct ? resolveImage(selectedProduct.image) : null);
    if (imageSource) {
      camp.generatedImage = imageSource;
      camp.squareCreative = imageSource;
    }
    camp.imageScale = 100;
    camp.imageOffsetX = 0;
    camp.imageOffsetY = 0;
    camp.imageBrightness = 100;
    camp.imageContrast = 100;
    camp.overlayTitle = '';
    camp.overlayPosition = 'bottom-left';
    camp.overlaySize = 'medium';
    camp.overlayColor = '#FFFFFF';
    camp.mediaUrl = camp.squareCreative;
    setCampaign(camp);
    const ads = generateCampaignAds({
      platformIds: selectedPlatforms,
      campaign: camp,
      variant: camp.variants[0],
      platformAudiences,
      platformBudgetPlan,
      sourceImage: imageSource,
    });
    setCampaignAds(ads);
    setActiveCampaignAdId(ads[0]?.id || null);
    setActiveVariant(0);
    setStep(6);
  };

  const updateCampaignAd = (id, patch) => {
    setCampaignAds((prev) => prev.map((ad) => (ad.id === id ? { ...ad, ...patch } : ad)));
  };

  const applyVariantToAds = (variantIndex, camp = campaign) => {
    const variant = camp?.variants?.[variantIndex];
    if (!variant) return;
    setCampaignAds((prev) =>
      prev.map((ad) => ({
        ...ad,
        headline: variant.headline,
        primaryText: variant.primaryText,
        adText: variant.primaryText.split('.')[0] || variant.primaryText,
        description: variant.primaryText.slice(0, 90),
        cta: variant.cta,
      }))
    );
  };

  const handleUpload = (files) => {
    setUploadedFiles(files);
    if (files.length > 0) setSelectedProduct(null);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setUploadedFiles([]);
  };

  const filteredProducts = campaignReadyProducts.filter((product) => {
    const query = productSearch.trim().toLowerCase();
    if (!query) return true;
    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query)
    );
  });

  const handleLaunch = async () => {
    upsertCampaign({
      name: campaign?.campaignName || `${selectedProduct?.name || 'Product'} — ${objective} Campaign`,
      status: 'Needs Review',
      objective,
      channels: selectedPlatforms,
      spend: 0,
      revenue: 0,
      roas: 0,
      conversions: 0,
      ctr: 0,
      cpa: 0,
      impressions: 0,
      clicks: 0,
      startDate: budget.startDate || new Date().toISOString().slice(0, 10),
      endDate: budget.endDate || null,
      budget: {
        daily: platformBudgetPlan?.totalDaily || 50,
        total: platformBudgetPlan?.totalCampaign || null,
      },
      productId: selectedProduct?.id || null,
      published: false,
    });
    setStep(7);
    for (let i = 0; i < launchStages.length; i++) {
      setLaunchStage(i);
      await new Promise((r) => setTimeout(r, 700));
    }
    setSubmittedForApproval(true);
    addToast('success', 'Campaign added to Campaigns. Approve it first, then publish to go live.');
  };

  return (
    <div>
      <PageHeader title="Create Ad Campaign" subtitle="AI-powered campaign creation from product to launch." />
      <ProgressStepper steps={steps} currentStep={step} className="mb-8" />

      {step === 0 && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] animate-fade-in">
          <div className="space-y-6">
            <div className="card">
              <h3 className="font-semibold text-text-primary mb-1">Upload product images</h3>
              <p className="text-sm text-text-secondary mb-4">Upload an image to generate your campaign creative.</p>
              <UploadDropzone files={uploadedFiles} onUpload={handleUpload} />
            </div>
            <div className="card space-y-4">
              <div>
                <h3 className="font-semibold text-text-primary mb-1">Or select existing product</h3>
                <p className="text-sm text-text-secondary">Pick a product from your catalog to run a campaign.</p>
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products by name, category, or SKU..."
                  className="input pl-10"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleSelectProduct(product)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border p-3 text-left transition-all',
                      selectedProduct?.id === product.id
                        ? 'border-brand-primary bg-brand-gradient-subtle ring-1 ring-brand-primary/20'
                        : 'border-gray-200 hover:border-brand-primary/30'
                    )}
                  >
                    <img
                      src={resolveImage(product.image)}
                      alt={product.name}
                      className="h-14 w-14 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text-primary">{product.name}</p>
                      <p className="text-xs text-text-muted">{product.category}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-xs font-semibold text-text-primary">${product.price}</span>
                        <StatusBadge status={product.status} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <p className="rounded-lg border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-text-muted">
                  {campaignReadyProducts.length === 0
                    ? 'Approve a product first, then start a campaign.'
                    : 'No products match your search.'}
                </p>
              )}
            </div>
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold text-text-primary">Add context prompt</h3>
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-text-muted">Optional</span>
              </div>
              <PromptInput value={prompt} onChange={setPrompt} placeholder="Describe your product or campaign idea (optional)..." />
            </div>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
              <button onClick={() => setStep(1)} disabled={!canContinue} className="btn-gradient sm:w-auto">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
              {!canContinue && (
                <p className="text-sm text-text-muted sm:ml-2">
                  Upload an image or select a product from your catalog to continue.
                </p>
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
          {selectedProduct && (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-gray-200/70 bg-white px-3 py-2.5">
              <img src={resolveImage(selectedProduct.image)} alt="" className="h-10 w-10 rounded-lg object-cover" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text-primary">{selectedProduct.name}</p>
                <p className="text-xs text-text-muted">SKU: {selectedProduct.sku} · {selectedProduct.category}</p>
              </div>
            </div>
          )}
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
        <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
          <div className="card">
            <h3 className="font-semibold mb-1">Select ad platforms</h3>
            <p className="text-sm text-text-secondary mb-4">
              Choose where this campaign will run. AI will tailor audience and budget for each platform next.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {adPlatforms.map((p) => (
                <PlatformCard
                  key={p.id}
                  platformId={p.id}
                  selected={selectedPlatforms.includes(p.id)}
                  onClick={() => togglePlatform(p.id)}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="btn-secondary"><ArrowLeft className="h-4 w-4" /> Back</button>
            <button
              onClick={() => {
                handleGenerateAudience();
                setStep(3);
              }}
              disabled={selectedPlatforms.length === 0}
              className="btn-gradient"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Platform audience suggestions</h3>
              <p className="text-sm text-text-secondary">
                AI recommendations based on your selected ad platforms and campaign goal.
              </p>
            </div>
            <button onClick={handleGenerateAudience} className="btn-secondary">
              <Wand2 className="h-4 w-4" /> Regenerate with AI
            </button>
          </div>

          {platformAudiences.length > 0 && (
            <div className="card overflow-hidden p-0">
              <Tabs
                tabs={platformAudiences.map((item) => ({
                  id: item.platformId,
                  label: item.platformName,
                }))}
                activeTab={activeAudienceTab || platformAudiences[0]?.platformId}
                onChange={setActiveAudienceTab}
                className="border-b border-gray-200 px-4 pt-2 dark:border-gray-800"
              />
              {activeAudience && (
                <TabPanel className="px-6 pb-6 pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-semibold text-text-primary">{activeAudience.platformName}</h4>
                      <span className="rounded-md bg-brand-gradient-subtle px-2 py-1 text-[11px] font-medium text-brand-primary">{objective}</span>
                    </div>
                    <AIRecommendation title="AI audience insight">{activeAudience.aiNote}</AIRecommendation>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        { key: 'location', label: 'Location' },
                        { key: 'gender', label: 'Gender' },
                        { key: 'interests', label: 'Interests' },
                        { key: 'customerType', label: 'Customer Type' },
                        { key: 'languages', label: 'Languages' },
                        { key: 'device', label: 'Device' },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="label">{field.label}</label>
                          <input
                            value={activeAudience[field.key]}
                            onChange={(e) => updatePlatformAudience(activeAudience.platformId, field.key, e.target.value)}
                            className="input"
                          />
                        </div>
                      ))}
                      <div className="sm:col-span-2">
                        <label className="label">Age range</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={activeAudience.ageMin}
                            onChange={(e) => updatePlatformAudience(activeAudience.platformId, 'ageMin', e.target.value)}
                            className="input"
                          />
                          <span className="self-center text-gray-400">to</span>
                          <input
                            type="number"
                            value={activeAudience.ageMax}
                            onChange={(e) => updatePlatformAudience(activeAudience.platformId, 'ageMax', e.target.value)}
                            className="input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              )}
            </div>
          )}

          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="btn-secondary"><ArrowLeft className="h-4 w-4" /> Back</button>
            <button
              onClick={() => {
                handleGenerateBudgetPlan();
                setStep(4);
              }}
              disabled={platformAudiences.length === 0}
              className="btn-gradient"
            >
              Continue to Budget <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 4 && platformBudgetPlan && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Platform budget plan</h3>
              <p className="text-sm text-text-secondary">
                Each platform has different pricing. Adjust daily spend per channel before generating creatives.
              </p>
            </div>
            <button onClick={handleGenerateBudgetPlan} className="btn-secondary">
              <Wand2 className="h-4 w-4" /> Recalculate with AI
            </button>
          </div>
          <AIRecommendation title="AI budget guidance">{platformBudgetPlan.aiNote}</AIRecommendation>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="card text-center">
              <p className="text-xs text-text-muted">Total daily</p>
              <p className="text-xl font-bold text-brand-primary">${platformBudgetPlan.totalDaily}</p>
            </div>
            <div className="card text-center">
              <p className="text-xs text-text-muted">Total campaign</p>
              <p className="text-xl font-bold text-brand-primary">${platformBudgetPlan.totalCampaign}</p>
            </div>
            <div className="card text-center">
              <p className="text-xs text-text-muted">Start date</p>
              <input type="date" value={budget.startDate} onChange={(e) => setBudget({ ...budget, startDate: e.target.value })} className="input mt-1" />
            </div>
            <div className="card text-center">
              <p className="text-xs text-text-muted">End date</p>
              <input type="date" value={budget.endDate} onChange={(e) => setBudget({ ...budget, endDate: e.target.value })} className="input mt-1" />
            </div>
          </div>

          <div className="card overflow-hidden p-0">
            <Tabs
              tabs={platformBudgetPlan.platforms.map((item) => ({
                id: item.platformId,
                label: item.platformName,
              }))}
              activeTab={activeBudgetTab || platformBudgetPlan.platforms[0]?.platformId}
              onChange={setActiveBudgetTab}
              className="border-b border-gray-200 px-4 pt-2 dark:border-gray-800"
            />
            {activeBudget && (
              <TabPanel className="px-6 pb-6 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-semibold text-text-primary">{activeBudget.platformName}</h4>
                    <span className="text-xs font-semibold text-brand-primary">{activeBudget.allocationPct}% share</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-text-muted">Avg CPC</p>
                      <p className="font-semibold">${activeBudget.avgCpc.toFixed(2)}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-text-muted">Avg CPM</p>
                      <p className="font-semibold">${activeBudget.avgCpm.toFixed(2)}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-text-muted">Est. reach</p>
                      <p className="font-semibold">{activeBudget.estReach}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-text-muted">Est. clicks</p>
                      <p className="font-semibold">{activeBudget.estClicks}</p>
                    </div>
                  </div>
                  <div>
                    <label className="label">Daily budget ($)</label>
                    <input
                      type="number"
                      value={activeBudget.dailyBudget}
                      onChange={(e) => updatePlatformBudget(activeBudget.platformId, e.target.value)}
                      className="input"
                    />
                  </div>
                </div>
              </TabPanel>
            )}
          </div>
          {Object.keys(allocations).length > 0 && (
            <div className="card">
              <BudgetAllocator allocations={allocations} onChange={setAllocations} />
            </div>
          )}
          <div className="flex justify-between">
            <button onClick={() => setStep(3)} className="btn-secondary"><ArrowLeft className="h-4 w-4" /> Back</button>
            <button onClick={handleGenerateCampaign} className="btn-gradient"><Sparkles className="h-4 w-4" /> Generate Campaign</button>
          </div>
        </div>
      )}

      {step === 5 && <AIProcessingLoader stages={AI_CAMPAIGN_STAGES} activeStage={aiStage} />}

      {step === 6 && campaign && campaignAds.length > 0 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <div className="flex items-center gap-4 flex-wrap">
              <AIConfidenceBadge confidence={91} />
              <h3 className="text-lg font-semibold">{campaign.campaignName}</h3>
              {campaign.creativeOptions && (
                <span className="text-xs text-text-muted rounded-lg bg-gray-50 px-2 py-1">
                  {formatContentTypes(campaign.creativeOptions.contentTypes)} · {campaign.creativeOptions.descriptionSize} · {campaign.creativeOptions.outputCount} outputs
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-text-secondary">
              Preview how your ad will look on each platform before launch. Switch platforms on the left and fine-tune copy and creative on the right.
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {campaign.variants.map((v, i) => (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setActiveVariant(i);
                  applyVariantToAds(i);
                }}
                className={cn(
                  'whitespace-nowrap rounded-xl border px-4 py-2 text-sm font-medium cursor-pointer',
                  activeVariant === i
                    ? 'border-brand-primary bg-brand-gradient-subtle text-brand-primary'
                    : 'border-gray-200 dark:border-gray-800'
                )}
              >
                {v.name}
              </button>
            ))}
          </div>

          <CampaignAdReview
            ads={campaignAds}
            activeId={activeCampaignAdId}
            onSelect={setActiveCampaignAdId}
            onChange={updateCampaignAd}
          />

          <AIRecommendation>{campaign.campaignSummary}</AIRecommendation>

          <div className="flex justify-between">
            <button onClick={() => setStep(4)} className="btn-secondary"><ArrowLeft className="h-4 w-4" /> Back</button>
            <button onClick={() => setStep(7)} className="btn-gradient">Review & Launch <ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {step === 7 && (
        <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
          {!submittedForApproval ? (
            <>
              <div className="card">
                <h3 className="font-semibold mb-4">Campaign Review</h3>
                {launchStage < 0 ? (
                  <div className="space-y-4 text-sm">
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                      <p className="font-medium text-text-primary">Objective</p>
                      <p className="text-text-secondary">{objective}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                      <p className="font-medium text-text-primary">Ad platforms</p>
                      <p className="text-text-secondary">{selectedPlatforms.map((id) => adPlatforms.find((p) => p.id === id)?.name).filter(Boolean).join(', ')}</p>
                    </div>
                    {platformBudgetPlan && (
                      <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                        <p className="font-medium text-text-primary">Budget</p>
                        <p className="text-text-secondary">${platformBudgetPlan.totalDaily}/day · ${platformBudgetPlan.totalCampaign} total</p>
                      </div>
                    )}
                    {platformAudiences.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-medium text-text-primary">Audience by platform</p>
                        {platformAudiences.map((item) => (
                          <div key={item.platformId} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                            <p className="font-medium">{item.platformName}</p>
                            <p className="text-text-secondary">{item.location} · Ages {item.ageMin}-{item.ageMax} · {item.interests}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {['Creative', 'Copy', 'Schedule', 'Tracking'].map((s) => (
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
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <button onClick={() => setStep(6)} className="btn-secondary"><ArrowLeft className="h-4 w-4" /> Back</button>
                  <button onClick={handleLaunch} className="btn-gradient sm:min-w-[220px] py-3">Launch Campaign</button>
                </div>
              )}
            </>
          ) : (
            <div className="card text-center py-8">
              <Sparkles className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold">Sent for approval</h3>
              <p className="text-gray-500 mt-2">
                This campaign is on the Campaigns page and waits for approval before it can go live.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link href="/campaigns" className="btn-gradient">View Campaigns</Link>
                <Link href="/campaigns/create" className="btn-secondary">Create another</Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
