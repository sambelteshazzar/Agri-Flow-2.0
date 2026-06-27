# Agri-Flow 2.0

Smart farming management platform — a command center for monitoring fields, livestock, markets, and AI-powered agricultural intelligence.

## Features

- **Dashboard** — Real-time weather, task management, AI intelligence feed, system alerts
- **Crop Manager** — Crop plot CRUD, soil health tracking, AI crop image scanner for disease/nutrient diagnosis
- **Livestock Manager** — Herd management, health status, grazing type tracking, AI livestock image scanner
- **Market Analytics** — Interactive commodity price charts, input cost index, projected yield calculator
- **News Hub** — AI-powered real-time agricultural news with search grounding
- **AI Advisor** — Chat, image analysis, and live voice consultation with the Resilience Engine
- **Resource Calculator** — Fertilizer and irrigation calculators with crop-specific presets
- **Education Hub** — Learning modules with embedded video, progress tracking, and certificates
- **Community Hub** — Social feed, forum, marketplace, chat channels, and polls
- **Farm Labour** — Calculate the optimal work force of the farm
- **Voice Agent** — Floating voice button for hands-free navigation and queries
- **Settings** — Profile editing, dark/light theme, data export/import, factory reset

## Tech Stack

- **React 19** + **TypeScript** + **Vite 6**
- **Tailwind CSS** (CDN)
- **Google Gemini AI SDK** — text, vision, voice, search grounding
- **Recharts** — data visualization
- **Lucide React** — icons
- **localStorage** — client-side persistence (no backend required)

## Getting Started

### Prerequisites

- Node.js 18+

### Install

```bash
npm install
```

### Environment Setup

Create a `.env.local` file in the project root:

```
API_KEY=your_google_gemini_api_key
```

The app works without an API key — all AI features fall back to mock data. For full AI capabilities (chat, image scanning, voice, live news), a Gemini API key is required.

### Run

```bash
npm run dev
```

Opens on `http://localhost:3000`.

### Build

```bash
npm run build
npm run preview
```

## Project Structure

```
├── index.html              # Entry HTML, Tailwind CDN, fonts
├── index.tsx               # React entry point
├── App.tsx                 # App shell, routing, layout, auth
├── types.ts                # TypeScript interfaces & enums
├── constants.ts            # Seed data, defaults
├── components/
│   ├── GetStarted.tsx      # Landing page
│   ├── Dashboard.tsx       # Command center
│   ├── CropManager.tsx     # Crop management + AI scanner
│   ├── LivestockManager.tsx# Livestock management + AI scanner
│   ├── MarketAnalytics.tsx # Commodity charts & pricing
│   ├── NewsHub.tsx         # AI-powered news feed
│   ├── AIAdvisor.tsx       # AI chat, image & voice
│   ├── ResourceCalculator.tsx # Fertilizer & irrigation
│   ├── EducationHub.tsx    # Learning modules
│   ├── CommunityHub.tsx    # Social, forum, marketplace
│   ├── Farm Labour.tsx        # Work Force
│   ├── Settings.tsx        # Profile, theme, data
│   ├── Sidebar.tsx         # Navigation
│   ├── VoiceAgent.tsx      # Global voice agent
│   └── ErrorBoundary.tsx   # Error recovery
├── contexts/
│   └── FarmContext.tsx      # Central state management
├── services/
│   ├── persistence.ts      # localStorage abstraction
│   ├── cropService.ts      # Crop CRUD & yield calc
│   ├── livestockService.ts # Livestock CRUD
│   ├── marketService.ts    # Price simulation
│   ├── weatherService.ts   # Weather simulation
│   ├── communityService.ts # Social operations
│   ├── logService.ts       # Activity logs
│   └── geminiService.ts    # Gemini AI integration
```

## Browser Permissions

- **Camera** — crop/livestock image scanning
- **Microphone** — voice agent and AI voice calls
- **Geolocation** — location-based weather data

## Repository

[https://github.com/sambelteshazzar/Agri-Flow-2.0](https://github.com/sambelteshazzar/Agri-Flow-2.0)

##  TEAM
ATU DIPLOMA IN IT GROUP 8 MEMBERS(BERNICE, DONALD, CONFIDENCE, DANIEL, RICHMOND)

## License

All rights reserved.
