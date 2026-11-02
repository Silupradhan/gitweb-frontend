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

