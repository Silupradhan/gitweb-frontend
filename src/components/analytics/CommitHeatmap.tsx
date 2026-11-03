'use client';

import React, { useState } from 'react';

interface CommitHeatmapProps {
  data: Array<{
    date: string;
    pushCount: number;
    commitCount: number;
  }>;
}

export default function CommitHeatmap({ data }: CommitHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    commits: number;
    pushes: number;
  } | null>(null);

  // Map dates to commit counts
  const countMap = new Map<string, { commits: number; pushes: number }>();
  let totalCommits = 0;
  let totalPushes = 0;

  if (data && data.length > 0) {
    for (const item of data) {
      countMap.set(item.date, {
        commits: item.commitCount,
        pushes: item.pushCount,
      });
      totalCommits += item.commitCount;
      totalPushes += item.pushCount;
    }
  }

  // Generate the last 20 weeks (140 days) ending today
  const days: Array<{ dateStr: string; dayOfWeek: number }> = [];
  const today = new Date();
  const numWeeks = 20;
  const totalDays = numWeeks * 7;

  // Align so the last day is today
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    days.push({
      dateStr,
      dayOfWeek: d.getDay(), // 0 = Sun, 1 = Mon ...
    });
  }

  // Group into columns of 7 days
  const weeks: Array<typeof days> = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  function getIntensityClass(commits: number): string {
    if (commits === 0) return 'bg-zinc-100 dark:bg-zinc-800/80 hover:ring-1 hover:ring-zinc-400';
    if (commits <= 2) return 'bg-emerald-200 dark:bg-emerald-950/80 text-emerald-900 hover:ring-1 hover:ring-emerald-400';
    if (commits <= 5) return 'bg-emerald-400 dark:bg-emerald-700 hover:ring-1 hover:ring-emerald-300';
    return 'bg-emerald-600 dark:bg-emerald-500 hover:ring-1 hover:ring-emerald-200';
  }

  const hasAnyData = countMap.size > 0;

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Commit Activity Heatmap
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Daily commit density from push events (FR-8.6)
          </p>
        </div>

        {hoveredDay ? (
          <div className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900">
            <span className="font-semibold">{hoveredDay.commits} commit{hoveredDay.commits === 1 ? '' : 's'}</span> ({hoveredDay.pushes} push{hoveredDay.pushes === 1 ? '' : 'es'}) on {hoveredDay.date}
          </div>
        ) : hasAnyData ? (
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{totalCommits}</span> commits across{' '}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{totalPushes}</span> pushes
          </div>
        ) : null}
      </div>

      {!hasAnyData ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
            No Push Activity Recorded
          </h4>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-sm">
            Push commits will form your contribution heatmap here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex gap-1.5 min-w-full">
            {weeks.map((week, wIndex) => (
              <div key={wIndex} className="flex flex-col gap-1.5">
                {week.map((day) => {
                  const dayData = countMap.get(day.dateStr) || { commits: 0, pushes: 0 };
                  const colorClass = getIntensityClass(dayData.commits);

                  return (
                    <div
                      key={day.dateStr}
                      onMouseEnter={() =>
                        setHoveredDay({
                          date: day.dateStr,
                          commits: dayData.commits,
                          pushes: dayData.pushes,
                        })
                      }
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-3.5 h-3.5 rounded-xs transition-all cursor-pointer ${colorClass}`}
                      title={`${dayData.commits} commits on ${day.dateStr}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 text-[11px] text-zinc-400 mt-4">
            <span>Less</span>
            <span className="w-3 h-3 rounded-xs bg-zinc-100 dark:bg-zinc-800/80" />
            <span className="w-3 h-3 rounded-xs bg-emerald-200 dark:bg-emerald-950/80" />
            <span className="w-3 h-3 rounded-xs bg-emerald-400 dark:bg-emerald-700" />
            <span className="w-3 h-3 rounded-xs bg-emerald-600 dark:bg-emerald-500" />
            <span>More</span>
          </div>
        </div>
      )}
    </div>
  );
}

