'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { mobileNav, isMobileNavActive } from '@/lib/navigation';
import AppSidebar from './AppSidebar';
import TopNavbar from './TopNavbar';
import ToastContainer from '@/components/ui/Toast';
import AIChatAgent from '@/components/ai/AIChatAgent';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-light">
      <AppSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="lg:pl-56">
        <TopNavbar onMenuClick={() => setMobileOpen(true)} />
        <main className="px-2 pb-20 pt-20 sm:px-3 lg:px-3 lg:pb-6 lg:pt-24 xl:px-4">{children}</main>
      </div>
      <ToastContainer />
      <AIChatAgent />
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-gray-200/80 bg-white px-2 py-2 lg:hidden">
        {mobileNav.map((item) => {
          const active = isMobileNavActive(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center px-3 py-1 text-[10px] font-medium transition-colors',
                active ? 'text-brand-primary' : 'text-text-secondary'
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
