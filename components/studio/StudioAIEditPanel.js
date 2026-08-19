'use client';

import { useState } from 'react';
import AIRecommendation from '@/components/ui/AIRecommendation';
import { buildAiPatch } from '@/lib/studio-ai';
import { Sparkles, Wand2 } from 'lucide-react';

const actions = [
  { id: 'caption', label: 'Regenerate copy', hint: 'Fresh platform-native copy' },
  { id: 'headline', label: 'Improve headline', hint: 'Sharper hook for this placement' },
  { id: 'optimize', label: 'Optimize for platform', hint: 'Tune tone, length, and CTA' },
  { id: 'all', label: 'Regenerate all fields', hint: 'Rewrite every editable field' },
];

export default function StudioAIEditPanel({ post, fields, onChange, onToast, onRegenerateAll }) {
  const [loading, setLoading] = useState(null);
  const [creativeDirection, setCreativeDirection] = useState('');

  const runAction = async (actionId) => {
    setLoading(actionId);
    await new Promise((r) => setTimeout(r, 900));

    const patch = buildAiPatch(post, fields, actionId, creativeDirection);
    onChange({ ...patch, aiVersion: (post.aiVersion || 0) + 1 });
    setLoading(null);
    onToast?.('success', `AI updated ${post.name} content.`);
  };

  const runRegenerateAllPlatforms = async () => {
    if (!onRegenerateAll) return;
    setLoading('all-platforms');
    await onRegenerateAll(creativeDirection);
    setLoading(null);
  };

  return (
    <div className="card h-fit min-w-0 overflow-hidden p-5 xl:sticky xl:top-24">
      <div className="mb-5 flex items-start gap-3 border-b border-gray-100 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient-subtle">
          <Sparkles className="h-4 w-4 text-brand-primary" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-text-primary">AI Edit Tools</h4>
          <p className="text-xs text-text-muted">
            {post.name}
            {post.aiVersion ? ` · v${post.aiVersion}` : ''}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <label className="label">Creative direction</label>
        <textarea
          value={creativeDirection}
          onChange={(e) => setCreativeDirection(e.target.value)}
          rows={2}
          placeholder="e.g. More premium, highlight RFID, summer tone…"
          className="input resize-none text-sm"
        />
      </div>

      <AIRecommendation title="AI suggestion" className="mb-4 p-4">
        Short copy with a clear CTA performs 18% better on {post.name}. Try regenerating the primary text first.
      </AIRecommendation>

      <div className="space-y-2">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            disabled={!!loading}
            onClick={() => runAction(action.id)}
            className="flex w-full items-start gap-3 rounded-xl border border-gray-200 p-3 text-left transition-colors hover:border-brand-primary/30 hover:bg-brand-gradient-subtle/50 disabled:opacity-60"
          >
            <Wand2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary">
                {loading === action.id ? 'Generating…' : action.label}
              </p>
              <p className="text-xs text-text-muted">{action.hint}</p>
            </div>
          </button>
        ))}

        {onRegenerateAll && (
          <button
            type="button"
            disabled={!!loading}
            onClick={runRegenerateAllPlatforms}
            className="btn-gradient mt-2 w-full text-xs"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {loading === 'all-platforms' ? 'Generating all platforms…' : 'Regenerate all platforms'}
          </button>
        )}
      </div>
    </div>
  );
}
