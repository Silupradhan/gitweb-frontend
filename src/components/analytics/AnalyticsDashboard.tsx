'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loadAnalyticsStats } from '@/features/analytics/analyticsSlice';
import SummaryCards from './SummaryCards';
import AnalyticsFilterBar from './AnalyticsFilterBar';
import EventsLineChart from './EventsLineChart';
import EventTypeDoughnut from './EventTypeDoughnut';
import TopContributorsBarChart from './TopContributorsBarChart';
import CommitHeatmap from './CommitHeatmap';
import PrIssueCiMetrics from './PrIssueCiMetrics';

export default function AnalyticsDashboard() {
  const dispatch = useAppDispatch();
  const analyticsState = useAppSelector((state) => state.analytics);
  const stats = analyticsState?.stats ?? null;
  const status = analyticsState?.status ?? 'idle';
  const error = analyticsState?.error ?? null;

  useEffect(() => {
    dispatch(loadAnalyticsStats());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(loadAnalyticsStats());
  };

  return (
    <div className="w-full">
      {/* Date Range & Scope Filter Bar (FR-8.10) */}
      <AnalyticsFilterBar />

      {/* Error state */}
      {status === 'failed' && (
        <div className="p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900 text-rose-800 dark:text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error || 'Failed to load analytics statistics.'}</span>
          </div>
          <button
            type="button"
            onClick={handleRetry}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* 1. Summary Cards (FR-8.2) */}
      <SummaryCards
        summary={
          stats?.summary || {
            totalEvents: 0,
            eventsToday: 0,
            openPullRequests: 0,
            ciPassRate: null,
          }
        }
        isLoading={status === 'loading' && !stats}
      />

      {/* 2. Top Visualizations Grid: Line Chart & Doughnut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <EventsLineChart data={stats?.eventsPerDay || []} />
        </div>
        <div>
          <EventTypeDoughnut data={stats?.eventTypeShare || []} />
        </div>
      </div>

      {/* 3. Deep Dive Metrics: PR, Issues, CI (FR-8.7, FR-8.8, FR-8.9) */}
      <PrIssueCiMetrics
        prMetrics={
          stats?.pullRequestMetrics || {
            open: 0,
            merged: 0,
            closed: 0,
            avgTimeToMergeSeconds: null,
            avgTimeToMergeFormatted: null,
          }
        }
        issueMetrics={
          stats?.issueMetrics || {
            open: 0,
            closed: 0,
            avgTimeToCloseSeconds: null,
            avgTimeToCloseFormatted: null,
          }
        }
        ciMetrics={
          stats?.ciMetrics || {
            successful: 0,
            failed: 0,
            cancelled: 0,
            total: 0,
          }
        }
      />

      {/* 4. Contributors & Heatmap Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TopContributorsBarChart contributors={stats?.topContributors || []} />
        <CommitHeatmap data={stats?.commitHeatmap || []} />
      </div>
    </div>
  );
}

