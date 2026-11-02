'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loadMoreEvents, loadEventDetail } from '@/features/events/eventsSlice';
import EventCard from './EventCard';

export default function EventList() {
  const dispatch = useAppDispatch();
  const { items, status, error, pagination } = useAppSelector((state) => state.events);

  const handleSelectEvent = (id: number) => {
    dispatch(loadEventDetail(id));
  };

  const handleLoadMore = () => {
    dispatch(loadMoreEvents());
  };

  // 1. Initial Loading State (FR-6.7)
  if (status === 'loading' && items.length === 0) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((skeleton) => (
          <div
            key={skeleton}
            className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 animate-pulse flex items-center justify-between"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
              <div className="space-y-2 flex-1 max-w-md">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/4" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-3/4" />
              </div>
            </div>
            <div className="w-16 h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  // 2. Error State (FR-6.7)
  if (status === 'failed' && items.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-rose-900 dark:text-rose-200 mb-1">
          Unable to Load Events
        </h3>
        <p className="text-sm text-rose-700 dark:text-rose-400 max-w-md mx-auto">
          {error || 'Make sure your backend server is running on http://localhost:3000.'}
        </p>
      </div>
    );
  }

  // 3. Empty State (FR-6.7)
  if (items.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/30">
        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
          No Events Found
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
          No webhook deliveries match your current filters. Try resetting the filters or trigger a new GitHub event.
        </p>
      </div>
    );
  }

  // 4. Events Feed (FR-6.1, FR-6.3, FR-6.4)
  return (
    <div className="space-y-3">
      {items.map((event) => (
        <EventCard
          key={`${event.id}-${event.receivedAt}`}
          event={event}
          onClick={() => handleSelectEvent(event.id)}
        />
      ))}

      {/* Load More Button (FR-6.4) */}
      {pagination.hasMore && (
        <div className="pt-4 flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={status === 'loadingMore'}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            {status === 'loadingMore' ? (
              <>
                <div className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading more events...</span>
              </>
            ) : (
              <>
                <span>Load more events</span>
                <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {/* End of Feed indicator */}
      {!pagination.hasMore && items.length > 0 && (
        <p className="text-center text-xs text-zinc-400 dark:text-zinc-600 pt-6">
          You have reached the end of the feed ({items.length} events loaded).
        </p>
      )}
    </div>
  );
}

