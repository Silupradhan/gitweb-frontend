import type {
  EventsResponse,
  EventDetail,
  Repository,
  FilterState,
  AnalyticsStats,
  User,
} from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export function getEventStreamUrl(): string {
  return `${BASE_URL}/events/stream`;
}

export function getGitHubLoginUrl(): string {
  return `${BASE_URL}/auth/github`;
}

export async function checkCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      credentials: 'include',
    });
    if (!res.ok) {
      if (res.status === 401) return null;
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to authenticate user');
    }
    const data = await res.json();
    return data.user ?? null;
  } catch (err) {
    console.error('[api] checkCurrentUser error:', err);
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to logout');
  }
}

export async function fetchAnalyticsStats(options?: {
  repository?: string;
  fromDate?: string;
  toDate?: string;
}): Promise<AnalyticsStats> {
  const params = new URLSearchParams();
  if (options?.repository) {
    params.set('repository', options.repository);
  }
  if (options?.fromDate) {
    params.set('fromDate', new Date(options.fromDate).toISOString());
  }
  if (options?.toDate) {
    const to = new Date(options.toDate);
    to.setHours(23, 59, 59, 999);
    params.set('toDate', to.toISOString());
  }

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${BASE_URL}/analytics/stats${query}`, {
    credentials: 'include',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch analytics statistics');
  }

  return res.json();
}

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
    const to = new Date(filters.toDate);
    to.setHours(23, 59, 59, 999);
    params.set('toDate', to.toISOString());
  }

  const res = await fetch(`${BASE_URL}/events?${params.toString()}`, {
    credentials: 'include',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch events: ${res.statusText}`);
  }

  return res.json();
}

export async function fetchEventById(id: number): Promise<EventDetail> {
  const res = await fetch(`${BASE_URL}/events/${id}`, {
    credentials: 'include',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch event #${id}`);
  }

  return res.json();
}

export async function fetchRepositories(): Promise<Repository[]> {
  const res = await fetch(`${BASE_URL}/repos`, {
    credentials: 'include',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch repositories');
  }

  return res.json();
}
