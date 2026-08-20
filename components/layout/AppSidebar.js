'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { dashboardNav, isNavActive } from '@/lib/navigation';
import {
  LayoutDashboard, Sparkles, Package, Megaphone, BarChart3,
  Plug, Settings, Clapperboard, X,
} from 'lucide-react';

const iconMap = {
  LayoutDashboard,
  Sparkles,
  Package,
  Megaphone,
  BarChart3,
  Plug,
  Settings,
  Clapperboard,
};

function NavItem({ item, pathname, collapsed, onNavigate }) {
  const isActive = isNavActive(pathname, item.href);
  const Icon = iconMap[item.icon];

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
        isActive
          ? 'bg-brand-gradient-subtle text-brand-primary font-medium'
          : 'text-text-secondary hover:bg-gray-50'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{item.name}</span>}
    </Link>
  );
}

export default function AppSidebar({ mobileOpen, onMobileClose }) {
  const pathname = usePathname();

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center gap-2 border-b border-gray-200/80 px-4">
        <Link href="/dashboard" onClick={onMobileClose} className="flex items-center" aria-label="OmniCommerce AI">
          <Image
            src="/images/logo.png"
            alt="OmniCommerce AI"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />
        </Link>
        {mobileOpen && (
          <button onClick={onMobileClose} className="ml-auto cursor-pointer lg:hidden">
            <X className="h-5 w-5 text-text-muted" />
          </button>
        )}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin">
        {dashboardNav.map((item) => (
          <NavItem
            key={item.name}
            item={item}
            pathname={pathname}
            collapsed={false}
            onNavigate={onMobileClose}
          />
        ))}
      </nav>
      <div className="border-t border-gray-200/80 p-4">
        <div className="rounded-lg bg-brand-gradient-subtle p-3">
          <p className="text-xs font-semibold text-brand-primary">Pro Plan</p>
          <p className="mt-1 text-xs text-text-muted">1,284 products · 18 campaigns</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-56 lg:flex-col border-r border-gray-200/80 bg-white">
        {sidebarContent}
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onMobileClose} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
