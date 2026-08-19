'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles, ArrowRight, Upload, Wand2, Share2, BarChart3,
  ChevronDown, Check, Star,
} from 'lucide-react';
import { useState } from 'react';
import { landingNav } from '@/lib/navigation';
import { cn } from '@/lib/utils';

const platforms = ['Meta', 'Google', 'TikTok', 'Amazon', 'Shopify', 'LinkedIn', 'Walmart', 'Pinterest'];

const features = [
  { title: 'AI Product Content', desc: 'Generate titles, descriptions, SEO, and social captions from a single product image or prompt.', icon: Wand2 },
  { title: 'Campaign Factory', desc: 'Build full ad campaigns with A/B variants, audience targeting, and multi-platform allocation.', icon: Sparkles },
  { title: 'Multi-Channel Publishing', desc: 'Publish to social, marketplaces, and commerce platforms from one unified workflow.', icon: Share2 },
  { title: 'AI Content & Visuals', desc: 'Generate content and studio-quality product visuals from a single upload.', icon: Upload },
  { title: 'Unified Analytics', desc: 'Revenue, ROAS, and performance across all channels in one dashboard.', icon: BarChart3 },
];

const plans = [
  { name: 'Starter', price: 29, features: ['500 AI generations/mo', '3 platform connections', 'Basic analytics', 'Email support'] },
  { name: 'Growth', price: 79, popular: true, features: ['2,000 AI generations/mo', '12 platform connections', 'Advanced analytics', 'AI Marketing Analyst', 'Priority support'] },
  { name: 'Scale', price: 199, features: ['Unlimited AI generations', 'Unlimited connections', 'Commerce Intelligence', 'Custom brand kit', 'Dedicated account manager'] },
];

const faqs = [
  { q: 'Do I need technical skills?', a: 'No. OmniCommerce AI is designed for marketers and merchants. Upload a product or describe an idea — AI handles the rest.' },
  { q: 'Which platforms are supported?', a: 'Meta, Google, TikTok, Amazon, Shopify, Walmart, LinkedIn, Pinterest, and more. New integrations are added regularly.' },
  { q: 'Can I edit AI-generated content?', a: 'Absolutely. Every field is editable before publishing. Your brand kit guides AI recommendations throughout.' },
  { q: 'Is there a free trial?', a: 'Yes. Start free with 50 AI generations and 2 platform connections. No credit card required.' },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/80 bg-white shadow-header">
        <div className="page-container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-text-primary">OmniCommerce AI</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            {landingNav.map((item) => {
              const isHash = item.href.startsWith('/#');
              const isActive = isHash
                ? pathname === '/' && false
                : pathname === item.href || pathname.startsWith(item.href + '/');
              const className = cn(
                'text-sm transition-colors',
                isActive ? 'font-medium text-brand-primary' : 'text-text-secondary hover:text-brand-primary'
              );
              return isHash ? (
                <a key={item.label} href={item.href} className={className}>{item.label}</a>
              ) : (
                <Link key={item.label} href={item.href} className={className}>{item.label}</Link>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost hidden sm:inline-flex">Sign In</Link>
            <Link href="/signup" className="btn-gradient">Start Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 py-20 lg:py-32">
        <div className="absolute inset-0 bg-brand-gradient-subtle" />
        <div className="page-container relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-primary dark:text-indigo-400">
              From Product to Campaign — Create, Govern, Publish & Optimize.
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              Turn any product into{' '}
              <span className="gradient-text">content, campaigns, and revenue.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-slate-400">
              Upload a product image or describe an idea. OmniCommerce AI creates your content, generates campaign creatives, adapts them to every channel, and helps you understand what performs.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup" className="btn-gradient px-6 py-3 text-base">
                Start Creating <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/login" className="btn-secondary px-6 py-3 text-base">View Demo</Link>
            </div>
          </div>

          {/* Workflow Preview */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft dark:border-gray-800 dark:bg-surface-dark">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { step: '1', label: 'Upload Product', icon: Upload },
                  { step: '2', label: 'AI Generation', icon: Wand2 },
                  { step: '3', label: 'Multi-Channel Publishing', icon: Share2 },
                  { step: '4', label: 'Analytics', icon: BarChart3 },
                ].map((item, i) => (
                  <div key={item.step} className="relative flex flex-col items-center rounded-xl bg-brand-gradient-subtle p-4 text-center">
                    <item.icon className="mb-2 h-8 w-8 text-brand-primary dark:text-indigo-400" />
                    <span className="text-xs font-medium text-gray-500">Step {item.step}</span>
                    <span className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{item.label}</span>
                    {i < 3 && <ArrowRight className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-gray-300 md:block" />}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {platforms.map((p) => (
                  <span key={p} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:text-slate-400">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works / Product */}
      <section id="product" className="py-20">
        <div className="page-container">
          <h2 className="text-center text-3xl font-bold text-text-primary">How It Works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600 dark:text-slate-400">
            One connected workflow from product to performance.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="card-hover p-6">
                <div className="mb-4 rounded-xl bg-brand-gradient-subtle p-3 w-fit">
                  <f.icon className="h-6 w-6 text-brand-primary dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section id="solutions" className="bg-brand-gradient-subtle py-20">
        <div className="page-container">
          <h2 className="text-center text-3xl font-bold text-text-primary">Trusted by Growth Teams</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { quote: 'OmniCommerce AI cut our content creation time by 80%. We launch campaigns in hours, not weeks.', author: 'Sarah Chen', role: 'Creative Director, Nova Commerce' },
              { quote: 'The closed-loop analytics finally connected our product catalog to ad performance. ROAS up 40%.', author: 'James Wilson', role: 'Media Buyer' },
              { quote: 'Publishing to 8 platforms from one screen changed everything for our small team.', author: 'Emily Rodriguez', role: 'Content Strategist' },
            ].map((t) => (
              <div key={t.author} className="card p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-gray-700 dark:text-slate-300">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">{t.author}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools */}
      <section id="ai-tools" className="py-20 border-t border-gray-200/80 bg-white">
        <div className="page-container">
          <h2 className="text-center text-3xl font-bold text-text-primary">AI Tools</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-text-secondary">
            Powerful AI workflows built for commerce teams.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'AI Content', desc: 'Generate product content and visuals from images.', href: '/create/content' },
              { title: 'AI Campaign', desc: 'Build full ad campaigns with A/B variants.', href: '/create/campaign' },
              { title: 'AI Analyst', desc: 'Ask questions about performance.', href: '/analytics/ai-analyst' },
              { title: 'Catalog Guardian', desc: 'Fix catalog quality issues with AI.', href: '/catalog/guardian' },
            ].map((tool) => (
              <Link key={tool.title} href={tool.href} className="card-hover p-6">
                <h3 className="text-lg font-semibold text-text-primary">{tool.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{tool.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-brand-primary">
                  Open tool <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="py-16 bg-bg-light border-y border-gray-200/80">
        <div className="page-container text-center">
          <h2 className="text-2xl font-bold text-text-primary">Integrations</h2>
          <p className="mt-2 text-text-secondary">Connect Meta, Google, TikTok, Amazon, Shopify, and more.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {platforms.map((p) => (
              <span key={p} className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-text-secondary">{p}</span>
            ))}
          </div>
          <Link href="/connections" className="btn-primary mt-6 inline-flex">Manage Connections</Link>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="page-container">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">Simple Pricing</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.name} className={`card relative p-6 ${plan.popular ? 'border-brand-primary shadow-glow' : ''}`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-white">Most Popular</span>
                )}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="mt-2"><span className="text-4xl font-bold text-gray-900 dark:text-white">${plan.price}</span><span className="text-gray-500">/month</span></p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={`mt-6 block w-full text-center ${plan.popular ? 'btn-gradient' : 'btn-secondary'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50 dark:bg-surface-dark-secondary/30">
        <div className="page-container max-w-2xl">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">FAQ</h2>
          <div className="mt-8 space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-4 text-left cursor-pointer"
                >
                  <span className="font-medium text-gray-900 dark:text-white">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && <p className="border-t border-gray-100 px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:text-slate-400">{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="page-container">
          <div className="rounded-3xl bg-brand-gradient p-12 text-center text-white">
            <h2 className="text-3xl font-bold">Ready to transform your commerce workflow?</h2>
            <p className="mt-4 text-white/80">Start creating content and campaigns in minutes.</p>
            <Link href="/signup" className="mt-8 inline-flex btn bg-white text-brand-primary hover:bg-gray-100 px-8 py-3">
              Start Creating Free <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 dark:border-gray-800">
        <div className="page-container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">OmniCommerce AI</span>
          </div>
          <p className="text-sm text-gray-500">© 2026 OmniCommerce AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
