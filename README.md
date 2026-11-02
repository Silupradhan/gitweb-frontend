# GitHub Webhook Event Hub — Frontend

A real-time Next.js (App Router) + Tailwind CSS + Redux Toolkit dashboard for monitoring, filtering, and inspecting GitHub webhook events.

## Features (Feature 6: Event Feed and Detail View)

- **Header (FR-6.1)**: Brand title, live feed indicator, and one-click refresh button.
- **Filter Bar (FR-6.2)**:
  - Repository selector (with dynamic event counts)
  - Event type selector (Push, Pull Request, Issues, Star, etc.)
  - Real-time text search on event titles (debounced)
  - Date range filters (From / To)
  - One-click filter reset
- **Event Feed Cards (FR-6.3)**:
  - Sender avatar with fallback initials
  - GitHub event type icon
  - Human-readable event title (e.g. `PR #4 opened: Fix login bug`)
  - Repository name badge
  - Friendly relative time (e.g. `5 minutes ago`)
- **Cursor Pagination (FR-6.4)**: "Load more" control fetching consecutive pages using cursor pagination (zero duplicates, zero gaps).
- **Event Detail View (FR-6.5)**:
  - Key fields (ID, Delivery UUID, status, type, action, repository, sender, timestamps)
  - Collapsible, syntax-colored JSON tree for the complete original payload
  - One-click "Copy JSON" button
  - "Open on GitHub" link
- **Strict Plain Text Display (FR-6.6)**: Safe against script injection (all text rendered as pure string content, never HTML).
- **Responsive States (FR-6.7)**: Animated loading skeletons, friendly empty state, and error message banners across mobile, tablet, and desktop screens.

---

## Getting Started

1. Make sure your backend server is running on `http://localhost:3000`:
   ```bash
   cd ../backend
   npm run dev
   ```

2. Start the Next.js frontend (runs on port 3001):
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3001](http://localhost:3001) in your browser.
