'use client';

import React from 'react';

interface TopContributorsBarChartProps {
  contributors: Array<{
    login: string;
    avatarUrl: string | null;
    eventCount: number;
  }>;
}

export default function TopContributorsBarChart({
  contributors,
}: TopContributorsBarChartProps) {
  if (!contributors || contributors.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
          No Contributors Recorded
        </h4>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-xs">
          Sender identities will appear as webhook events arrive.
        </p>
      </div>
    );
  }

  const maxCount = Math.max(...contributors.map((c) => c.eventCount), 1);

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Top Contributors
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Most active senders by event count (FR-8.5)
        </p>
      </div>

      <div className="flex flex-col gap-3 py-1">
        {contributors.map((user, index) => {
          const widthPercent = Math.max((user.eventCount / maxCount) * 100, 4);

          return (
            <div key={user.login} className="flex items-center gap-3 text-xs">
              {/* Rank & Avatar */}
              <div className="flex items-center gap-2 w-28 shrink-0">
                <span className="w-4 font-mono text-[11px] text-zinc-400 text-right">
                  #{index + 1}
                </span>
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.login}
                    className="w-6 h-6 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-[10px] text-zinc-600 dark:text-zinc-300">
                    {user.login.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {user.login}
                </span>
              </div>

              {/* Bar track */}
              <div className="flex-1 h-3 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>

              {/* Count badge */}
              <span className="w-12 text-right font-mono font-semibold text-zinc-700 dark:text-zinc-300 shrink-0">
                {user.eventCount}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

