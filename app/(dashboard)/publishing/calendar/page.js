'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import { calendarEvents } from '@/data/brand';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const typeColors = {
  post: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  campaign: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  product: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  email: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  promotion: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function ContentCalendarPage() {
  const [view, setView] = useState('month');
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="page-container pb-20">
      <PageHeader
        title="Content Calendar"
        subtitle="Schedule posts, campaigns, and product releases."
        actions={
          <div className="flex gap-2">
            <button onClick={() => setView('week')} className={`btn-secondary text-xs ${view === 'week' ? 'border-brand-primary' : ''}`}>Week</button>
            <button onClick={() => setView('month')} className={`btn-secondary text-xs ${view === 'month' ? 'border-brand-primary' : ''}`}>Month</button>
          </div>
        }
      />

      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <button className="btn-ghost"><ChevronLeft className="h-4 w-4" /></button>
          <h3 className="font-semibold">August 2026</h3>
          <button className="btn-ghost"><ChevronRight className="h-4 w-4" /></button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="p-2 text-center text-xs font-medium text-gray-500">{d}</div>
          ))}
          {days.map((day) => {
            const events = calendarEvents.filter((e) => new Date(e.date).getDate() === day);
            return (
              <div key={day} className="min-h-[80px] rounded-lg border border-gray-100 p-1 dark:border-gray-800">
                <span className="text-xs text-gray-400">{day}</span>
                {events.map((e) => (
                  <div key={e.id} className={`mt-1 rounded px-1 py-0.5 text-[10px] font-medium truncate ${typeColors[e.type]}`}>
                    {e.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 card">
        <h3 className="font-semibold mb-4">Upcoming</h3>
        <div className="space-y-3">
          {calendarEvents.map((e) => (
            <div key={e.id} className="flex items-center justify-between rounded-xl border border-gray-200 p-3 dark:border-gray-800">
              <div>
                <p className="font-medium text-sm">{e.title}</p>
                <p className="text-xs text-gray-500">{e.date} {e.platform && `· ${e.platform}`}</p>
              </div>
              <StatusBadge status={e.status === 'scheduled' ? 'Active' : 'Draft'} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
