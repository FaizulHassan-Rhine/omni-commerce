'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { resolveImage } from '@/lib/images';
import { getGuardianCounts, getGuardianIssues } from '@/lib/ai-guardian';
import { useApp } from '@/context/AppContext';
import PageHeader from '@/components/ui/PageHeader';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Megaphone,
  Package,
  RefreshCw,
  Shield,
  Sparkles,
} from 'lucide-react';

const FILTERS = [
  { id: 'all', label: 'All issues' },
  { id: 'product', label: 'Products' },
  { id: 'campaign', label: 'Campaigns' },
  { id: 'Error', label: 'Error' },
  { id: 'Warning', label: 'Warning' },
  { id: 'Info', label: 'Info' },
];

const BOOT_MS = 2500;

const BOOT_STAGES = [
  'Scanning catalog listings…',
  'Checking campaign readiness…',
  'Preparing recommendations…',
];

const severityStyles = {
  Error: {
    accent: 'border-l-red-500',
    iconWrap: 'bg-red-50 text-red-600',
    tag: 'bg-red-600 text-white',
    Icon: AlertCircle,
  },
  Warning: {
    accent: 'border-l-amber-400',
    iconWrap: 'bg-amber-50 text-amber-600',
    tag: 'bg-amber-400 text-amber-950',
    Icon: AlertTriangle,
  },
  Info: {
    accent: 'border-l-brand-accent',
    iconWrap: 'bg-brand-gradient-subtle text-brand-accent',
    tag: 'bg-brand-gradient-subtle text-brand-primary',
    Icon: Info,
  },
};

export function AIGuardianPanel() {
  const { addToast } = useApp();
  const [filter, setFilter] = useState('all');
  const [scanning, setScanning] = useState(false);
  const [booting, setBooting] = useState(true);
  const [bootStage, setBootStage] = useState(0);
  const [introGlow, setIntroGlow] = useState(false);
  const [issues, setIssues] = useState(() => getGuardianIssues().map((item) => ({ ...item, resolved: false })));

  useEffect(() => {
    const stageTimers = BOOT_STAGES.map((_, i) =>
      window.setTimeout(() => setBootStage(i), Math.floor((BOOT_MS / BOOT_STAGES.length) * i))
    );
    const done = window.setTimeout(() => {
      setBooting(false);
      setIntroGlow(true);
    }, BOOT_MS);
    return () => {
      stageTimers.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(done);
    };
  }, []);

  useEffect(() => {
    if (!introGlow) return undefined;
    const timer = window.setTimeout(() => setIntroGlow(false), 2400);
    return () => window.clearTimeout(timer);
  }, [introGlow]);

  const counts = useMemo(() => getGuardianCounts(issues), [issues]);
  const visible = issues.filter((item) => {
    if (item.resolved) return false;
    if (filter === 'all') return true;
    if (filter === 'product' || filter === 'campaign') return item.entityType === filter;
    return item.severity === filter;
  });

  const resolveIssue = (id, name) => {
    setIssues((prev) => prev.map((item) => (item.id === id ? { ...item, resolved: true } : item)));
    addToast('success', `AI Guardian applied a fix for ${name}.`);
  };

  const runScan = async () => {
    setScanning(true);
    await new Promise((r) => setTimeout(r, 900));
    setIssues(getGuardianIssues().map((item) => ({ ...item, resolved: false })));
    setScanning(false);
    addToast('success', 'Scan complete — issues refreshed from live catalog and campaigns.');
  };

  if (booting) {
    return <GuardianBootLoader stage={bootStage} />;
  }

  return (
    <>
    {introGlow && (
    <div className="guardian-page-glow" aria-hidden>
      <div className="wash" />
      <span className="blob blob-a" />
      <span className="blob blob-b" />
      <span className="blob blob-c" />
      <div className="sweep" />
    </div>
    )}
    <div className="page-container relative z-10 animate-slide-up pb-20">
      <PageHeader
        title="AI Guardian"
        subtitle="Existing products and campaigns that need improvement before you launch or scale."
        actions={
          <button type="button" onClick={runScan} disabled={scanning} className="btn-secondary text-xs">
            <RefreshCw className={cn('h-3.5 w-3.5', scanning && 'animate-spin')} />
            {scanning ? 'Scanning…' : 'Run scan'}
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Errors" value={counts.error} icon={AlertCircle} tone="error" />
        <SummaryCard label="Warnings" value={counts.warning} icon={AlertTriangle} tone="warning" />
        <SummaryCard label="Resolved" value={counts.resolved} icon={CheckCircle2} tone="muted" />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
              filter === tab.id
                ? 'bg-brand-primary text-white'
                : 'border border-gray-200 bg-white text-text-secondary hover:border-brand-primary/30 hover:text-brand-primary'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {visible.length === 0 ? (
          <div className="card py-16 text-center">
            <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-brand-secondary" />
            <p className="font-medium text-text-primary">Nothing needs attention in this view.</p>
            <p className="mt-1 text-sm text-text-muted">Run a scan after your next product or campaign update.</p>
          </div>
        ) : (
          visible.map((item, index) => {
            const style = severityStyles[item.severity];
            const SeverityIcon = style.Icon;
            const EntityIcon = item.entityType === 'campaign' ? Megaphone : Package;
            return (
              <div
                key={item.id}
                className={cn(
                  'flex flex-col gap-3 rounded-xl border border-gray-200/70 border-l-4 bg-white p-4 shadow-card sm:flex-row sm:items-center animate-slide-up',
                  style.accent
                )}
                style={{ animationDelay: `${80 + index * 45}ms`, animationFillMode: 'both' }}
              >
                <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', style.iconWrap)}>
                  <SeverityIcon className="h-5 w-5" />
                </div>
                {item.image && (
                  <img src={resolveImage(item.image)} alt="" className="hidden h-12 w-12 rounded-lg object-cover sm:block" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-text-primary">{item.name}</p>
                    <span className={cn('rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase', style.tag)}>
                      {item.severity}
                    </span>
                    <span className="rounded-md bg-gray-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-text-muted">
                      {item.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
                      <EntityIcon className="h-3 w-3" />
                      {item.entityType}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">{item.issue}</p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    <Sparkles className="mr-1 inline h-3 w-3 text-brand-primary" />
                    {item.suggestedFix}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link href={item.href} className="btn-secondary py-1.5 text-xs">
                    Open
                  </Link>
                  <button type="button" onClick={() => resolveIssue(item.id, item.name)} className="btn-gradient py-1.5 text-xs">
                    Resolve
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
    </>
  );
}

function GuardianBootLoader({ stage }) {
  const progress = ((stage + 1) / BOOT_STAGES.length) * 100;

  return (
    <div className="page-container flex min-h-[60vh] flex-col items-center justify-center animate-fade-in">
      <div className="relative mb-8">
        <span className="absolute inset-0 rounded-full bg-brand-secondary/20 blur-2xl animate-pulse-soft" aria-hidden />
        <span className="absolute -inset-3 rounded-full border border-brand-secondary/30 animate-guardian-ring" aria-hidden />
        <span className="absolute -inset-6 rounded-full border border-brand-accent/20 animate-guardian-ring [animation-delay:0.4s]" aria-hidden />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow animate-guardian-glow">
          <Shield className="h-9 w-9 text-white" />
          <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-brand-accent animate-pulse" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-text-primary">AI Guardian</h3>
      <p className="mt-2 text-sm text-brand-secondary animate-pulse-soft">
        {BOOT_STAGES[stage]}
      </p>
      <div className="mt-6 w-full max-w-xs">
        <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-brand-gradient transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, tone }) {
  const tones = {
    error: 'text-red-600 bg-red-50',
    warning: 'text-amber-600 bg-amber-50',
    muted: 'text-brand-accent bg-brand-gradient-subtle',
  };
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', tones[tone])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-2 text-3xl font-bold text-text-primary">{value}</p>
    </div>
  );
}
