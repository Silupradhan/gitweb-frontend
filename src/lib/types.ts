export interface EventItem {
  id: number;
  eventType: string;
  action: string | null;
  title: string;
  receivedAt: string;
  repositoryName: string | null;
  senderName: string | null;
  senderAvatar: string | null;
  sourceLink: string | null;
  isNew?: boolean;
}

export interface EventDetail {
  id: number;
  deliveryId: string;
  eventType: string;
  action: string | null;
  title: string | null;
  sourceLink: string | null;
  status: string;
  errorMessage: string | null;
  payload: Record<string, unknown>;
  receivedAt: string;
  processedAt: string | null;
  repository: {
    id: number;
    githubRepoId: number;
    fullName: string;
    ownerLogin: string;
    isPrivate: boolean;
    webAddress: string | null;
  } | null;
  sender: {
    id: number;
    githubUserId: number;
    login: string;
    avatarUrl: string | null;
    profileUrl: string | null;
  } | null;
}

export interface Repository {
  id: number;
  githubRepoId: number;
  fullName: string;
  ownerLogin: string;
  isPrivate: boolean;
  webAddress: string | null;
  eventCount: number;
}

export interface FilterState {
  repository: string;
  eventType: string;
  search: string;
  fromDate: string;
  toDate: string;
}

export interface EventsResponse {
  data: EventItem[];
  pagination: {
    limit: number;
    hasMore: boolean;
    nextCursor: string | null;
  };
}

export interface AnalyticsStats {
  summary: {
    totalEvents: number;
    eventsToday: number;
    openPullRequests: number;
    ciPassRate: number | null;
  };
  eventsPerDay: Array<{
    date: string;
    count: number;
  }>;
  eventTypeShare: Array<{
    eventType: string;
    count: number;
    percentage: number;
  }>;
  topContributors: Array<{
    login: string;
    avatarUrl: string | null;
    eventCount: number;
  }>;
  commitHeatmap: Array<{
    date: string;
    pushCount: number;
    commitCount: number;
  }>;
  pullRequestMetrics: {
    open: number;
    merged: number;
    closed: number;
    avgTimeToMergeSeconds: number | null;
    avgTimeToMergeFormatted: string | null;
  };
  issueMetrics: {
    open: number;
    closed: number;
    avgTimeToCloseSeconds: number | null;
    avgTimeToCloseFormatted: string | null;
  };
  ciMetrics: {
    successful: number;
    failed: number;
    cancelled: number;
    total: number;
  };
}

export interface AnalyticsFilterState {
  repository: string;
  preset: '7d' | '30d' | '90d' | 'all' | 'custom';
  fromDate: string;
  toDate: string;
}


