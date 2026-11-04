import { configureStore } from '@reduxjs/toolkit';

import { counterReducer } from '@/features/counter/counterSlice';
import { eventsReducer } from '@/features/events/eventsSlice';
import { analyticsReducer } from '@/features/analytics/analyticsSlice';
import authReducer from '@/features/auth/authSlice';

/**
 * Store factory — Next.js App Router creates one store per request/session,
 * so the store must be created lazily (see StoreProvider).
 */
export const makeStore = () =>
  configureStore({
    reducer: {
      counter: counterReducer,
      events: eventsReducer,
      analytics: analyticsReducer,
      auth: authReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
