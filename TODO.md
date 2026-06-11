# AgriFlow Project / TODO

## Immediate Tasks (Landing Page Cleanup)
- [x] Remove all Gemini references from `GetStarted.tsx` landing page.
- [x] "Gemini AI Integrated" badge status pill text adjusted.
- [x] "Gemini AI" feature card title and text replaced with "Smart AI Advisor" and generic description.
- [x] "Gemini 3.0 Pro model" references in Architecture section updated.
- [x] "Gemini-3-Flash" in tech specs replaced.
- [x] All Gemini references in `AIAdvisor.tsx` and `LivestockManager.tsx` replaced.

## In Progress
- [ ] Run a quick validation of the landing page visuals (colors, spacing, text).

## Honest Improvement Ideas (Backlog)

### 1. Data Visualization Upgrade (High Impact)
- **Current:** `recharts` is imported but could be pushed much further.
- **Idea:** Create a dedicated, live dashboard. Add interactive charts for soil moisture over time, real-time weather data from your `WeatherService`, and historical yield trends.
- **Why:** For a "final year project", a truly interactive, data-rich dashboard is much more impressive. It demonstrates you understand state management, async data fetching, and complex UI libraries.

### 2. Real Database Integration (High Impact)
- **Current:** Everything is stored in `localStorage`.
- **Idea:** Add a backend using **Firebase**, **Supabase**, or a simple **Node.js/Express + MongoDB** setup.
- **Why:** This transforms the project from a static frontend prototype into a full-stack application. It's a massive step up for a final year project.

### 3. Multi-Model AI Abstraction (Medium Impact)
- **Current:** Hard-coded to Google GenAI.
- **Idea:** Create a factory or adapter pattern for AI models. Allow the user to choose between providers (e.g., "Use Google", "Use OpenAI (Demo)") in the UI, even if it falls back to the same mock data for one of them.
- **Why:** It shows architectural thinking, software design patterns (Strategy/Adapter), and makes the project more robust. It also justifies your decision to remove brand names like "Gemini".

### 4. Offline Support (Medium Impact)
- **Current:** `localStorage` works offline, but the app doesn't feel like a true PWA.
- **Idea:** Add a `ServiceWorker` for offline caching. Add a proper `manifest.json` for PWA features.
- **Why:** It aligns with the idea of farmers using this in rural, low-connectivity areas and demonstrates modern web capabilities.

### 5. Accessibility (Medium Impact)
- **Current:** Basic ARIA roles are used, but the color contrast for "High" risk in dark mode (`#f97316` on `#0f172a`) might fail WCAG AA.
- **Idea:** Run an audit with tools like Lighthouse or WAVE. Dark mode yellow/orange text on dark backgrounds is notorious for low contrast.
- **Why:** It shows professional-level attention to detail and inclusivity.

### 6. Voice Agent Enhancement (High Novelty)
- **Current:** A cool feature tied to Gemini Live.
- **Idea:** Make the voice agent "smarter" by giving it more `tools` (function calling) to interact with the app, not just the dashboard. It could say "Weather looks bad, shall I show you the weather tab?" and then navigate.
- **Why:** This is a "wow" factor feature that stands out. It shows deep integration of AI into the UI.

### 7. Testing (High Professionalism)
- **Current:** Zero tests.
- **Idea:** Add **Vitest** (works perfectly with Vite) and **React Testing Library**. Write unit tests for `CropService.calculateProjectedYield` and the `FarmContext` logic.
- **Why:** Every professional project needs tests. It demonstrates you know about software quality and maintainability.

## Backlog (Nice to Haves)
- [ ] Add a proper `manifest.json` and ServiceWorker.
- [ ] Internationalization (i18n) support for multi-language farmers.
- [ ] Simple animations for the dashboard (e.g., numbers counting up).
- [ ] More robust error handling UI (not just `console.error`).
