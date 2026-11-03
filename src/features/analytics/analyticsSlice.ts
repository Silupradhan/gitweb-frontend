import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { AnalyticsStats, AnalyticsFilterState } from '@/lib/types';
import { fetchAnalyticsStats } from '@/lib/api';

interface AnalyticsState {
  stats: AnalyticsStats | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: AnalyticsFilterState;
}

const initialFilters: AnalyticsFilterState = {
  repository: '',
  preset: '30d',
  fromDate: '',
  toDate: '',
};

const initialState: AnalyticsState = {
  stats: null,
  status: 'idle',
  error: null,
  filters: initialFilters,
};

function computeDatesFromPreset(preset: AnalyticsFilterState['preset']): {
  fromDate: string;
  toDate: string;
} {
  const now = new Date();
  const toDate = now.toISOString().split('T')[0];

  if (preset === '7d') {
    const from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return { fromDate: from.toISOString().split('T')[0], toDate };
  }
  if (preset === '30d') {
    const from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return { fromDate: from.toISOString().split('T')[0], toDate };
  }
  if (preset === '90d') {
    const from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    return { fromDate: from.toISOString().split('T')[0], toDate };
  }
  // 'all' or 'custom'
  return { fromDate: '', toDate: '' };
}

export const loadAnalyticsStats = createAsyncThunk(
  'analytics/loadStats',
  async (_, { getState }) => {
    const state = getState() as { analytics?: AnalyticsState };
    const filters = state.analytics?.filters ?? initialFilters;
    const { repository, preset, fromDate, toDate } = filters;

    let effectiveFrom = fromDate;
    let effectiveTo = toDate;

    if (preset !== 'custom' && preset !== 'all') {
      const computed = computeDatesFromPreset(preset);
      effectiveFrom = computed.fromDate;
      effectiveTo = computed.toDate;
    }

    return await fetchAnalyticsStats({
      repository: repository || undefined,
      fromDate: effectiveFrom || undefined,
      toDate: effectiveTo || undefined,
    });
  }
);

export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setPreset: (state, action: PayloadAction<AnalyticsFilterState['preset']>) => {
      state.filters.preset = action.payload;
      if (action.payload !== 'custom') {
        const computed = computeDatesFromPreset(action.payload);
        state.filters.fromDate = computed.fromDate;
        state.filters.toDate = computed.toDate;
      }
    },
    setRepositoryFilter: (state, action: PayloadAction<string>) => {
      state.filters.repository = action.payload;
    },
    setCustomDateRange: (
      state,
      action: PayloadAction<{ fromDate: string; toDate: string }>
    ) => {
      state.filters.preset = 'custom';
      state.filters.fromDate = action.payload.fromDate;
      state.filters.toDate = action.payload.toDate;
    },
    resetAnalyticsFilters: (state) => {
      state.filters = { ...initialFilters };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAnalyticsStats.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadAnalyticsStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload;
      })
      .addCase(loadAnalyticsStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load analytics';
      });
  },
});

export const {
  setPreset,
  setRepositoryFilter,
  setCustomDateRange,
  resetAnalyticsFilters,
} = analyticsSlice.actions;

export const analyticsReducer = analyticsSlice.reducer;

