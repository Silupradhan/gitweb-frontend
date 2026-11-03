'use client';

import React from 'react';
import type { AnalyticsStats } from '@/lib/types';

interface SummaryCardsProps {
  summary: AnalyticsStats['summary'];
  isLoading?: boolean;
}

export default function SummaryCards({ summary, isLoading }: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 animate-pulse"
          >
            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded mb-3" />
            <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Events',
      value: summary.totalEvents.toLocaleString(),
      subtext: 'Across selected scope',
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      bgGlow: 'from-blue-500/10 to-transparent',
    },
    {
      title: 'Events Today',
      value: summary.eventsToday.toLocaleString(),
      subtext: 'Since 00:00 UTC',
      icon: (
        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgGlow: 'from-amber-500/10 to-transparent',
    },
    {
      title: 'Open Pull Requests',
      value: summary.openPullRequests.toLocaleString(),
      subtext: 'Awaiting review or merge',
      icon: (
        <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100 4 2 2 0 000-4zm10-5a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      ),
      bgGlow: 'from-purple-500/10 to-transparent',
    },
    {
      title: 'CI Pass Rate',
      value: summary.ciPassRate !== null ? `${summary.ciPassRate}%` : 'N/A',
      subtext: summary.ciPassRate !== null ? 'Workflow run success' : 'No CI workflow runs',
      icon: (
        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgGlow: 'from-emerald-500/10 to-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="relative overflow-hidden p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-xs"
        >
          <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl ${card.bgGlow} rounded-bl-full pointer-events-none`} />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {card.title}
            </span>
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800">
              {card.icon}
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {card.value}
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
            {card.subtext}
          </p>
        </div>
      ))}
    </div>
  );
}

