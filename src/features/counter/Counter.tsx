'use client';

import { decrement, increment, reset } from '@/features/counter/counterSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

/** Small demo proving Redux works end-to-end on the home page. */
export default function Counter() {
  const value = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl border border-black/[.08] bg-white px-6 py-4 dark:border-white/[.145] dark:bg-zinc-900">
      <button
        type="button"
        aria-label="Decrement"
        onClick={() => dispatch(decrement())}
        className="h-9 w-9 cursor-pointer rounded-full border border-black/[.08] text-lg dark:border-white/[.145]"
      >
        −
      </button>
      <span className="min-w-14 text-center font-mono text-lg">{value}</span>
      <button
        type="button"
        aria-label="Increment"
        onClick={() => dispatch(increment())}
        className="h-9 w-9 cursor-pointer rounded-full border border-black/[.08] text-lg dark:border-white/[.145]"
      >
        +
      </button>
      <button
        type="button"
        onClick={() => dispatch(reset())}
        className="ml-2 cursor-pointer text-sm text-zinc-600 underline dark:text-zinc-400"
      >
        Reset
      </button>
    </div>
  );
}
