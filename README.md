# FinFlow

FinFlow is a local-first personal finance dashboard built with React, TypeScript, and Recharts. It combines transaction management, responsive analytics, theme support, and interactive charting in a single frontend application.

The project is designed around a simple principle: keep transaction data as the source of truth, then derive summaries, charts, and insights from that shared dataset. This keeps the UI consistent, reduces duplicated state, and makes the product easier to extend.

## Overview

FinFlow provides three main product surfaces:

- A dashboard for high-level financial monitoring
- A transactions workspace for filtering, sorting, editing, and exporting records
- An insights page for deeper trend analysis and category concentration review

It also includes light and dark mode, responsive layouts for smaller screens, a role-based UI mode switch, local persistence, and a dedicated 404 page.

## Key Features

### Dashboard

- KPI cards for liquidity, income, expenses, and net savings
- Balance trajectory chart comparing balance, income, and expense movement
- Interactive expense mix donut with animated active slices
- Recent transactions summary

### Transactions

- Search with debounce for smoother filtering
- Category, type, and date-range filters
- Sortable transaction columns
- Inline edit and delete actions for admin mode
- CSV export for visible rows
- Responsive mobile-friendly transaction table layout

### Insights

- Combined income, expense, and balance performance chart
- Savings-rate trend chart with benchmark reference
- Category concentration bar chart
- Interactive expense-mix donut
- Analyst-style summary cards and observations

### User Experience

- Dark and light themes with persisted preference
- Responsive shell and mobile navigation drawer
- Shared design tokens and glass-style surfaces
- Custom 404 page for invalid routes

## Product Approach

The implementation is intentionally structured to keep the application predictable and maintainable.

### Single Source of Truth

Transactions live in the Zustand store, and everything else is derived from them. Totals, category splits, monthly summaries, and trend indicators are computed from the same raw data rather than being stored separately.

### Derived Analytics

Financial summaries are centralized through `src/hooks/useDerivedFinancials.ts`. This keeps chart logic and KPI calculations in one place, which helps prevent inconsistencies between pages.

### UI Composition

The app is organized by product area:

- `src/components/dashboard` for dashboard-specific widgets
- `src/components/transactions` for ledger and form interactions
- `src/components/layout` and `src/components/shared` for reusable shell and UI patterns
- `src/pages` for route-level composition

### Local-First UX

State persistence is handled in the browser using Zustand persistence middleware. Theme preference, role, and transaction data remain available after refresh without requiring a backend.

## Tech Stack

### Core

- React 19
- TypeScript
- Vite 8

### Routing And State

- React Router 7
- Zustand 5
- Zustand persist middleware

### UI And Visualization

- Tailwind CSS 4
- Custom CSS tokens and theme variables in `src/index.css`
- Recharts
- Lucide React
- Animate.css

### Supporting Utilities

- date-fns
- ESLint 9

## Why This Stack

- React provides a clean component model for dashboard-heavy interfaces.
- TypeScript improves safety across transactions, filters, chart data, and store contracts.
- Vite keeps development fast and the project setup lightweight.
- Zustand keeps state management simple without unnecessary boilerplate.
- Recharts works well for interactive React dashboards and supports custom tooltip and active-shape behavior.
- Tailwind CSS 4 speeds up layout and responsive styling, while custom CSS variables keep theming and branding centralized.

## Getting Started

### Requirements

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Run In Development

```bash
npm run dev
```

The dev server runs at `http://localhost:5173`.

### Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Project Structure

```text
src/
  components/
    bento/
    dashboard/
    layout/
    shared/
    transactions/
  constants/
  hooks/
  pages/
  store/
  types/
  utils/
```

## Notable Implementation Details

- Theme hydration is applied early to reduce incorrect light/dark flashes.
- Chart interactions use shared tooltip and motion helpers for consistency.
- Transaction filtering and sorting are derived instead of redundantly stored.
- Search input in the transactions page is debounced to avoid unnecessary re-filtering during typing.

## Current Scope

- Frontend-only application
- Mock seeded transaction data
- Local persistence via browser storage
- INR-style currency formatting

## License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.
