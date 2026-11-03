'use client';

import React from 'react';
import type { AnalyticsStats } from '@/lib/types';

interface PrIssueCiMetricsProps {
  prMetrics: AnalyticsStats['pullRequestMetrics'];
  issueMetrics: AnalyticsStats['issueMetrics'];
  ciMetrics: AnalyticsStats['ciMetrics'];
}

export default function PrIssueCiMetrics({
  prMetrics,
  issueMetrics,
  ciMetrics,
}: PrIssueCiMetricsProps) {
  const prTotal = prMetrics.open + prMetrics.merged + prMetrics.closed;
  const issueTotal = issueMetrics.open + issueMetrics.closed;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* 1. Pull Request Metrics (FR-8.7) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Pull Requests
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 font-medium">
              FR-8.7
            </span>
          </div>

          <div className="mb-4">
            <div className="text-xs text-zinc-400 dark:text-zinc-500 mb-1">
              Average Time to Merge
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {prMetrics.avgTimeToMergeFormatted || 'N/A'}
            </div>
            <div className="text-[11px] text-zinc-400">
              {prMetrics.merged > 0
                ? `Calculated from ${prMetrics.merged} merged PR${prMetrics.merged === 1 ? '' : 's'}`
                : 'No merged PRs with timestamps yet'}
            </div>
          </div>
        </div>

        {/* PR Status Breakdown */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-emerald-600 dark:text-emerald-400">
              Open: {prMetrics.open}
            </span>
            <span className="text-purple-600 dark:text-purple-400">
              Merged: {prMetrics.merged}
            </span>
            <span className="text-rose-600 dark:text-rose-400">
              Closed: {prMetrics.closed}
            </span>
          </div>

          {/* Ratio bar */}
          <div className="h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex overflow-hidden">
            {prTotal > 0 ? (
              <>
                <div
                  className="bg-emerald-500 transition-all"
                  style={{ width: `${(prMetrics.open / prTotal) * 100}%` }}
                />
                <div
                  className="bg-purple-500 transition-all"
                  style={{ width: `${(prMetrics.merged / prTotal) * 100}%` }}
                />
                <div
                  className="bg-rose-500 transition-all"
                  style={{ width: `${(prMetrics.closed / prTotal) * 100}%` }}
                />
              </>
            ) : (
              <div className="w-full bg-zinc-200 dark:bg-zinc-800" />
            )}
          </div>
        </div>
      </div>

      {/* 2. Issue Metrics (FR-8.8) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Issues Resolution
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 font-medium">
              FR-8.8
            </span>
          </div>

          <div className="mb-4">
            <div className="text-xs text-zinc-400 dark:text-zinc-500 mb-1">
              Average Time to Close
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {issueMetrics.avgTimeToCloseFormatted || 'N/A'}
            </div>
            <div className="text-[11px] text-zinc-400">
              {issueMetrics.closed > 0
                ? `Calculated from ${issueMetrics.closed} closed issue${issueMetrics.closed === 1 ? '' : 's'}`
                : 'No closed issues with timestamps yet'}
            </div>
          </div>
        </div>

        {/* Issue status breakdown */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-emerald-600 dark:text-emerald-400">
              Open: {issueMetrics.open}
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">
              Closed: {issueMetrics.closed}
            </span>
          </div>

          {/* Ratio bar */}
          <div className="h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex overflow-hidden">
            {issueTotal > 0 ? (
              <>
                <div
                  className="bg-emerald-500 transition-all"
                  style={{ width: `${(issueMetrics.open / issueTotal) * 100}%` }}
                />
                <div
                  className="bg-zinc-400 dark:bg-zinc-600 transition-all"
                  style={{ width: `${(issueMetrics.closed / issueTotal) * 100}%` }}
                />
              </>
            ) : (
              <div className="w-full bg-zinc-200 dark:bg-zinc-800" />
            )}
          </div>
        </div>
      </div>

      {/* 3. CI Metrics (FR-8.9) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              CI Workflow Runs
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-medium">
              FR-8.9
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/60 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                Passed
              </span>
              <span className="text-lg font-bold text-emerald-800 dark:text-emerald-300">
                {ciMetrics.successful}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/60 text-center">
              <span className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-400 block mb-0.5">
                Failed
              </span>
              <span className="text-lg font-bold text-rose-800 dark:text-rose-300">
                {ciMetrics.failed}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-center">
              <span className="text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400 block mb-0.5">
                Cancelled
              </span>
              <span className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                {ciMetrics.cancelled}
              </span>
            </div>
          </div>
        </div>

        {/* Total runs */}
        <div className="text-xs text-zinc-400 text-right">
          Total: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{ciMetrics.total}</span> runs
        </div>
      </div>
    </div>
  );
}

