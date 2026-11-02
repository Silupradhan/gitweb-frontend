'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { closeDetail } from '@/features/events/eventsSlice';
import EventIcon from './EventIcon';
import JsonViewer from './JsonViewer';
import { formatFriendlyTime } from '@/lib/timeAgo';

export default function EventDetailModal() {
  const dispatch = useAppDispatch();
  const { selectedEvent, isDetailLoading, detailError } = useAppSelector(
    (state) => state.events
  );

  if (!selectedEvent && !isDetailLoading && !detailError) {
    return null;
  }

  const handleClose = () => {
    dispatch(closeDetail());
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 min-w-0">
            {selectedEvent && (
              <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0">
                <EventIcon type={selectedEvent.eventType} className="w-5 h-5" />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {selectedEvent ? `Event #${selectedEvent.id} Details` : 'Loading Event...'}
              </h2>
              {selectedEvent && (
                <p className="text-xs text-zinc-500 font-mono truncate">
                  Delivery: {selectedEvent.deliveryId}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isDetailLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-zinc-500">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Fetching complete event payload...</span>
            </div>
          )}

          {detailError && (
            <div className="p-4 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-sm">
              {detailError}
            </div>
          )}

          {selectedEvent && (
            <>
              {/* Title Header */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/60 dark:border-zinc-800/60">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                  Title
                </span>
                <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                  {selectedEvent.title}
                </p>
              </div>

              {/* Key Fields Grid (FR-6.5) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800/70">
                  <span className="text-xs text-zinc-400 block mb-0.5">Status</span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      selectedEvent.status === 'processed'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : selectedEvent.status === 'failed'
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                        : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                    }`}
                  >
                    {selectedEvent.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800/70">
                  <span className="text-xs text-zinc-400 block mb-0.5">Event Type</span>
                  <span className="text-sm font-mono font-medium text-zinc-800 dark:text-zinc-200">
                    {selectedEvent.eventType}
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800/70">
                  <span className="text-xs text-zinc-400 block mb-0.5">Action</span>
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {selectedEvent.action || '—'}
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800/70">
                  <span className="text-xs text-zinc-400 block mb-0.5">Repository</span>
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate block">
                    {selectedEvent.repository?.fullName || '—'}
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800/70">
                  <span className="text-xs text-zinc-400 block mb-0.5">Sender</span>
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate block">
                    {selectedEvent.sender?.login || '—'}
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800/70">
                  <span className="text-xs text-zinc-400 block mb-0.5">Received Time</span>
                  <span className="text-xs text-zinc-700 dark:text-zinc-300" title={new Date(selectedEvent.receivedAt).toLocaleString()}>
                    {formatFriendlyTime(selectedEvent.receivedAt)}
                  </span>
                </div>

                {selectedEvent.errorMessage && (
                  <div className="col-span-full p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs">
                    <span className="font-semibold block mb-0.5">Error details:</span>
                    {selectedEvent.errorMessage}
                  </div>
                )}
              </div>

              {/* Collapsible Full JSON Payload (FR-6.5) */}
              <div>
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                  Original Payload (JSON)
                </span>
                <JsonViewer data={selectedEvent.payload} />
              </div>
            </>
          )}
        </div>

        {/* Modal Footer (FR-6.5: Open on GitHub link) */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/50">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            Close
          </button>

          {selectedEvent?.sourceLink ? (
            <a
              href={selectedEvent.sourceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors cursor-pointer shadow-xs"
            >
              <span>Open on GitHub</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          ) : (
            <span className="text-xs text-zinc-400 italic">No external link available</span>
          )}
        </div>
      </div>
    </div>
  );
}
