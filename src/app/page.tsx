'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loadEvents, loadRepositories } from '@/features/events/eventsSlice';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import EventList from '@/components/EventList';
import EventDetailModal from '@/components/EventDetailModal';

export default function Home() {
  const dispatch = useAppDispatch();
  const { items, repositories } = useAppSelector((state) => state.events);

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
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Event Feed
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {repositories.length > 0
                ? `Monitoring ${totalEventCount} event${totalEventCount === 1 ? '' : 's'} across ${repositories.length} connected repositor${repositories.length === 1 ? 'y' : 'ies'}.`
                : 'Real-time activity across all your connected GitHub repositories.'}
            </p>
          </div>
        </div>

        {/* 2. Filter Bar (FR-6.1, FR-6.2) */}
        <FilterBar />

        {/* 3. Event List with Skeletons, Empty States & Cursor Pagination (FR-6.1, FR-6.3, FR-6.4, FR-6.7) */}
        <EventList />
      </main>

      {/* 4. Event Detail Modal / Drawer (FR-6.5, FR-6.6) */}
      <EventDetailModal />
    </div>
  );
}
