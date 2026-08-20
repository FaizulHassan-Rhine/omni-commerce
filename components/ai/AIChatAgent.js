'use client';

import { useEffect, useRef, useState } from 'react';
import { generateAIAnalystResponse } from '@/lib/mock-ai';
import { cn } from '@/lib/utils';
import { Send, Sparkles, TrendingDown, TrendingUp, X } from 'lucide-react';

const SUGGESTIONS = [
  'Why did ROAS drop this week?',
  'Which products should get more budget?',
  'What should I fix before launching?',
];

export default function AIChatAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading, open]);

  const askQuestion = async (question) => {
    const text = question.trim();
    if (!text || loading) return;
    setOpen(true);
    setLoading(true);
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    await new Promise((r) => setTimeout(r, 900));
    const response = generateAIAnalystResponse(text);
    setMessages((prev) => [...prev, { role: 'ai', content: response }]);
    setLoading(false);
  };

  return (
    <>
      {open && (
        <div className="ai-chat-panel animate-slide-up overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-soft">
          <div className="flex items-center justify-between bg-brand-gradient px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <div>
                <p className="text-sm font-semibold leading-tight">AI Assistant</p>
                <p className="text-[11px] text-white/80">Ask about products, campaigns, and performance</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={listRef} className="flex max-h-[min(28rem,55vh)] min-h-[18rem] flex-col gap-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="flex flex-1 flex-col justify-center gap-2">
                <p className="text-center text-sm text-text-muted">
                  I can help with ROAS, budget, listings, and what to fix before you launch.
                </p>
                {SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => askQuestion(q)}
                    className="rounded-xl border border-gray-200 px-3 py-2 text-left text-xs text-text-secondary hover:border-brand-primary/30 hover:text-brand-primary"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                {msg.role === 'user' ? (
                  <div className="max-w-[85%] rounded-2xl bg-brand-gradient px-3 py-2 text-sm text-white">
                    {msg.content}
                  </div>
                ) : (
                  <div className="max-w-[90%] rounded-2xl border border-gray-200 bg-gray-50 p-3">
                    <p className="text-sm text-text-secondary">{msg.content.explanation}</p>
                    <div className="mt-2 grid grid-cols-3 gap-1.5">
                      {msg.content.metrics.map((m) => (
                        <div key={m.label} className="rounded-lg bg-white p-1.5 text-center">
                          <p className="text-[10px] text-text-muted">{m.label}</p>
                          <p
                            className={cn(
                              'flex items-center justify-center gap-0.5 text-xs font-bold',
                              m.trend === 'down' ? 'text-red-500' : m.trend === 'up' ? 'text-emerald-500' : 'text-text-primary'
                            )}
                          >
                            {m.trend === 'down' ? <TrendingDown className="h-3 w-3" /> : null}
                            {m.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : null}
                            {m.value}
                          </p>
                        </div>
                      ))}
                    </div>
                    <ul className="mt-2 space-y-1">
                      {msg.content.recommendations.map((r) => (
                        <li key={r} className="text-[11px] text-text-muted">
                          • {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Sparkles className="h-3.5 w-3.5 animate-pulse text-brand-primary" />
                Thinking…
              </div>
            )}
          </div>

          <form
            className="flex gap-2 border-t border-gray-100 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              askQuestion(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything…"
              className="input flex-1 text-sm"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} className="btn-gradient px-3">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="siri-orb cursor-pointer"
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
        aria-expanded={open}
      >
        <span className="siri-orb-core">
          {open ? (
            <X className="relative h-6 w-6 text-white drop-shadow" />
          ) : (
            <Sparkles className="relative h-6 w-6 text-white drop-shadow" />
          )}
        </span>
      </button>
    </>
  );
}
