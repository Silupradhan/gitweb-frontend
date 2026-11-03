'use client';

import React from 'react';

interface EventTypeDoughnutProps {
  data: Array<{ eventType: string; count: number; percentage: number }>;
}

const PALETTE = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#8b5cf6', // purple
  '#f59e0b', // amber
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#6366f1', // indigo
  '#f97316', // orange
  '#14b8a6', // teal
  '#64748b', // slate
];

export default function EventTypeDoughnut({ data }: EventTypeDoughnutProps) {
  if (!data || data.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          </svg>
        </div>
        <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
          No Event Types
        </h4>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-xs">
          No events have been categorized yet.
        </p>
      </div>
    );
  }

  const totalCount = data.reduce((acc, curr) => acc + curr.count, 0);
  const size = 180;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Event Distribution
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Share by GitHub event type (FR-8.4)
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-auto py-2">
        {/* Doughnut SVG */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="currentColor"
              className="text-zinc-100 dark:text-zinc-800"
              strokeWidth={strokeWidth}
            />

            {/* Segments */}
            {data.map((item, index) => {
              const fraction = totalCount > 0 ? item.count / totalCount : 0;
              const strokeDasharray = `${circumference * fraction} ${circumference * (1 - fraction)}`;
              const strokeDashoffset = -circumference * accumulatedPercent;
              accumulatedPercent += fraction;

              return (
                <circle
                  key={item.eventType}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={PALETTE[index % PALETTE.length]}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>

          {/* Center text */}
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {totalCount}
            </span>
            <span className="text-[10px] uppercase font-mono text-zinc-400">
              Total
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 w-full max-w-xs max-h-48 overflow-y-auto pr-1">
          {data.map((item, index) => {
            const color = PALETTE[index % PALETTE.length];
            return (
              <div
                key={item.eventType}
                className="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-mono text-zinc-700 dark:text-zinc-300 truncate">
                    {item.eventType}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.count}
                  </span>
                  <span className="text-zinc-400 font-mono text-[11px] w-10 text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

