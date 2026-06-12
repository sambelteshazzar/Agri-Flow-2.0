# AgriFlow Design System

> A curated design document for the AgriFlow smart-farming platform.
>
> **Author:** AgriFlow Developer  
> **Last Updated:** June 9, 2026

## Philosophy

AgriFlow's design philosophy is built on **"Rooted Intelligence, Growing Yields."** The interface balances professional data density with the warmth and approachability of a trusted farming companion. Dark mode remains the primary experience (reducing eye strain during early-morning and late-evening field checks), but every surface, label, and interaction speaks the language of agriculture — not terminals. The visual language communicates reliability, growth, and stewardship.

### Core Principles

1.  **Clarity Over Ceremony:** Information density is high, but presentation is clean and approachable. No monospace readouts, no uppercase shouting, no terminal metaphors.
2.  **Dark Mode First:** Deep, immersive dark theme (`slate-950`) to reduce eye strain and let data pop — but warm green and earth accents keep it grounded, not clinical.
3.  **Farming Language:** Labels, section names, and copy use agricultural vocabulary (Field, Harvest, Season, Growth) — never system/engineering terms (Module, Deploy, Terminal, Log).
4.  **Sentence Case:** Headers and labels use sentence case, not ALL CAPS. Only status badges and tiny meta-text may use uppercase for scannability.
5.  **Brand-Agnostic AI:** All AI-related UI is intentionally brand-agnostic ("Smart AI", "AI Advisor"), avoiding vendor lock-in.

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

### Auth Modal (Login / Sign Up)
A split-screen modal with branded hero panel on the left and form on the right. Supports both login and signup modes with a toggle.
```jsx
// Container: fixed overlay with backdrop blur
<div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-lg animate-fade-in">
  <div className="w-full max-w-5xl mx-4 rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 flex flex-col md:flex-row animate-fade-in-up">
    {/* Hero panel — gradient bg with dot grid, brand mark, feature list, stats (hidden on mobile) */}
    <div className="hidden md:flex md:w-[45%] relative overflow-hidden bg-gradient-to-br from-slate-950 via-green-950/80 to-slate-900 flex-col justify-between p-10">
      {/* Decorative blurs: green-500/10, yellow-500/10 */}
      {/* Dot grid overlay: opacity-[0.03] */}
      {/* Brand: gradient icon + heading + subtext */}
      {/* Features: icon list with colored icons */}
      {/* Stats: 2-col grid with numbers */}
    </div>
    {/* Form panel */}
    <div className="w-full md:w-[55%] bg-white dark:bg-slate-900 flex flex-col">
      {/* Header: title + subtitle + close button */}
      {/* Brand mark: rotated yellow gradient square with Leaf icon + green badge */}
      {/* Form: inputs with focus ring, password toggle, checkbox */}
      {/* Submit: gradient green button with shadow */}
      {/* Social buttons: Google + GitHub in 2-col grid */}
      {/* Toggle link */}
      {/* Footer brand strip */}
    </div>
  </div>
</div>
```
- **Hero panel:** Gradient background with decorative blur circles and subtle dot grid; feature icons (Zap, Shield, Droplets, TrendingUp) with colored accents; stats row
- **Inputs:** `pl-11` for left icon space, `bg-slate-50 dark:bg-slate-800/80`, `border-2 border-slate-200 dark:border-slate-700`, `rounded-xl`, `focus:border-green-500 focus:ring-4 focus:ring-green-500/10`
- **Submit button:** `bg-gradient-to-r from-green-600 to-green-500`, `shadow-lg shadow-green-500/25`, `rounded-xl`
- **Social buttons:** `bg-slate-50 dark:bg-slate-800`, `border-2 border-slate-200 dark:border-slate-700`, `rounded-xl`, 2-col grid
- **Mode toggle:** Green accent link (`text-green-600 dark:text-green-400`) switching between "Sign In" and "Create one"
- **Form titles:** "Welcome Back" (login) / "Create Account" (signup) — no "Access Terminal"
- **Form subtitles:** Professional tone — "Sign in to access your dashboard." / "Join thousands of farmers using AgriFlow."
- **Placeholders:** Clean & professional — "John Doe", "you@example.com", "Min. 8 characters"
- **Hero features:** 3 items with label + description (not 4 bare labels); items have `items-start` layout
- **Footer:** "Secured with 256-bit encryption" instead of decorative icon strip

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

