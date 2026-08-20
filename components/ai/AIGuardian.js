'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { resolveImage } from '@/lib/images';
import { getGuardianCounts, getGuardianIssues } from '@/lib/ai-guardian';
import { useApp } from '@/context/AppContext';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Megaphone,
  Package,
  RefreshCw,
  Sparkles,
  X,
} from 'lucide-react';

const FILTERS = [
  { id: 'all', label: 'All issues' },
  { id: 'product', label: 'Products' },
  { id: 'campaign', label: 'Campaigns' },
  { id: 'Error', label: 'Error' },
  { id: 'Warning', label: 'Warning' },
  { id: 'Info', label: 'Info' },
];

const severityStyles = {
  Error: {
    accent: 'border-l-brand-primary',
    iconWrap: 'bg-brand-muted text-brand-primary',
    tag: 'bg-brand-muted text-brand-primary',
    Icon: AlertCircle,
  },
  Warning: {
    accent: 'border-l-brand-secondary',
    iconWrap: 'bg-brand-secondary/10 text-brand-secondary',
    tag: 'bg-brand-secondary/10 text-brand-secondary',
    Icon: AlertTriangle,
  },
  Info: {
    accent: 'border-l-brand-accent',
    iconWrap: 'bg-brand-gradient-subtle text-brand-accent',
    tag: 'bg-brand-gradient-subtle text-brand-primary',
    Icon: Info,
  },
};

export default function AIGuardian() {
  const pathname = usePathname();
  const { addToast } = useApp();
  const [phase, setPhase] = useState('idle');
  const [filter, setFilter] = useState('all');
  const [scanning, setScanning] = useState(false);
  const [issues, setIssues] = useState(() => getGuardianIssues().map((item) => ({ ...item, resolved: false })));

  const open = phase === 'open' || phase === 'expanding';

  useEffect(() => {
    if (phase !== 'expanding') return undefined;
    const timer = setTimeout(() => setPhase('open'), 1050);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    setPhase('idle');
    setFilter('all');
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') closePanel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const counts = useMemo(() => getGuardianCounts(issues), [issues]);
  const visible = issues.filter((item) => {
    if (item.resolved) return false;
    if (filter === 'all') return true;
    if (filter === 'product' || filter === 'campaign') return item.entityType === filter;
    return item.severity === filter;
  });

  const openPanel = () => {
    if (phase !== 'idle') return;
    setPhase('expanding');
  };

  const closePanel = () => {
    setPhase('idle');
    setFilter('all');
  };

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

  return (
    <>
      {phase === 'idle' && (
        <button
          type="button"
          onClick={openPanel}
          className="siri-orb cursor-pointer"
          aria-label="Open AI Guardian"
        >
          <span className="siri-orb-core">
            <Sparkles className="relative h-6 w-6 text-white drop-shadow" />
          </span>
        </button>
      )}

      {phase === 'expanding' && (
        <div className="pointer-events-none fixed inset-0 top-16 z-40 overflow-hidden lg:left-56">
          <div className="siri-page-glow">
            <span className="blob blob-a" />
            <span className="blob blob-b" />
            <span className="blob blob-c" />
          </div>
        </div>
      )}

      {phase === 'open' && (
        <div className="fixed inset-0 top-16 z-30 flex flex-col bg-bg-light animate-fade-in lg:left-56">
          <div className="flex items-center justify-between gap-4 border-b border-gray-200/80 bg-white px-4 py-4 shadow-header sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-primary">AI Guardian</h2>
                <p className="text-sm text-text-muted">
                  Existing products and campaigns that need improvement before you launch or scale.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={runScan} disabled={scanning} className="btn-secondary text-xs">
                <RefreshCw className={cn('h-3.5 w-3.5', scanning && 'animate-spin')} />
                {scanning ? 'Scanning…' : 'Run scan'}
              </button>
              <button type="button" onClick={closePanel} className="rounded-lg p-2 text-text-muted hover:bg-gray-100 hover:text-text-primary" aria-label="Close AI Guardian">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="page-container py-6 pb-24 lg:pb-8">
              <div className="grid gap-4 sm:grid-cols-3">
                <SummaryCard label="Errors" value={counts.error} icon={AlertCircle} tone="primary" />
                <SummaryCard label="Warnings" value={counts.warning} icon={AlertTriangle} tone="secondary" />
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
                  visible.map((item) => {
                    const style = severityStyles[item.severity];
                    const SeverityIcon = style.Icon;
                    const EntityIcon = item.entityType === 'campaign' ? Megaphone : Package;
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          'flex flex-col gap-3 rounded-xl border border-gray-200/70 border-l-4 bg-white p-4 shadow-card sm:flex-row sm:items-center',
                          style.accent
                        )}
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
          </div>
        </div>
      )}
    </>
  );
}

function SummaryCard({ label, value, icon: Icon, tone }) {
  const tones = {
    primary: 'text-brand-primary bg-brand-muted',
    secondary: 'text-brand-secondary bg-brand-secondary/10',
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
