'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { user } from '@/data/users';
import { formatRelativeTime } from '@/lib/utils';
import { getRouteMeta } from '@/lib/navigation';
import SearchCommand from './SearchCommand';
import {
  Menu, Search, Bell, Sun, Moon, ChevronDown, User, Building2,
  CreditCard, Users, Settings, LogOut, ChevronRight,
} from 'lucide-react';

export default function TopNavbar({ onMenuClick }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const routeMeta = getRouteMeta(pathname);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-40 flex h-16 items-center gap-4 border-b border-gray-200/80 bg-white px-4 shadow-header lg:left-64">
        <button onClick={onMenuClick} className="cursor-pointer rounded-lg p-2 hover:bg-gray-100 lg:hidden">
          <Menu className="h-5 w-5 text-text-secondary" />
        </button>

        {/* Route breadcrumb — synced with current page */}
        <div className="hidden min-w-0 items-center gap-1.5 text-sm md:flex">
          <Link href="/dashboard" className="truncate text-text-muted hover:text-brand-primary">
            {routeMeta.section}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-text-muted" />
          <span className="truncate font-medium text-text-primary">{routeMeta.title}</span>
        </div>

        <button
          onClick={() => setSearchOpen(true)}
          className="flex flex-1 max-w-md items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-text-muted transition-colors hover:border-brand-primary/25 cursor-pointer md:ml-auto"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search products, campaigns...</span>
          <span className="sm:hidden">Search...</span>
          <kbd className="ml-auto hidden rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-text-muted sm:inline">⌘K</kbd>
        </button>

        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} className="rounded-lg p-2.5 text-text-secondary hover:bg-gray-100 cursor-pointer" title="Toggle theme">
            {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>

          <div className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)} className="relative rounded-lg p-2.5 text-text-secondary hover:bg-gray-100 cursor-pointer">
              <Bell className="h-[18px] w-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-gray-200/80 bg-white shadow-soft">
                  <div className="flex items-center justify-between border-b border-gray-200/80 p-4">
                    <h3 className="font-semibold text-text-primary">Notifications</h3>
                    <button onClick={markAllNotificationsRead} className="text-xs text-brand-primary cursor-pointer">Mark all read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`w-full border-b border-gray-100 p-4 text-left hover:bg-gray-50 cursor-pointer ${!n.read ? 'bg-brand-muted/50' : ''}`}
                      >
                        <p className="text-sm font-medium text-text-primary">{n.title}</p>
                        <p className="mt-0.5 text-xs text-text-secondary">{n.message}</p>
                        <p className="mt-1 text-xs text-text-muted">{formatRelativeTime(n.time)}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="relative ml-1">
            <button onClick={() => setUserOpen(!userOpen)} className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 cursor-pointer">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-xs font-semibold text-white">
                {user.avatar}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-text-primary">{user.name}</p>
                <p className="text-xs text-text-muted">{user.role}</p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-text-muted sm:block" />
            </button>
            {userOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserOpen(false)} />
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-gray-200/80 bg-white py-2 shadow-soft">
                  {[
                    { icon: User, label: 'Profile', href: '/settings' },
                    { icon: Building2, label: 'Workspace', href: '/settings' },
                    { icon: CreditCard, label: 'Billing', href: '/settings' },
                    { icon: Users, label: 'Team', href: '/settings' },
                    { icon: Settings, label: 'Settings', href: '/settings' },
                  ].map((item) => (
                    <Link key={item.label} href={item.href} onClick={() => setUserOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50">
                      <item.icon className="h-4 w-4 text-text-muted" />
                      {item.label}
                    </Link>
                  ))}
                  <hr className="my-2 border-gray-200" />
                  <button onClick={toggleTheme} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50 cursor-pointer">
                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    Switch to {theme === 'dark' ? 'light' : 'dark'} mode
                  </button>
                  <Link href="/" className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50">
                    <LogOut className="h-4 w-4" />
                    Back to website
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      <SearchCommand open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
