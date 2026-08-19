'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-bg-light">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-brand-gradient p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">OmniCommerce AI</span>
          </Link>
          <div className="max-w-md">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/70">
              From product to campaign
            </p>
            <h2 className="mt-3 text-4xl font-bold leading-tight">
              Create, publish, and optimize across every channel.
            </h2>
            <p className="mt-4 text-white/80">
              Sign in to generate content, launch campaigns, and review platform-ready posts from one workspace.
            </p>
          </div>
          <p className="text-sm text-white/60">Nova Commerce · Demo workspace</p>
        </div>

        <div className="flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-text-primary">OmniCommerce AI</span>
            </Link>
            <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
            <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6 text-center text-sm text-text-secondary">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
