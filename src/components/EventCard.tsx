'use client';

import React from 'react';
import type { EventItem } from '@/lib/types';
import EventIcon from './EventIcon';
import { formatFriendlyTime } from '@/lib/timeAgo';

interface EventCardProps {
  event: EventItem;
  onClick: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all cursor-pointer gap-3"
    >
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        {/* Sender Avatar with fallback */}
        <div className="relative shrink-0">
          {event.senderAvatar ? (
            <img
              src={event.senderAvatar}
              alt={event.senderName || 'Sender avatar'}
              className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 object-cover bg-zinc-100 dark:bg-zinc-800"
              onError={(e) => {
                // Fallback to placeholder if avatar fails to load
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              {(event.senderName || 'U').slice(0, 2).toUpperCase()}
            </div>
          )}

          {/* Event Type Icon badge overlay */}
          <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <EventIcon type={event.eventType} className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Event Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {/* Repository Badge */}
            {event.repositoryName && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 truncate max-w-[200px]">
                {event.repositoryName}
              </span>
            )}

            {/* Event Type Badge */}
            <span className="text-xs uppercase tracking-wide font-mono text-zinc-400 dark:text-zinc-500">
              {event.eventType}
            </span>
          </div>

          {/* Plain Text Title (FR-6.6: strictly rendered as text, never HTML) */}
          <h3 className="text-sm sm:text-base font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {event.title}
          </h3>
        </div>
      </div>

      {/* Right meta (Time in friendly form & arrow) */}
      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center text-xs text-zinc-500 dark:text-zinc-400">
        <span suppressHydrationWarning title={new Date(event.receivedAt).toLocaleString()}>
          {formatFriendlyTime(event.receivedAt)}
        </span>
        <svg
          className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
}

