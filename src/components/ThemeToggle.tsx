'use client';

/**
 * Dark/light mode toggle. Operates purely on the `dark` class of <html>
 * (icons are swapped with CSS via the dark: variant, so there is no React
 * state and therefore no hydration mismatch). The choice persists in
 * localStorage under the `theme` key; the root layout's inline script
 * applies it before first paint.
 */
export default function ThemeToggle() {
  const toggle = () => {
    try {
      const root = document.documentElement;
      const isDark = root.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch {
      // localStorage unavailable (e.g. private mode) — still toggle visually
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark and light mode"
      title="Toggle dark and light mode"
      className="flex items-center justify-center w-7 h-7 rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
    >
      {/* Moon = switch to dark (shown in light mode) */}
      <svg
        className="w-3.5 h-3.5 dark:hidden"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
      {/* Sun = switch to light (shown in dark mode) */}
      <svg
        className="hidden w-3.5 h-3.5 dark:block"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    </button>
  );
}
