# AgriFlow Design System

> A curated design document for the AgriFlow smart-farming platform.
>
> **Author:** AgriFlow Developer  
> **Last Updated:** June 9, 2026

## Philosophy

AgriFlow's design philosophy is built on the idea of **"Technical Authority meets Organic Growth."** The interface is dark, data-dense, and precise, inspired by high-end engineering dashboards (Tesla, SpaceX) and modern terminal aesthetics. The visual language communicates reliability, intelligence, and a forward-looking perspective on agriculture.

### Core Principles

1.  **Data is King:** Information density is high. Every pixel should convey value.
2.  **Dark Mode First:** The primary aesthetic is a deep, immersive dark theme (`slate-950`) to reduce eye strain and make data pop.
3.  **Cinematic Immersion:** The landing page (`GetStarted.tsx`) features a cinematic, scroll-driven narrative with parallax, large typography, and subtle interactive glows.
4.  **Brand-Agnostic AI:** All AI-related UI is intentionally brand-agnostic ("Smart AI", "AI Advisor"), avoiding vendor lock-in (e.g., no "Gemini" or "GPT" branding visible in the UI).

## Color Palette

| Token / Usage              | Value (Light)          | Value (Dark)            | Notes                                                                      |
| -------------------------- | ---------------------- | ----------------------- | -------------------------------------------------------------------------- |
| **Background (App)**       | `#FDFCF8`              | `#020617`               | `slate-950` for dark, `stone-50` for light.                                |
| **Surface (Cards)**        | `#ffffff`              | `#0f172a`               | `white` and `slate-900`.                                                   |
| **Border (Subtle)**        | `#e2e8f0`              | `#1e293b`               | `slate-200` and `slate-800`.                                               |
| **Primary (Green)**        | `#22c55e`              | `#4ade80`               | `green-500` and `green-400`. Used for primary actions, success, and branding. |
| **Accent (Yellow)**        | `#facc15`              | `#fde047`               | `yellow-400` and `yellow-300`. Used for highlighting important features.  |
| **Text (Primary)**         | `#0f172a`              | `#f8fafc`               | `slate-900` and `slate-50`.                                                |
| **Text (Secondary)**       | `#64748b`              | `#94a3b8`               | `slate-500` and `slate-400`.                                               |
| **Status (Success)**       | `#dcfce7` / `#166534`  | `#14532d` / `#86efac`   | `green-100` / `green-800`.                                                 |
| **Status (Warning)**       | `#fef9c3` / `#854d0e`  | `#422006` / `#fde047`   | `yellow-100` / `yellow-800`.                                             |
| **Status (Error)**         | `#fee2e2` / `#991b1b`  | `#450a0a` / `#fca5a5`   | `red-100` / `red-800`.                                                     |
| **Info (Blue)**            | `#dbeafe` / `#1e3a8a`  | `#172554` / `#93c5fd`   | `blue-100` / `blue-800`.                                                   |

## Typography

| Role           | Font Family                 | Weights | Usage                               |
| -------------- | ----------------------------- | ------- | ----------------------------------- |
| **Display**    | `font-heading` (IBM Plex Sans)| 700, 900| Page titles, hero text, brand name. |
| **Body**       | `Inter`                       | 400, 500| General UI, labels, descriptions.   |
| **Monospace**  | `font-mono` (System Mono)     | 400     | Code blocks, technical specs, logs. |

## Spacing & Layout

-   **Border Radius:** Cards use `rounded-xl` (12px). Buttons can be `rounded-full` or `rounded-lg` (8px). The landing page uses `rounded-3xl` for larger feature cards.
-   **Shadows:** Subtle and layered. `shadow-sm` for cards, `shadow-xl` for modals and floating elements.
-   **Padding:** Generous padding on the landing page (e.g., `py-32`, `px-6`). The app uses standard spacing (e.g., `p-6`, `p-8`).

## Component Patterns

### The "Terminal" Card
A standard card with a dark background, a subtle border, and a header.
```jsx
<div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
  <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
    <span className="text-slate-400 font-mono text-xs">system_status.log</span>
    <div className="flex gap-2">
      <div className="w-3 h-3 rounded-full bg-red-500"></div>
      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
      <div className="w-3 h-3 rounded-full bg-green-500"></div>
    </div>
  </div>
  {/* Card Content */}
</div>
```

### Status Pills
Used for system status, online indicators, and category tags.
```jsx
// Online Status
<div className="flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
  <Wifi className="w-3 h-3 mr-2" /> Online
</div>

// Alert Badge
<span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-xs font-bold px-2.5 py-1 rounded-full">
  Active
</span>
```

### Toast Notifications
Global, non-intrusive notifications appearing in the top-right corner.
```jsx
// Success Toast
<div className="bg-green-50/90 dark:bg-green-900/90 border-green-200 dark:border-green-800 text-green-800 dark:text-green-100 ...">
  <CheckCircle className="w-5 h-5" />
  <p className="text-sm font-bold flex-1">Toast Message</p>
</div>
```

## Animation & Motion

-   **Fade In Up:** A standard entrance animation for content blocks as they scroll into view.
    ```css
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
    ```
-   **Marquee (Landing Page):** An infinite horizontal scroll for the "Live Ticker" section.
    ```css
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee { animation: marquee 40s linear infinite; }
    ```
-   **Slow Zoom (Hero):** A subtle zoom effect on the landing page's background image.
    ```css
    @keyframes slow-zoom {
      0% { transform: scale(1.1); }
      100% { transform: scale(1.2); }
    }
    .animate-slow-zoom { animation: slow-zoom 20s ease-in-out infinite alternate; }
    ```

## Responsive Strategy

-   **Mobile-First Approach:** The app is designed to be fully functional on mobile devices, with a dedicated mobile navigation overlay (`fixed` sidebar) and a responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).
-   **Fluid Typography:** Large hero text scales from `text-6xl` (mobile) to `text-8xl` (desktop).
-   **Break Points:** Standard Tailwind breakpoints `md:` and `lg:` are used consistently.

## Iconography

-   **Library:** Lucide React (`lucide-react`).
-   **Style:** Line icons. Stroke width is typically `2px` (default).
-   **Usage:** Icons are used contextually to represent navigation items, status indicators, and action buttons. Color and size are strictly controlled to match the design system.

## File Structure

```
ui-kit/
├── status-pills.tsx
├── toast-alerts.tsx
├── data-cards.tsx
├── input-fields.tsx
└── base-buttons.tsx
```

