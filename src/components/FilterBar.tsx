'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setFilter, resetFilters, loadEvents } from '@/features/events/eventsSlice';

const KNOWN_LABELS: Record<string, string> = {
  push: 'Push (commits)',
  pull_request: 'Pull Request',
  pull_request_review: 'PR Review',
  pull_request_review_comment: 'PR Comment',
  issues: 'Issues',
  issue_comment: 'Issue Comment',
  watch: 'Star / Watch',
  star: 'Star',
  fork: 'Fork',
  release: 'Release',
  workflow_run: 'Workflow Run',
  workflow_job: 'Workflow Job',
  check_run: 'Check Run',
  create: 'Branch / Tag Created',
  delete: 'Branch / Tag Deleted',
  member: 'Collaborator',
  deployment_status: 'Deployment',
  dependabot_alert: 'Dependabot Alert',
  code_scanning_alert: 'Code Scanning Alert',
  secret_scanning_alert: 'Secret Scanning Alert',
};

export default function FilterBar() {
  const dispatch = useAppDispatch();
  const { filters, repositories, items } = useAppSelector((state) => state.events);

  // Local state for debounced search
  const [searchInput, setSearchInput] = useState(filters.search);

  // Dynamically extract all available event types from loaded data + known types
  const eventTypeOptions = useMemo(() => {
    const typesSet = new Set<string>();

    // Seed with common types
    ['push', 'pull_request', 'issues', 'watch', 'workflow_run'].forEach((t) => typesSet.add(t));

    // Dynamically add any event types found in the actual database items
    items.forEach((item) => {
      if (item.eventType) {
        typesSet.add(item.eventType);
      }
    });

    if (filters.eventType) {
      typesSet.add(filters.eventType);
    }

    return Array.from(typesSet).sort().map((type) => ({
      value: type,
      label: KNOWN_LABELS[type] || type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    }));
  }, [items, filters.eventType]);

  // Sync debounced search to redux
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        dispatch(setFilter({ key: 'search', value: searchInput }));
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput, filters.search, dispatch]);

  // When filters in Redux change, reload events from page 1
  useEffect(() => {
    dispatch(loadEvents());
  }, [filters.repository, filters.eventType, filters.search, filters.fromDate, filters.toDate, dispatch]);

  const hasActiveFilters =
    Boolean(filters.repository) ||
    Boolean(filters.eventType) ||
    Boolean(filters.search) ||
    Boolean(filters.fromDate) ||
    Boolean(filters.toDate);

  const handleReset = () => {
    setSearchInput('');
    dispatch(resetFilters());
  };

  return (
    <div className="bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* 1. Text Search Box (FR-6.2) */}
        <div className="lg:col-span-4 relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search event titles..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* 2. Repository Selector (FR-6.2) - Dynamic from API */}
        <div className="lg:col-span-3">
          <select
            value={filters.repository}
            onChange={(e) => dispatch(setFilter({ key: 'repository', value: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
          >
            <option value="">All Repositories ({repositories.length})</option>
            {repositories.map((repo) => (
              <option key={repo.id} value={repo.fullName}>
                {repo.fullName} ({repo.eventCount})
              </option>
            ))}
          </select>
        </div>

        {/* 3. Event Type Selector (FR-6.2) - Dynamic options */}
        <div className="lg:col-span-2">
          <select
            value={filters.eventType}
            onChange={(e) => dispatch(setFilter({ key: 'eventType', value: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
          >
            <option value="">All Event Types</option>
            {eventTypeOptions.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Date Pickers (From / To) (FR-6.2) */}
        <div className="lg:col-span-3 flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <input
              type="date"
              aria-label="From Date"
              value={filters.fromDate}
              onChange={(e) => dispatch(setFilter({ key: 'fromDate', value: e.target.value }))}
              className="w-full px-2 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <span className="text-zinc-400 text-xs">to</span>
          <div className="flex-1 min-w-0">
            <input
              type="date"
              aria-label="To Date"
              value={filters.toDate}
              onChange={(e) => dispatch(setFilter({ key: 'toDate', value: e.target.value }))}
              className="w-full px-2 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              title="Reset all filters"
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
