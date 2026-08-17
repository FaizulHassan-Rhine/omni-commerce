'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { generateAIAnalystResponse } from '@/lib/mock-ai';
import { Sparkles, Send, TrendingDown, TrendingUp } from 'lucide-react';

const suggestedQuestions = [
  'Why did ROAS decrease this week?',
  'Which product should receive more budget?',
  'Which creative performs best?',
  'Which platform is wasting budget?',
  'Should I pause any campaign?',
];

export default function AIAnalystPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const askQuestion = async (question) => {
    setLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    await new Promise((r) => setTimeout(r, 1500));
    const response = generateAIAnalystResponse(question);
    setMessages((prev) => [...prev, { role: 'ai', content: response }]);
    setLoading(false);
    setInput('');
  };

  return (
    <div className="page-container pb-20">
      <PageHeader title="AI Marketing Analyst" subtitle="Ask questions about your performance data." />

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Suggested Questions</p>
          {suggestedQuestions.map((q) => (
            <button key={q} onClick={() => askQuestion(q)} className="w-full rounded-xl border border-gray-200 p-3 text-left text-sm hover:border-brand-primary/30 cursor-pointer dark:border-gray-800">
              {q}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 card flex flex-col min-h-[500px]">
          <div className="flex-1 space-y-4 overflow-y-auto mb-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Sparkles className="h-12 w-12 mb-4 text-brand-primary/30" />
                <p>Ask me anything about your marketing performance.</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  <div className="rounded-2xl bg-brand-gradient px-4 py-3 text-sm text-white max-w-md">{msg.content}</div>
                ) : (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 max-w-lg dark:border-gray-800 dark:bg-gray-800/50">
                    <p className="text-sm text-gray-700 dark:text-slate-300">{msg.content.explanation}</p>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {msg.content.metrics.map((m) => (
                        <div key={m.label} className="rounded-lg bg-white p-2 text-center dark:bg-gray-900">
                          <p className="text-xs text-gray-400">{m.label}</p>
                          <p className={`text-sm font-bold flex items-center justify-center gap-1 ${m.trend === 'down' ? 'text-red-500' : m.trend === 'up' ? 'text-emerald-500' : ''}`}>
                            {m.trend === 'down' ? <TrendingDown className="h-3 w-3" /> : m.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : null}
                            {m.value}
                          </p>
                        </div>
                      ))}
                    </div>
                    <ul className="mt-3 space-y-1">
                      {msg.content.recommendations.map((r) => (
                        <li key={r} className="text-xs text-gray-600 dark:text-slate-400">• {r}</li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.content.actions.map((a) => (
                        <button key={a.label} className={`text-xs rounded-lg px-3 py-1.5 cursor-pointer ${a.type === 'primary' ? 'btn-primary' : a.type === 'danger' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' : 'btn-secondary'}`}>
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Sparkles className="h-4 w-4 animate-pulse text-brand-primary" /> Analyzing...
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && input && askQuestion(input)} placeholder="Ask a question..." className="input flex-1" />
            <button onClick={() => input && askQuestion(input)} disabled={loading} className="btn-gradient"><Send className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
