'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loadEvents, loadRepositories } from '@/features/events/eventsSlice';
import { useLiveFeed } from '@/features/events/useLiveFeed';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import EventList from '@/components/EventList';
import EventDetailModal from '@/components/EventDetailModal';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

export default function Home() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'feed' | 'analytics'>('feed');
  const { items, repositories } = useAppSelector((state) => state.events);

  // FR-7.1 to FR-7.7: Establish SSE live feed connection with auto-reconnect and real-time updates
  useLiveFeed();

  useEffect(() => {
    // Initial data fetch
    dispatch(loadRepositories());
    dispatch(loadEvents());
  }, [dispatch]);

  const totalEventCount =
    repositories.reduce((sum, r) => sum + (Number(r.eventCount) || 0), 0) || items.length;

  return (
    <div className="min-h-screen bg-zinc-50/60 dark:bg-black font-sans antialiased text-zinc-900 dark:text-zinc-50 flex flex-col">
      {/* 1. Header (FR-6.1) */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {activeTab === 'feed' ? 'Event Feed' : 'Analytics Dashboard'}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {activeTab === 'feed'
                ? repositories.length > 0
                  ? `Monitoring ${totalEventCount} event${totalEventCount === 1 ? '' : 's'} across ${repositories.length} connected repositor${repositories.length === 1 ? 'y' : 'ies'}.`
                  : 'Real-time activity across all your connected GitHub repositories.'
                : 'Aggregated repository insights, pull requests, CI metrics, and commit activity.'}
            </p>
          </div>

          {/* View Tab Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-200/60 dark:bg-zinc-800/80 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'feed'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>Live Feed</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Analytics</span>
            </button>
          </div>
        </div>

        {activeTab === 'feed' ? (
          <>
            {/* 2. Filter Bar (FR-6.1, FR-6.2) */}
            <FilterBar />

            {/* 3. Event List with Skeletons, Empty States & Cursor Pagination (FR-6.1, FR-6.3, FR-6.4, FR-6.7) */}
            <EventList />
          </>
        ) : (
          /* Feature 8: Analytics Dashboard (FR-8.1 to FR-8.11) */
          <AnalyticsDashboard />
        )}
      </main>

      {/* 4. Event Detail Modal / Drawer (FR-6.5, FR-6.6) */}
      <EventDetailModal />
    </div>
  );
}
