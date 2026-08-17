'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { dashboardNav, isNavActive } from '@/lib/navigation';
import {
  LayoutDashboard, Sparkles, Package, Send, Megaphone, BarChart3,
  FolderOpen, Plug, Settings, ChevronDown, ChevronRight, X,
} from 'lucide-react';

const iconMap = {
  LayoutDashboard,
  Sparkles,
  Package,
  Send,
  Megaphone,
  BarChart3,
  FolderOpen,
  Plug,
  Settings,
};

function NavItem({ item, pathname, collapsed, onNavigate }) {
  const [open, setOpen] = useState(() =>
    item.children?.some((c) => isNavActive(pathname, c.href)) ?? false
  );
  const isActive = item.href
    ? isNavActive(pathname, item.href)
    : item.children?.some((c) => isNavActive(pathname, c.href));
  const Icon = iconMap[item.icon];

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer',
            isActive ? 'text-brand-primary' : 'text-text-secondary hover:bg-gray-50'
          )}
        >
          <Icon className="h-5 w-5 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.name}</span>
              {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </>
          )}
        </button>
        {open && !collapsed && (
          <div className="ml-4 mt-1 space-y-0.5 border-l border-gray-200 pl-3">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={onNavigate}
                className={cn(
                  'block rounded-lg px-3 py-2 text-sm transition-colors',
                  isNavActive(pathname, child.href)
                    ? 'bg-brand-gradient-subtle font-medium text-brand-primary'
                    : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
                )}
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

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
        <Link href="/dashboard" onClick={onMobileClose} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary">OmniCommerce AI</p>
            <p className="text-[10px] text-text-muted">Nova Commerce</p>
          </div>
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
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-64 lg:flex-col border-r border-gray-200/80 bg-white">
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
