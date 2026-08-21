'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowRight, Upload, Wand2, Share2, BarChart3, Sparkles,
  ChevronDown, Check, Star, FolderKanban, Briefcase, ShieldCheck, Link2, LineChart,
  MapPin, Phone, Mail, Package, Plug, CircleDollarSign, LogIn,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { landingNav } from '@/lib/navigation';
import { cn } from '@/lib/utils';

const landingNavIcons = {
  Product: Package,
  'AI Tools': Sparkles,
  Integrations: Plug,
  Pricing: CircleDollarSign,
};

const integrations = [
  { name: 'Meta', logo: 'https://cdn.simpleicons.org/meta/0866FF' },
  { name: 'Google', logo: 'https://cdn.simpleicons.org/google/4285F4' },
  { name: 'TikTok', logo: 'https://cdn.simpleicons.org/tiktok/000000' },
  { name: 'Amazon', logo: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=128' },
  { name: 'Shopify', logo: 'https://cdn.simpleicons.org/shopify/7AB55C' },
  { name: 'LinkedIn', logo: 'https://www.google.com/s2/favicons?domain=linkedin.com&sz=128' },
  { name: 'Walmart', logo: 'https://www.google.com/s2/favicons?domain=walmart.com&sz=128' },
  { name: 'Pinterest', logo: 'https://cdn.simpleicons.org/pinterest/BD081C' },
  { name: 'YouTube', logo: 'https://cdn.simpleicons.org/youtube/FF0000' },
  { name: 'Instagram', logo: 'https://cdn.simpleicons.org/instagram/E4405F' },
  { name: 'X', logo: 'https://cdn.simpleicons.org/x/000000' },
  { name: 'Etsy', logo: 'https://cdn.simpleicons.org/etsy/F1641E' },
];

const features = [
  {
    title: 'AI Product Content',
    desc: 'Generate titles, descriptions, SEO, and social captions from a single product image or prompt.',
    icon: Wand2,
  },
  {
    title: 'Campaign Factory',
    desc: 'Build full ad campaigns with A/B variants, audience targeting, and multi-platform allocation.',
    icon: Sparkles,
  },
  {
    title: 'Multi-Channel Publishing',
    desc: 'Publish to social, marketplaces, and commerce platforms from one unified workflow.',
    icon: Share2,
  },
  {
    title: 'AI Studio Visuals',
    desc: 'Create studio-quality product images and videos from a single upload or brief.',
    icon: Upload,
  },
  {
    title: 'Unified Analytics',
    desc: 'Track revenue, ROAS, and performance across every channel in one clear dashboard.',
    icon: BarChart3,
  },
  {
    title: 'Catalog Guardian',
    desc: 'Detect catalog issues, fix quality gaps, and keep listings marketplace-ready with AI.',
    icon: ShieldCheck,
  },
];

const aiTools = [
  {
    title: 'AI Content',
    desc: 'Generate product titles, descriptions, SEO, and visuals from a single image or prompt.',
    href: '/create/content',
    icon: Wand2,
  },
  {
    title: 'AI Campaign',
    desc: 'Build full ad campaigns with A/B variants, audiences, and multi-platform allocation.',
    href: '/create/campaign',
    icon: Sparkles,
  },
  {
    title: 'AI Analyst',
    desc: 'Ask natural-language questions about revenue, ROAS, and channel performance.',
    href: '/analytics/ai-analyst',
    icon: BarChart3,
  },
  {
    title: 'Catalog Guardian',
    desc: 'Detect catalog quality issues and keep every listing marketplace-ready.',
    href: '/catalog/guardian',
    icon: ShieldCheck,
  },
  {
    title: 'Product from Link',
    desc: 'Paste any product URL and let AI extract content, images, and attributes instantly.',
    href: '/catalog/from-link',
    icon: Link2,
  },
  {
    title: 'Creative Intelligence',
    desc: 'See which creatives win across channels and optimize your next campaign faster.',
    href: '/analytics/creative-intelligence',
    icon: LineChart,
  },
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

function DotGrid({ className, cols = 6, rows = 4 }) {
  return (
    <div
      className={cn('pointer-events-none absolute grid gap-2 opacity-35', className)}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      aria-hidden
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <span key={i} className="h-1.5 w-1.5 rounded-full bg-brand-muted" />
      ))}
    </div>
  );
}

function HeroBlobs() {
  return (
    <svg
      className="absolute inset-0 z-[2] h-full w-full translate-x-[8%] sm:translate-x-[10%] lg:translate-x-[12%]"
      viewBox="0 0 540 560"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <linearGradient id="heroBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#112E81" />
          <stop offset="52%" stopColor="#4647AE" />
          <stop offset="100%" stopColor="#4382DF" />
        </linearGradient>
      </defs>
      {/* Abstract blob — left/behind (2nd shape) */}
      <path
        fill="#000000"
        transform="translate(-170 -150) scale(1.85)"
        d="M210 95
           C268 72 318 98 335 145
           C352 188 378 218 365 268
           C350 325 300 355 245 365
           C185 376 130 350 105 295
           C82 245 88 185 125 145
           C155 112 175 105 210 95 Z"
      />
      {/* Main oval — stays oval */}
      <ellipse cx="292" cy="268" rx="186" ry="248" fill="url(#heroBrandGrad)" transform="rotate(4 292 268)" />
    </svg>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto h-[460px] w-full max-w-[540px] sm:h-[520px] lg:mx-0 lg:h-[580px] lg:max-w-none">
      <DotGrid className="right-[2%] top-[4%] z-[1]" cols={5} rows={3} />
      <DotGrid className="left-[10%] top-[34%] z-[1]" cols={4} rows={5} />

      <HeroBlobs />

      <div className="absolute bottom-0 left-[18%] right-0 top-[1%] z-[5] flex translate-x-[6%] items-end justify-center sm:translate-x-[8%] lg:translate-x-[10%]">
        <Image
          src="https://pngimg.com/d/girls_PNG6463.png"
          alt="Commerce assistant"
          width={420}
          height={680}
          className="h-[98%] w-auto max-w-full object-contain object-bottom drop-shadow-[0_20px_40px_rgba(17,46,129,0.15)] [mask-image:linear-gradient(to_bottom,black_90%,rgba(0,0,0,0.35)_97%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_90%,rgba(0,0,0,0.35)_97%,transparent_100%)]"
          sizes="(max-width: 1024px) 85vw, 420px"
          priority
        />
      </div>

      <div className="absolute left-[2%] top-[48%] z-20 flex animate-float items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 shadow-soft sm:left-[4%] lg:left-[6%]">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white">
          <FolderKanban className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-bold text-slate-900">2K+</p>
          <p className="text-[11px] text-slate-500">Products created</p>
        </div>
      </div>

      <div className="absolute right-[0%] top-[12%] z-20 flex animate-float-slow items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 shadow-soft sm:right-[-2%] lg:right-[2%]">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
        </span>
        <div>
          <p className="text-sm font-bold text-slate-900">4.8</p>
          <p className="text-[11px] text-slate-500">Satisfaction</p>
        </div>
      </div>

      <div className="absolute bottom-[10%] right-[4%] z-20 flex max-w-[220px] animate-float-delayed items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 shadow-soft">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white">
          <Briefcase className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-bold text-slate-900">AI Commerce Platform</p>
          <p className="text-[11px] text-slate-500">Create · Publish · Optimize</p>
        </div>
      </div>
    </div>
  );
}

function LandingNavLink({ href, isHash, isActive, children }) {
  const className = cn('landing-nav-link', isActive && 'is-active');
  if (isHash) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out',
          scrolled
            ? 'border-b border-slate-200/90 bg-white shadow-sm'
            : 'border-b-0 bg-transparent shadow-none'
        )}
      >
        <div className="page-container flex h-24 items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center" aria-label="OmniCommerce AI home">
            <Image
              src="/images/logo.png"
              alt="OmniCommerce AI"
              width={260}
              height={72}
              className="h-auto w-[260px] max-w-[min(260px,55vw)] object-contain object-left"
              priority
            />
          </Link>

          <div className="hidden items-center gap-6 lg:flex xl:gap-8">
            {landingNav.map((item) => {
              const isHash = item.href.startsWith('/#');
              const isActive = !isHash && (pathname === item.href || pathname.startsWith(item.href + '/'));
              const Icon = landingNavIcons[item.label];
              return (
                <LandingNavLink key={item.label} href={item.href} isHash={isHash} isActive={isActive}>
                  {Icon ? <Icon className="h-4 w-4 shrink-0 opacity-80" strokeWidth={1.75} /> : null}
                  {item.label}
                </LandingNavLink>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-white/80 hover:text-brand-primary sm:px-5"
            >
              <LogIn className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              Sign in
            </Link>
            <Link
              href="/signup"
              className="group relative overflow-hidden rounded-full bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_12px_28px_rgba(17,46,129,0.35)] sm:px-5"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover:translate-x-full" aria-hidden />
              <span className="relative">Get started</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-gradient-bg relative overflow-hidden pt-24">
        <div className="pointer-events-none absolute -left-32 -top-20 h-[28rem] w-[28rem] rounded-full bg-brand-accent/20 blur-[100px]" />
        <div className="pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full bg-brand-secondary/25 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-brand-primary/15 blur-[110px]" />
        {/* Soft bottom fade — keeps hero height, hides hard edge */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-48 bg-gradient-to-b from-transparent via-white/60 to-white"
          aria-hidden
        />

        <div className="page-container relative z-10 grid min-h-[calc(100vh-6rem)] items-center gap-10 py-12 lg:grid-cols-2 lg:gap-12 lg:py-16">
          <div className="relative z-10 max-w-2xl">
            <p className="text-base font-medium text-slate-500">Hi, there!</p>
            <h1 className="mt-4 text-4xl font-extrabold uppercase leading-[1.25] tracking-tight text-slate-900 sm:text-5xl sm:leading-[1.22] lg:text-[3.25rem] lg:leading-[1.2]">
              <span className="text-brand-primary">Omni</span> is here to be your commerce assistant
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-500 sm:text-lg">
              Ready to help you create products, generate creatives, and launch campaigns across every channel.
            </p>
            <Link
              href="/signup"
              className="group relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-full bg-brand-gradient px-8 py-3.5 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_14px_32px_rgba(17,46,129,0.35)]"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover:translate-x-full" aria-hidden />
              <span className="relative inline-flex items-center gap-2">
                Let&apos;s Discuss
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

          <HeroVisual />
        </div>
      </section>

      <section id="product" className="relative -mt-16 bg-white pt-28 pb-24">
        <div
          className="pointer-events-none absolute inset-x-0 -top-10 z-10 h-32 bg-gradient-to-b from-white via-white to-transparent blur-[24px]"
          aria-hidden
        />
        <div className="page-container relative z-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-secondary">
              What we offer
            </p>
            <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-slate-900 sm:text-4xl">
              Our Service
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-500">
              One connected workflow from product to performance — built for modern commerce teams.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <article
                key={f.title}
                className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-8 shadow-[0_1px_2px_rgba(17,46,129,0.03)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-brand-primary/20 hover:shadow-[0_18px_40px_rgba(17,46,129,0.10)]"
              >
                <span className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient-subtle text-brand-primary transition-all duration-300 group-hover:bg-brand-gradient group-hover:text-white group-hover:shadow-[0_6px_16px_rgba(17,46,129,0.18)]">
                  <f.icon className="h-5 w-5" strokeWidth={1.6} />
                </span>

                <h3 className="text-lg font-semibold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-brand-primary">
                  {f.title}
                </h3>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-slate-500">
                  {f.desc}
                </p>

                <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
                  <span className="text-[13px] font-semibold text-brand-primary transition-colors duration-300 group-hover:text-brand-secondary">
                    Explore service
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-brand-primary transition-all duration-300 group-hover:bg-brand-gradient group-hover:text-white">
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="integrations" className="relative bg-white py-24">
        <div className="page-container relative">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-secondary">
              Connections
            </p>
            <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-slate-900 sm:text-4xl">
              Integrations
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-500">
              Connect your marketplaces, social channels, and commerce stack — publish everywhere from one place.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-4">
            {integrations.map((item) => (
              <div
                key={item.name}
                className="group flex flex-col items-center justify-center gap-3.5 rounded-2xl border border-transparent bg-transparent px-3 py-7 transition-all duration-300 hover:border-slate-200/90 hover:bg-slate-50/80"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.logo}
                  alt={`${item.name} logo`}
                  width={36}
                  height={36}
                  className="h-9 w-9 object-contain opacity-55 grayscale transition-all duration-300 group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0"
                  loading="lazy"
                />
                <span className="text-[13px] font-medium text-slate-400 transition-colors duration-300 group-hover:text-slate-800">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ai-tools" className="relative bg-white py-24">
        <div className="page-container relative">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-secondary">
              Workflows
            </p>
            <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-slate-900 sm:text-4xl">
              AI Tools
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-500">
              Powerful AI workflows built for commerce teams — create, analyze, and optimize in one place.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {aiTools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="group relative flex min-h-[230px] flex-col rounded-[24px] border border-slate-200/80 bg-white p-8 shadow-[0_1px_2px_rgba(17,46,129,0.03)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-brand-primary/20 hover:shadow-[0_18px_40px_rgba(17,46,129,0.10)]"
              >
                <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient-subtle text-brand-primary transition-all duration-300 group-hover:bg-brand-gradient group-hover:text-white group-hover:shadow-[0_6px_16px_rgba(17,46,129,0.18)]">
                  <tool.icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <h3 className="text-lg font-semibold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-brand-primary">
                  {tool.title}
                </h3>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-slate-500">
                  {tool.desc}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-brand-primary">
                  Open tool
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="relative bg-[#F7F9FC] py-24">
        <div className="page-container relative">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-secondary">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-slate-900 sm:text-4xl">
              Simple Pricing
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-500">
              Start free, scale when you are ready. Transparent plans for every commerce team.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'relative flex flex-col rounded-[24px] border bg-white p-8 transition-all duration-300',
                  plan.popular
                    ? 'border-brand-primary/30 shadow-[0_20px_50px_rgba(17,46,129,0.12)] lg:-translate-y-2'
                    : 'border-slate-200/80 shadow-[0_1px_2px_rgba(17,46,129,0.03)] hover:border-brand-primary/15 hover:shadow-[0_16px_40px_rgba(17,46,129,0.08)]'
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-gradient px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
                    Most Popular
                  </span>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900">{plan.name}</h3>
                  <p className="mt-4 flex items-end gap-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-900">${plan.price}</span>
                    <span className="mb-1 text-sm text-slate-500">/month</span>
                  </p>
                </div>

                <ul className="mb-8 flex-1 space-y-3.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[14px] leading-snug text-slate-600">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-gradient-subtle text-brand-primary">
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={cn(
                    'inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300',
                    plan.popular
                      ? 'bg-brand-gradient text-white shadow-glow hover:brightness-105'
                      : 'border border-slate-200 bg-white text-slate-800 hover:border-brand-primary/25 hover:text-brand-primary'
                  )}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="relative bg-white py-24">
        <div className="page-container relative">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-secondary">
              Support
            </p>
            <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-slate-900 sm:text-4xl">
              FAQ
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-500">
              Quick answers to the most common questions about OmniCommerce AI.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className={cn(
                    'overflow-hidden rounded-2xl border bg-white transition-all duration-300',
                    isOpen
                      ? 'border-brand-primary/20 shadow-[0_12px_32px_rgba(17,46,129,0.08)]'
                      : 'border-slate-200/80 hover:border-slate-300'
                  )}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-[15px] font-semibold text-slate-900">{faq.q}</span>
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300',
                        isOpen
                          ? 'bg-brand-gradient text-white'
                          : 'bg-slate-50 text-slate-400'
                      )}
                    >
                      <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', isOpen && 'rotate-180')} />
                    </span>
                  </button>
                  <div
                    className={cn(
                      'grid transition-all duration-300 ease-out',
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="border-t border-slate-100 px-6 pb-5 pt-4 text-[14px] leading-relaxed text-slate-500">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-24">
        <div className="page-container relative">
          <div className="relative overflow-hidden rounded-[28px] px-8 py-14 text-center text-white shadow-[0_24px_60px_rgba(17,46,129,0.18)] sm:px-12 sm:py-16">
            <Image
              src="/images/cta-ai-bg.png"
              alt=""
              fill
              className="object-cover object-center"
              sizes="100vw"
              aria-hidden
            />
            <div className="absolute inset-0 bg-black/45" aria-hidden />

            <div className="relative z-10 mx-auto max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                Get started
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to ship faster?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/80">
                Start creating content and campaigns in minutes — no credit card required.
              </p>
              <Link
                href="/signup"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-brand-primary shadow-sm transition-all duration-300 hover:bg-slate-50 hover:shadow-md"
              >
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-[#FAFBFC] pt-16 pb-8">
        <div className="page-container">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))] lg:gap-8">
            <div className="max-w-sm">
              <Link href="/" className="inline-flex items-center" aria-label="OmniCommerce AI home">
                <Image
                  src="/images/logo.png"
                  alt="OmniCommerce AI"
                  width={180}
                  height={48}
                  className="h-10 w-auto object-contain object-left"
                />
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                AI-powered commerce platform for modern brands. Create products, launch campaigns, and publish everywhere from one workflow.
              </p>
              <ul className="mt-6 space-y-3">
                <li>
                  <a href="#integrations" className="inline-flex items-center gap-2.5 text-sm text-slate-600 transition-colors hover:text-brand-primary">
                    <MapPin className="h-4 w-4 shrink-0 text-brand-secondary" />
                    View Location
                  </a>
                </li>
                <li>
                  <a href="tel:+880255013583" className="inline-flex items-center gap-2.5 text-sm text-slate-600 transition-colors hover:text-brand-primary">
                    <Phone className="h-4 w-4 shrink-0 text-brand-secondary" />
                    +880 02-55013583
                  </a>
                </li>
                <li>
                  <a href="mailto:support@omnicommerce.ai" className="inline-flex items-center gap-2.5 text-sm text-slate-600 transition-colors hover:text-brand-primary">
                    <Mail className="h-4 w-4 shrink-0 text-brand-secondary" />
                    support@omnicommerce.ai
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900">Product</h4>
              <ul className="mt-4 space-y-3">
                {[
                  { label: 'Our Service', href: '/#product' },
                  { label: 'AI Tools', href: '/#ai-tools' },
                  { label: 'Integrations', href: '/#integrations' },
                  { label: 'Pricing', href: '/#pricing' },
                ].map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-slate-500 transition-colors hover:text-brand-primary">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900">Company</h4>
              <ul className="mt-4 space-y-3">
                {[
                  { label: 'How it Works', href: '/#ai-tools' },
                  { label: 'Connections', href: '/connections' },
                  { label: 'FAQ', href: '/#faq' },
                  { label: 'Get Started', href: '/signup' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-slate-500 transition-colors hover:text-brand-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900">Legal</h4>
              <ul className="mt-4 space-y-3">
                {['Terms', 'Privacy', 'Cookie Policy'].map((label) => (
                  <li key={label}>
                    <span className="cursor-pointer text-sm text-slate-500 transition-colors hover:text-brand-primary">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900">Follow Us</h4>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {[
                  { name: 'Facebook', logo: 'https://cdn.simpleicons.org/facebook/1877F2' },
                  { name: 'Instagram', logo: 'https://cdn.simpleicons.org/instagram/E4405F' },
                  { name: 'YouTube', logo: 'https://cdn.simpleicons.org/youtube/FF0000' },
                  { name: 'X', logo: 'https://cdn.simpleicons.org/x/000000' },
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    aria-label={social.name}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200/80 transition-all hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={social.logo} alt="" width={18} height={18} className="h-[18px] w-[18px] object-contain" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-slate-200/90 pt-6 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} OmniCommerce AI. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-5">
              {['Terms', 'Privacy', 'Cookie Policy'].map((label) => (
                <span key={label} className="cursor-pointer text-sm text-slate-400 transition-colors hover:text-brand-primary">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
