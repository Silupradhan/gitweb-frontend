'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  setPreset,
  setRepositoryFilter,
  setCustomDateRange,
  loadAnalyticsStats,
} from '@/features/analytics/analyticsSlice';
import type { AnalyticsFilterState } from '@/lib/types';

export default function AnalyticsFilterBar() {
  const dispatch = useAppDispatch();
  const analyticsState = useAppSelector((state) => state.analytics);
  const filters: AnalyticsFilterState = analyticsState?.filters ?? {
    repository: '',
    preset: '30d',
    fromDate: '',
    toDate: '',
  };
  const status = analyticsState?.status ?? 'idle';
  const repositories = useAppSelector((state) => state.events.repositories);

  const presets: Array<{ key: AnalyticsFilterState['preset']; label: string }> = [
    { key: '7d', label: 'Last 7 Days' },
    { key: '30d', label: 'Last 30 Days' },
    { key: '90d', label: 'Last 90 Days' },
    { key: 'all', label: 'All Time' },
    { key: 'custom', label: 'Custom' },
  ];

  const handlePresetChange = (preset: AnalyticsFilterState['preset']) => {
    dispatch(setPreset(preset));
    dispatch(loadAnalyticsStats());
  };

  const handleRepoChange = (repo: string) => {
    dispatch(setRepositoryFilter(repo));
    dispatch(loadAnalyticsStats());
  };

  const handleCustomDateApply = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loadAnalyticsStats());
  };

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 mb-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Presets and Repo selection */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Preset Pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800">
          {presets.map((p) => {
            const isActive = filters.preset === p.key;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => handlePresetChange(p.key)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Repository selector */}
        {repositories.length > 0 && (
          <select
            value={filters.repository}
            onChange={(e) => handleRepoChange(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Repositories</option>
            {repositories.map((repo) => (
              <option key={repo.id} value={repo.fullName}>
                {repo.fullName}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Custom Date Pickers (visible when custom selected) */}
      {filters.preset === 'custom' && (
        <form onSubmit={handleCustomDateApply} className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <span>From:</span>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) =>
                dispatch(
                  setCustomDateRange({
                    fromDate: e.target.value,
                    toDate: filters.toDate,
                  })
                )
              }
              className="text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <span>To:</span>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) =>
                dispatch(
                  setCustomDateRange({
                    fromDate: filters.fromDate,
                    toDate: e.target.value,
                  })
                )
              }
              className="text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
          >
            Apply
          </button>
        </form>
      )}
    </div>
  );
}

