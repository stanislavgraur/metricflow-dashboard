# MetricFlow — B2B SaaS Analytics Dashboard

A production-grade analytics dashboard template for SaaS products — KPI tracking, revenue breakdowns, acquisition channels, and a live activity feed, all wrapped in a clean, data-dense "quiet luxury" dark UI with a full light-mode variant.

Built for founders and agencies who need a credible-looking admin/analytics screen without designing one from scratch: drop in your own data source and ship.

## Features

- **KPI stat grid** — animated sparkline cards for core metrics (revenue, MRR, active users, conversion rate) with trend badges
- **Revenue & acquisition block** — stacked bar chart (Weekly/Monthly toggle) plus a top-acquisition-channels breakdown with a detailed modal view
- **Recent activity table** — sortable transaction feed with a slide-over detail panel and receipt breakdown
- **Command palette (⌘K)** — global fuzzy search across metrics and transactions, full keyboard navigation
- **Date range control** — Last 7/30/90 Days and This Year, driving every chart and table on the page
- **Light / dark theme** — one-click toggle, built on CSS custom properties so every surface, border, and text color repaints consistently
- **Fully typed** — strict TypeScript throughout, zero `any`, mock data layer you can swap for a real API in minutes
- **Responsive layout** — down to mobile, built on a 12-column / 1440px design grid (see `DESIGN.md`)

## Tech Stack

| | |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language | TypeScript 5 (strict mode) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Charts | [Recharts](https://recharts.org) |
| Icons | [lucide-react](https://lucide.dev) |
| Fonts | [Geist Sans / Geist Mono](https://vercel.com/font) (self-hosted, no external requests) |

## Getting Started

Requires Node.js 20+ and npm (or yarn/pnpm/bun).

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Open the app
# http://localhost:3000
```

To build for production:

```bash
npm run build
npm run start
```

The build uses Turbopack by default (Next.js 16's stable, recommended bundler). If your environment needs the Webpack pipeline instead — e.g. an incompatible plugin or CI constraint — fall back with:

```bash
next build --webpack
```

## Project Structure

```
metricflow-dashboard/
├── app/
│   ├── layout.tsx        # Root layout, fonts, metadata
│   ├── page.tsx          # Dashboard page — composes all sections
│   └── globals.css       # Theme tokens (light/dark CSS variables) + Tailwind import
├── components/
│   ├── Header.tsx              # Top nav: logo, search, date range, theme toggle, profile menu
│   ├── KpiStatGrid.tsx         # KPI cards with sparklines
│   ├── RevenueAcquisitionBlock.tsx  # Revenue bar chart + acquisition channels
│   └── RecentActivityTable.tsx # Transactions table + detail slide-over
├── lib/
│   └── mock-data.ts      # Typed mock data generators (swap for your API)
├── DESIGN.md             # Full design-token spec (colors, spacing, typography)
└── public/               # Static assets
```

## Customizing the Theme

All colors are driven by CSS custom properties in `app/globals.css` — change a value once and it updates every component, in both light and dark mode:

```css
:root {
  --background: #0B0F17;
  --foreground: #F8FAFC;
  --surface: #1E293B;
  --border: #334155;
  --muted: #94A3B8;
}

.theme-light {
  --background: #F8FAFC;
  --foreground: #0F172A;
  --surface: #FFFFFF;
  --border: #CBD5E1;
  --muted: #64748B;
}
```

See `DESIGN.md` for the complete token reference, including chart accent colors, spacing, and typography scale.

## Connecting Real Data

Every section reads from `lib/mock-data.ts` through a small set of typed functions (`getKpiMetrics`, `getRevenueData`, `getAcquisitionChannels`, `getTransactions`). Replace their internals with API calls or a database query — the component props and types are already in place, so the UI doesn't need to change.

## License

This template is distributed under the license terms of the marketplace you purchased it from (UI8 / Lemon Squeezy). See your purchase receipt for the specific license grant (personal/commercial use, redistribution terms, etc.).

## Support

Questions about setup or customization? Reach out via your marketplace listing's support channel.
