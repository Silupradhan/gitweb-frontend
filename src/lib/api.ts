import type { EventsResponse, EventDetail, Repository, FilterState } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export async function fetchEvents(
  filters: FilterState,
  cursor: string | null = null,
  limit = 50
): Promise<EventsResponse> {
  const params = new URLSearchParams();
  params.set('limit', String(limit));

  if (cursor) {
    params.set('cursor', cursor);
  }
  if (filters.repository) {
    params.set('repository', filters.repository);
  }
  if (filters.eventType) {
    params.set('eventType', filters.eventType);
  }
  if (filters.search) {
    params.set('search', filters.search);
  }
  if (filters.fromDate) {
    params.set('fromDate', new Date(filters.fromDate).toISOString());
  }
  if (filters.toDate) {
    // End of selected day
    const to = new Date(filters.toDate);
    to.setHours(23, 59, 59, 999);
    params.set('toDate', to.toISOString());
  }

  const res = await fetch(`${BASE_URL}/events?${params.toString()}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch events: ${res.statusText}`);
  }

  return res.json();
}

export async function fetchEventById(id: number): Promise<EventDetail> {
  const res = await fetch(`${BASE_URL}/events/${id}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch event #${id}`);
  }

  return res.json();
}

export async function fetchRepositories(): Promise<Repository[]> {
  const res = await fetch(`${BASE_URL}/repos`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch repositories');
  }

  return res.json();
}

