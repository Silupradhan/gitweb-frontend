import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { EventItem, EventDetail, Repository, FilterState } from '@/lib/types';
import { fetchEvents, fetchEventById, fetchRepositories } from '@/lib/api';

interface EventsState {
  items: EventItem[];
  repositories: Repository[];
  filters: FilterState;
  pagination: {
    limit: number;
    hasMore: boolean;
    nextCursor: string | null;
  };
  status: 'idle' | 'loading' | 'loadingMore' | 'succeeded' | 'failed';
  error: string | null;
  selectedEvent: EventDetail | null;
  isDetailLoading: boolean;
  detailError: string | null;
  connectionStatus: 'connected' | 'reconnecting' | 'disconnected';
}

const initialFilters: FilterState = {
  repository: '',
  eventType: '',
  search: '',
  fromDate: '',
  toDate: '',
};

const initialState: EventsState = {
  items: [],
  repositories: [],
  filters: initialFilters,
  pagination: {
    limit: 50,
    hasMore: false,
    nextCursor: null,
  },
  status: 'idle',
  error: null,
  selectedEvent: null,
  isDetailLoading: false,
  detailError: null,
  connectionStatus: 'disconnected',
};

export const loadRepositories = createAsyncThunk(
  'events/loadRepositories',
  async () => {
    return await fetchRepositories();
  }
);

export const loadEvents = createAsyncThunk(
  'events/loadEvents',
  async (_, { getState }) => {
    const state = getState() as { events: EventsState };
    return await fetchEvents(state.events.filters, null, state.events.pagination.limit);
  }
);

export const loadMoreEvents = createAsyncThunk(
  'events/loadMoreEvents',
  async (_, { getState }) => {
    const state = getState() as { events: EventsState };
    const cursor = state.events.pagination.nextCursor;
    if (!cursor) {
      throw new Error('No more events to load');
    }
    return await fetchEvents(state.events.filters, cursor, state.events.pagination.limit);
  }
);

export const loadEventDetail = createAsyncThunk(
  'events/loadEventDetail',
  async (id: number) => {
    return await fetchEventById(id);
  }
);

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<{ key: keyof FilterState; value: string }>
    ) => {
      state.filters[action.payload.key] = action.payload.value;
    },
    resetFilters: (state) => {
      state.filters = { ...initialFilters };
    },
    closeDetail: (state) => {
      state.selectedEvent = null;
      state.detailError = null;
    },
    setConnectionStatus: (
      state,
      action: PayloadAction<'connected' | 'reconnecting' | 'disconnected'>
    ) => {
      state.connectionStatus = action.payload;
    },
    liveEventReceived: (state, action: PayloadAction<EventItem>) => {
      const incoming = action.payload;
      const exists = state.items.some((item) => item.id === incoming.id);
      if (!exists) {
        state.items.unshift({ ...incoming, isNew: true });
        // Bump repository event count if repository is tracked
        if (incoming.repositoryName) {
          const repo = state.repositories.find((r) => r.fullName === incoming.repositoryName);
          if (repo) {
            repo.eventCount = (Number(repo.eventCount) || 0) + 1;
          }
        }
      }
    },
    clearNewHighlight: (state, action: PayloadAction<number>) => {
      const item = state.items.find((ev) => ev.id === action.payload);
      if (item) {
        item.isNew = false;
      }
    },
  },
  extraReducers: (builder) => {
    // loadRepositories
    builder.addCase(loadRepositories.fulfilled, (state, action) => {
      state.repositories = action.payload;
    });

    // loadEvents
    builder
      .addCase(loadEvents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(loadEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load events';
      });

    // loadMoreEvents
    builder
      .addCase(loadMoreEvents.pending, (state) => {
        state.status = 'loadingMore';
      })
      .addCase(loadMoreEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = [...state.items, ...action.payload.data];
        state.pagination = action.payload.pagination;
      })
      .addCase(loadMoreEvents.rejected, (state, action) => {
        state.status = 'succeeded'; // Keep previous items on error
        state.error = action.error.message || 'Failed to load more events';
      });

    // loadEventDetail
    builder
      .addCase(loadEventDetail.pending, (state) => {
        state.isDetailLoading = true;
        state.detailError = null;
      })
      .addCase(loadEventDetail.fulfilled, (state, action) => {
        state.isDetailLoading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(loadEventDetail.rejected, (state, action) => {
        state.isDetailLoading = false;
        state.detailError = action.error.message || 'Failed to load event details';
      });
  },
});

export const {
  setFilter,
  resetFilters,
  closeDetail,
  setConnectionStatus,
  liveEventReceived,
  clearNewHighlight,
} = eventsSlice.actions;
export const eventsReducer = eventsSlice.reducer;

