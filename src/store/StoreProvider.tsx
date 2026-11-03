'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';

import { makeStore, type AppStore } from './store';

/**
 * Wraps the app with the Redux store.
 * Created on first render per browser session (server components never touch it).
 */
export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current || !('analytics' in storeRef.current.getState())) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
