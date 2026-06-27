# AgriFlow Design System

> A curated design document for the AgriFlow smart-farming platform.
>
> **Author:** AgriFlow Developer  
> **Last Updated:** June 19, 2026

## Philosophy

AgriFlow's design philosophy is built on **"Rooted Intelligence, Growing Yields."** The interface balances professional data density with the warmth and approachability of a trusted farming companion. Dark mode remains the primary experience (reducing eye strain during early-morning and late-evening field checks), but every surface, label, and interaction speaks the language of agriculture — not terminals. The jade/terra/sunburst palette draws from West African agricultural landscapes: deep teal-green foliage, sage-green earth, and warm golden sunlight. The visual language communicates reliability, growth, and stewardship.

### Core Principles

1.  **Clarity Over Ceremony:** Information density is high, but presentation is clean and approachable. No monospace readouts, no uppercase shouting, no terminal metaphors.
2.  **Dark Mode First:** Deep, immersive dark theme (`jade-950` / `terra-900`) to reduce eye strain and let data pop — but jade and sunburst accents keep it grounded, not clinical.
3.  **Farming Language:** Labels, section names, and copy use agricultural vocabulary (Field, Harvest, Season, Growth) — never system/engineering terms (Module, Deploy, Terminal, Log).
4.  **Sentence Case:** Headers and labels use sentence case, not ALL CAPS. Only status badges and tiny meta-text may use uppercase for scannability.
5.  **Brand-Agnostic AI:** All AI-related UI is intentionally brand-agnostic ("Smart AI", "AI Advisor"), avoiding vendor lock-in.
6.  **Accessibility First:** WCAG 2.2 AA (4.5:1 contrast), 44dp touch targets, focus-visible rings, reduced-motion support, and three theme modes (light, dark, high-contrast).

## Color Palette

Three custom Tailwind palettes — **jade** (teal-green accent), **terra** (sage-green neutral), and **sunburst** (warm gold highlight) — replace the original soil/harvest/field scheme. A `slate-850` and `slate-950` are retained for legacy utility references.

### Jade (Teal-Green Accent)

The primary accent palette. Used for CTAs, active states, links, success indicators, and branding.

| Shade | Hex       | Usage                                    |
| ----- | --------- | ---------------------------------------- |
| 50    | `#EFFCF6` | Light background tint                   |
| 100   | `#D1F9E8` | Light surface, gradient stops            |
| 200   | `#A6F0D4` | Light accent, badges                     |
| 300   | `#6CE4BA` | Light-mode secondary accent              |
| 400   | `#38D19E` | Dark-mode primary accent                 |
| 500   | `#14B882` | Light-mode primary accent                |
| 600   | `#069669` | Hover states, emphasis                   |
| 700   | `#057855` | Light-mode accent-green (`--accent-green`) |
| 800   | `#075E45` | Dark borders, deep accent                |
| 900   | `#084D3A` | Dark surfaces, deep accent               |
| 950   | `#032B21` | Darkest background, hero overlays        |

### Terra (Sage-Green Neutral)

The neutral surface palette, reharmonized from warm brown to sage-green to complement jade. Used for backgrounds, borders, and text.

| Shade | Hex       | Usage                                    |
| ----- | --------- | ---------------------------------------- |
| 50    | `#F4F9F6` | Light background alt                     |
| 100   | `#E4F0EA` | Light surface alt                         |
| 200   | `#C8DFD3` | Light borders, dividers                   |
| 300   | `#A0C4B2` | Muted text, secondary borders             |
| 400   | `#74A78E` | Dark-mode muted text                     |
| 500   | `#548D73` | Dark-mode secondary text                  |
| 600   | `#3E735D` | Dark borders, dividers                    |
| 700   | `#305A49` | Dark surfaces                             |
| 800   | `#264839` | Dark card borders                         |
| 900   | `#1A3428` | Darkest neutral, footer, deep surfaces    |

### Sunburst (Warm Gold Highlight)

Warm gold accent for warnings, highlights, premium features, and seasonal markers.

| Shade | Hex       | Usage                                    |
| ----- | --------- | ---------------------------------------- |
| 50    | `#FFFCEB` | Light gold tint                           |
| 100   | `#FFF7C2` | Light gold surface                        |
| 200   | `#FFEE85` | Light gold badge background              |
| 300   | `#FFE048` | Light highlight                          |
| 400   | `#FFCC11` | Dark-mode accent-gold (`--accent-gold`)  |
| 500   | `#F5B800` | Light-mode accent-gold (`--accent-gold`)  |
| 600   | `#CC9A00` | Gold hover, emphasis                      |
| 700   | `#997300` | Dark gold text                            |
| 800   | `#7A5C00` | Dark gold borders                         |
| 900   | `#5C4500` | Darkest gold, deep accent                 |

### CSS Custom Properties

| Token               | Light          | Dark           | High-Contrast   |
| ------------------- | -------------- | -------------- | --------------- |
| `--bg-app`          | `#EFFCF6`      | `#041A14`      | `#000000`       |
| `--bg-content`      | `#D1F9E8`      | `#072118`      | `#000000`       |
| `--bg-card`         | `#FFFFFF`      | `#0C2E23`      | `#111111`       |
| `--bg-card-inner`   | `#F0FDF8`      | `#103B2D`      | `#111111`       |
| `--accent-green`    | `#057855`      | `#38D19E`      | `#14FF82`       |
| `--accent-gold`     | `#F5B800`      | `#FFCC11`      | `#FFD700`       |

### Status Colors

| Status  | Light Bg / Text          | Dark Bg / Text            |
| ------- | ------------------------ | ------------------------- |
| Success | `jade-100` / `jade-800`  | `jade-900` / `jade-200`   |
| Warning | `sunburst-100` / `sunburst-800` | `sunburst-900` / `sunburst-200` |
| Error   | `red-100` / `red-800`    | `red-900` / `red-300`     |
| Info    | `blue-100` / `blue-800`  | `blue-900` / `blue-300`   |

## Typography

| Role           | Font Family                  | CSS Class        | Weights | Usage                                    |
| -------------- | ---------------------------- | ---------------- | ------- | ---------------------------------------- |
| **Display**    | DM Serif Display             | `font-display`   | 400     | Dashboard title only.                    |
| **Heading**    | IBM Plex Sans                | `font-heading`   | 600, 700| Section headers, card titles, page titles.|
| **Body**       | Inter                        | default          | 400, 500| General UI, labels, descriptions.        |
| **Data**       | System Monospace             | `font-mono`      | 400     | Timestamps, durations, data numbers only.|

> **Note:** `font-mono` is restricted to timestamps, durations, and numeric data displays. It is never used for headings, labels, or navigation text.

## Spacing & Layout

-   **Border Radius:** Cards use `rounded-xl` (12px). Buttons can be `rounded-full` or `rounded-lg` (8px). The landing page uses `rounded-3xl` for larger feature cards.
-   **Shadows:** Subtle and layered. `shadow-sm` for cards, `shadow-xl` for modals and floating elements.
-   **Padding:** Generous padding on the landing page (e.g., `py-32`, `px-6`). The app uses standard spacing (e.g., `p-6`, `p-8`).

## Component Patterns

### Login Page

A full-page login/signup form replacing the legacy AuthModal. Supports email/password login and account creation with country selection.

```jsx
<div className="min-h-screen bg-jade-50 dark:bg-jade-950">
  {/* Desktop: split layout with hero panel + form */}
  <div className="hidden lg:flex">
    {/* Hero panel: gradient bg, brand logo, feature list, stats */}
    <div className="w-[45%] bg-gradient-to-br from-jade-950 via-jade-900 to-terra-900" />
    {/* Form panel: inputs, submit, toggle between login/signup */}
    <div className="w-[55%] bg-white dark:bg-jade-900" />
  </div>
  {/* Mobile: stacked layout with brand header + form */}
</div>
```

- **Hero panel:** Jade-to-terra gradient with logo and stats
- **Inputs:** `bg-white dark:bg-jade-800/50`, `border-jade-300 dark:border-jade-700`, `rounded-xl`, `focus:border-jade-500 focus:ring-jade-500/20`
- **Submit button:** `bg-gradient-to-r from-jade-600 to-jade-500`, `shadow-lg shadow-jade-500/25`
- **Mode toggle:** Jade accent link switching between "Sign In" and "Create Account"
- **Footer:** Copyright strip with logo
- **Trim on submit**, not during typing — password fields must not strip during `onChange`

### Standard Card

```jsx
<div className="bg-white dark:bg-jade-900/50 border border-jade-200 dark:border-jade-800 rounded-xl p-6">
  <div className="flex justify-between items-center mb-4 pb-4 border-b border-jade-100 dark:border-jade-800">
    <h3 className="font-heading text-lg text-jade-900 dark:text-jade-100">Card Title</h3>
  </div>
  {/* Card Content */}
</div>
```

### Status Pills

Used for system status, online indicators, and category tags.

```jsx
// Online Status
<div className="flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-jade-50 dark:bg-jade-900/30 text-jade-700 dark:text-jade-400 border border-jade-200 dark:border-jade-800">
  <Wifi className="w-3 h-3 mr-2" /> Online
</div>

// Alert Badge
<span className="bg-sunburst-100 dark:bg-sunburst-900/30 text-sunburst-800 dark:text-sunburst-200 text-xs font-medium px-2.5 py-1 rounded-full">
  Active
</span>
```

### Toast Notifications

Global, non-intrusive notifications appearing in the top-right corner.

```jsx
// Success Toast
<div className="bg-jade-50/90 dark:bg-jade-900/90 border-jade-200 dark:border-jade-800 text-jade-800 dark:text-jade-100 ...">
  <CheckCircle className="w-5 h-5" />
  <p className="text-sm font-medium flex-1">Toast Message</p>
</div>
```

### Sidebar

Fixed left rail navigation with logo, icon+label nav items, and footer with logo and copyright.

```jsx
<aside className="fixed left-0 top-0 h-screen w-64 bg-jade-950 border-r border-jade-900">
  {/* Logo: <img src="/logo-AgriFlow.png" alt="AgriFlow" className="w-9 h-9 rounded-lg" /> */}
  {/* Nav items with Lucide icons */}
  {/* Footer: logo + "AgriFlow © 2026" */}
</aside>
```

### Footer Bar

App-wide footer below main content.

```jsx
<footer className="bg-jade-950 border-t border-jade-900 py-3 px-6">
  <img src="/logo-AgriFlow.png" alt="AgriFlow" className="w-6 h-6 rounded" />
  <span>AgriFlow 2.0 · © 2026</span>
</footer>
```

## Animation & Motion

-   **Fade In Up:** Standard entrance animation for content blocks.
    ```css
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
    ```
-   **Marquee (Landing Page):** Infinite horizontal scroll for the "Live Ticker" section.
    ```css
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee { animation: marquee 40s linear infinite; }
    ```
-   **Slow Zoom (Hero):** Subtle zoom on landing page background images.
    ```css
    @keyframes slow-zoom {
      0% { transform: scale(1.0); }
      100% { transform: scale(1.1); }
    }
    .animate-slow-zoom { animation: slow-zoom 20s ease-in-out infinite alternate; }
    ```
-   **Staggered Entrance:** Content blocks enter with incremental delay.
    ```css
    .animate-stagger-1 { animation: fade-in-up 0.5s ease-out 0.05s forwards; }
    .animate-stagger-2 { animation: fade-in-up 0.5s ease-out 0.1s forwards; }
    ```
-   **Float:** Gentle vertical bob for decorative elements.
    ```css
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    .animate-float { animation: float 6s ease-in-out infinite; }
    ```
-   **Reduced Motion:** All animations respect `@media (prefers-reduced-motion: reduce)`.

## Responsive Strategy

-   **Mobile-First Approach:** Fully functional on mobile with dedicated navigation overlay and responsive grids (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).
-   **Fluid Typography:** Large hero text scales from `text-6xl` (mobile) to `text-8xl` (desktop).
-   **Break Points:** Standard Tailwind breakpoints `md:` and `lg:` used consistently.

## Iconography

-   **Library:** Lucide React (`lucide-react`).
-   **Style:** Line icons. Stroke width `2px` (default).
-   **Usage:** Icons contextual for navigation, status, and actions. Color and size controlled by design system.
-   **Accessibility:** Icon-only buttons require `aria-label` on `<button>` + `aria-hidden="true"` on the icon.

## Brand Assets

-   **Logo:** `public/logo-AgriFlow.png` (1024x1024 PNG, ~996KB) — used in Sidebar, LoginPage, GetStarted, favicon, and footer bars.
-   **Meta theme-color:** `#057855` (jade-700)

## Palette Migration History

1. **Original:** soil (warm brown) / harvest (amber) / field (green)
2. **First swap:** soil → terra, harvest → sunburst, field → crimson
3. **Crimson rejected:** Red/crimson not professional enough for agricultural platform
4. **Final:** jade (teal-green `#057855`) chosen as primary accent; terra reharmonized from warm brown to sage-green to complement jade; sunburst (warm gold `#F5B800`) retained unchanged.
	modified:   components/CommunityHub.tsx
