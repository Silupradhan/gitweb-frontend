import { configureStore } from '@reduxjs/toolkit';

import { counterReducer } from '@/features/counter/counterSlice';

/**
 * Store factory — Next.js App Router creates one store per request/session,
 * so the store must be created lazily (see StoreProvider).
 */
export const makeStore = () =>
  configureStore({
    reducer: {
      counter: counterReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
