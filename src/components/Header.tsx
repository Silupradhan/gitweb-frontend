'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loadEvents, loadRepositories } from '@/features/events/eventsSlice';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
  const dispatch = useAppDispatch();
  const { status, items, repositories, connectionStatus } = useAppSelector((state) => state.events);

  const totalEventCount =
    repositories.reduce((sum, r) => sum + (Number(r.eventCount) || 0), 0) || items.length;

  const handleRefresh = () => {
    dispatch(loadEvents());
    dispatch(loadRepositories());
  };

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-20 dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-lg dark:bg-white dark:text-zinc-900 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </div>
          <div>
            <h1 className="font-semibold text-zinc-900 dark:text-zinc-50 text-base sm:text-lg leading-tight">
              GitHub Webhook Event Hub
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Real-time activity & analytics
            </p>
          </div>
        </div>

        {/* Dynamic Status & Actions (FR-7.7: Connected, Reconnecting, Disconnected) */}
        <div className="flex items-center gap-3">
          {connectionStatus === 'reconnecting' ? (
            <div className="flex items-center gap-2 text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Live: Reconnecting...</span>
            </div>
          ) : status === 'failed' ? (
            <div className="flex items-center gap-2 text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Offline (Check server)</span>
            </div>
          ) : status === 'loading' && items.length === 0 ? (
            <div className="flex items-center gap-2 text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Syncing events...</span>
            </div>
          ) : connectionStatus === 'connected' ? (
            <div className="flex items-center gap-2 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live &bull; {totalEventCount} event{totalEventCount === 1 ? '' : 's'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700">
              <span className="w-2 h-2 rounded-full bg-zinc-400" />
              <span>{totalEventCount} event{totalEventCount === 1 ? '' : 's'} recorded</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={status === 'loading'}
            aria-label="Refresh feed"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            <svg
              className={`w-3.5 h-3.5 ${status === 'loading' ? 'animate-spin' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
