'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { searchItems } from '@/data/brand';
import { Search, Sparkles, Megaphone, Plug, Package } from 'lucide-react';

const typeIcons = {
  product: Package,
  campaign: Megaphone,
  creative: Sparkles,
  page: Search,
};

const quickActions = [
  { label: 'Create Campaign', href: '/campaigns/create', icon: Megaphone },
  { label: 'Create Product', href: '/catalog/create', icon: Package },
  { label: 'Generate Creative', href: '/create/content', icon: Sparkles },
  { label: 'Connect Platform', href: '/connections', icon: Plug },
];

export default function SearchCommand({ open, onClose }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) onClose();
        else {
          const event = new CustomEvent('open-search');
          window.dispatchEvent(event);
        }
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    const handler = () => {
      if (!open) {
        const btn = document.querySelector('[data-search-trigger]');
        btn?.click();
      }
    };
    window.addEventListener('open-search', handler);
    return () => window.removeEventListener('open-search', handler);
  }, [open]);

  const filtered = query
    ? searchItems.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
    : searchItems;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-surface-dark animate-slide-up">
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 dark:border-gray-800">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, campaigns, pages..."
            className="flex-1 bg-transparent py-4 text-sm text-gray-900 outline-none dark:text-white"
          />
          <kbd className="rounded border border-gray-200 px-1.5 py-0.5 text-xs text-gray-400 dark:border-gray-700">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {!query && (
            <div className="mb-2 px-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Quick Actions</p>
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-gray-800"
                >
                  <action.icon className="h-4 w-4 text-brand-primary" />
                  {action.label}
                </Link>
              ))}
            </div>
          )}
          <p className="px-2 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            {query ? 'Results' : 'Recent'}
          </p>
          {filtered.map((item) => {
            const Icon = typeIcons[item.type] || Search;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-gray-800"
              >
                <Icon className="h-4 w-4 text-gray-400" />
                <span>{item.title}</span>
                <span className="ml-auto text-xs text-gray-400 capitalize">{item.type}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
