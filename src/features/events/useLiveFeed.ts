'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  setConnectionStatus,
  liveEventReceived,
} from './eventsSlice';
import { getEventStreamUrl } from '@/lib/api';
import type { EventItem, FilterState } from '@/lib/types';

/**
 * Evaluates whether an incoming live event matches the active dashboard filters (FR-7.6).
 */
export function matchesFilters(event: EventItem, filters: FilterState): boolean {
  // Repository filter
  if (filters.repository && event.repositoryName !== filters.repository) {
    return false;
  }

  // Event type filter
  if (filters.eventType && event.eventType !== filters.eventType) {
    return false;
  }

  // Text search (matches title, repo name, or sender)
  if (filters.search && filters.search.trim()) {
    const term = filters.search.trim().toLowerCase();
    const titleMatch = (event.title || '').toLowerCase().includes(term);
    const repoMatch = (event.repositoryName || '').toLowerCase().includes(term);
    const senderMatch = (event.senderName || '').toLowerCase().includes(term);
    if (!titleMatch && !repoMatch && !senderMatch) {
      return false;
    }
  }

  // Date range filters
  if (filters.fromDate) {
    const from = new Date(filters.fromDate).getTime();
    const eventTime = new Date(event.receivedAt).getTime();
    if (eventTime < from) return false;
  }

  if (filters.toDate) {
    const to = new Date(filters.toDate);
    to.setHours(23, 59, 59, 999);
    const eventTime = new Date(event.receivedAt).getTime();
    if (eventTime > to.getTime()) return false;
  }

  return true;
}

/**
 * Custom React hook establishing and maintaining an SSE stream connection (FR-7.1, FR-7.7).
 * Automatically reconnects on interruption and updates UI indicators accordingly.
 */
export function useLiveFeed() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.events.filters);
  const filtersRef = useRef(filters);

  // Keep latest filters accessible to SSE callback without recreating EventSource
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let eventSource: EventSource | null = null;
    let isMounted = true;

    function connect() {
      const url = getEventStreamUrl();
      eventSource = new EventSource(url);

      eventSource.onopen = () => {
        if (!isMounted) return;
        dispatch(setConnectionStatus('connected'));
      };

      eventSource.onmessage = (e) => {
        if (!isMounted) return;
        try {
          const newEvent: EventItem = JSON.parse(e.data);
          // FR-7.6: Only add live event if it matches currently selected filters
          if (matchesFilters(newEvent, filtersRef.current)) {
            dispatch(liveEventReceived(newEvent));
          }
        } catch (err) {
          console.error('[LiveFeed] Failed to parse incoming event:', err);
        }
      };

      eventSource.onerror = () => {
        if (!isMounted) return;
        // FR-7.7: Native EventSource handles reconnect automatically; notify UI
        dispatch(setConnectionStatus('reconnecting'));
      };
    }

    connect();

    return () => {
      isMounted = false;
      if (eventSource) {
        eventSource.close();
      }
      dispatch(setConnectionStatus('disconnected'));
    };
  }, [dispatch]);
}

