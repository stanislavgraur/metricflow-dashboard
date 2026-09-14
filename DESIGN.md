# Design System Specification (`DESIGN.md`)
> Version 1.0.0 | Target Tool: Google Stitch & UI Generators  
> Primary Theme: Dark Mode B2B SaaS Analytics & Data Visualization

---

## 1. Global Context & Aesthetic Principles

* **Aesthetic:** Modern Minimalist Dark Mode ("Quiet Luxury" SaaS style).
* **Grid Baseline:** Desktop Web (1440px viewport), 12-column grid system with 24px gap.
* **Data Density:** High visual density with clear visual hierarchy, thin 1px borders, and high-contrast metrics.
* **Corner Radius Standard:** `12px` for main cards/containers, `8px` for buttons/inputs, `9999px` (Pill) for badges.

---

## 2. Color System & Design Tokens

### Base Surfaces
* `--bg-canvas`: `#0B0F17` (Main app workspace background)
* `--bg-surface`: `#1E293B` (Cards, panels, and modal containers)
* `--bg-surface-hover`: `#334155` (Hover states for tables and rows)
* `--border-subtle`: `#334155` (1px solid borders separating components)

### Typography Colors
* `--text-primary`: `#F8FAFC` (Headers, main metric numbers, table data)
* `--text-secondary`: `#94A3B8` (Labels, table headers, axis captions)
* `--text-muted`: `#64748B` (Disabled elements, gridlines, icons)

### Semantic & Chart Accents
* `--accent-primary`: `#6366F1` (Electric Indigo — primary bars, active tabs, main CTAs)
* `--accent-success`: `#10B981` (Emerald Green — positive trends, completed status, secondary bars)
* `--accent-warning`: `#F59E0B` (Amber — pending badges, secondary alerts)
* `--accent-danger`: `#EF4444` (Red — negative trends, failed actions)

---

## 3. Typography Hierarchy

* **Metric Display:** 32px / Semi-Bold (600) / Line Height 1.1 / Color: `#F8FAFC`
* **Section Heading:** 18px / Semi-Bold (600) / Line Height 1.3 / Color: `#F8FAFC`
* **Card Label:** 14px / Medium (500) / Color: `#94A3B8`
* **Table Header / Caption:** 12px / Medium (500) / Uppercase / Color: `#64748B`
* **Badge Text:** 12px / Bold (700) / Color: `--accent-success` or `--accent-primary`

---

## 4. Component Layout Specifications

### A. KPI Stat Cards
* **Structure:** Top row flex container (Label left, Trend Badge right) -> Metric Number -> Bottom full-width Sparkline.
* **Badge Style:** Fully rounded pill (`9999px`), 15% opacity background tint matching the trend color (`#10B981` + 15% alpha).
* **Sparkline Rules:** Smooth vector curve, 1.5px stroke width, strictly no axis/gridlines or text labels.

### B. Bar Charts (Monthly Revenue Breakdown)
* **Bar Radius:** `4px` top-left and top-right corners (`rounded-t-sm`).
* **Stacked Gap:** 1px vertical divider between stacked categories.
* **Gridlines:** Dashed horizontal lines (`#334155`, 1px stroke, 4px dash spacing). No vertical gridlines.
* **Hover Tooltip:** Floating dark card (`#0F172A`), 1px border (`#334155`), 8px radius, subtle drop-shadow.

### C. Horizontal Progress Bars (Acquisition Channels)
* **Bar Height:** `8px` or `10px` height with `9999px` full radius.
* **Background Track:** Dark container fill (`#0F172A`).
* **Fill Style:** Vibrant accent fill (`#6366F1`) matching channel identity.

### D. Recent Activity Data Table
* **Header Row:** 40px height, 1px bottom border, muted text.
* **Data Row:** 52px height, 1px bottom border (`#334155`), background hover state (`#334155` at 50% opacity).
* **Status Badges:** Compact pill badge (`Completed` = `#10B981` tint, `Pending` = `#6366F1` tint).

---

## 5. Google Stitch System Injection Snippet

Скопируйте этот блок в поле инструкции или в конец любого промпта Stitch:

```text
[SYSTEM DESIGN CONSTRAINTS]
Follow DESIGN.md strictly:
- Theme: Dark Mode (#0B0F17 canvas, #1E293B cards, #334155 1px borders, 12px card radius).
- Palette: Primary text #F8FAFC, Secondary text #94A3B8, Accents #6366F1 (Indigo) & #10B981 (Emerald).
- Typography: Clean sans-serif, 32px bold metrics, 14px card labels, 12px pill badges.
- Charts: Clean bar charts with rounded tops (4px), 1.5px sparklines on stat cards, subtle dashed gridlines.