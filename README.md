# WanderLux ✦ AI-Powered Travel Planning

> Discover breathtaking destinations, generate personalized day-by-day itineraries with Google Gemini AI, and explore the world with live weather data and curated photography.

![WanderLux Hero](https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80)

---

## Features

| Feature | Description |
|---|---|
| **Destination Explorer** | Browse 8+ curated destinations with search, category filters, and live photography from Unsplash/Pexels |
| **AI Trip Planner** | Powered by Google Gemini — generates structured, day-by-day JSON itineraries with activities, costs, tips, and packing lists |
| **Live Weather Widget** | Real-time weather via OpenWeatherMap with geolocation auto-detect and °C/°F toggle |
| **AI Travel Assistant** | Conversational chat drawer powered by Gemini for travel advice and questions |
| **Destination Detail Pages** | Auto-rotating photo galleries, quick facts, famous places, best time to visit, and a one-click "Plan My Trip" CTA |
| **Rich Fallbacks** | Works fully offline with curated mock data — no API keys required to demo |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Routing | React Router v6 |
| Styling | Tailwind CSS v4 (custom design tokens) |
| Animations | Framer Motion |
| Icons | Lucide React |
| AI | Google Gemini API (`@google/genai`) |
| Weather | OpenWeatherMap API |
| Photography | Unsplash API + Pexels API (fallback) |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/wanderlux.git
cd wanderlux

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and add your API keys (see below)

# 4. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your keys. **All APIs have generous free tiers.**

```env
# OpenWeatherMap — https://openweathermap.org/api
VITE_OPENWEATHER_API_KEY=your_key_here

# Unsplash — https://unsplash.com/developers
VITE_UNSPLASH_ACCESS_KEY=your_key_here

# Pexels (fallback images) — https://www.pexels.com/api/
VITE_PEXELS_API_KEY=your_key_here

# Google Gemini AI — https://ai.google.dev/
VITE_GEMINI_API_KEY=your_key_here
```

> **The app works 100% without API keys** — all features fall back to rich curated mock data so you can explore and demo the full UI immediately.

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore`. Only commit `.env.example`.

---

## Available Scripts

```bash
npm run dev      # Start local development server (hot reload)
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
npm run lint     # Run oxlint on src/
```

---

## Project Structure

```
wanderlux/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── chat/           # AI chat assistant drawer
│   │   ├── common/         # ErrorBoundary, shared UI
│   │   ├── explorer/       # Destination cards, search, skeletons
│   │   ├── hero/           # Fullscreen hero section with video
│   │   ├── itinerary/      # AI itinerary form, timeline, skeleton
│   │   ├── layout/         # Navbar, page layout
│   │   └── weather/        # Weather widget
│   ├── context/            # WeatherLocationContext
│   ├── data/               # Curated destinations data & fallbacks
│   ├── hooks/              # useDebounce
│   ├── pages/              # HomePage, ItineraryPage, DestinationDetailPage
│   ├── services/           # geminiService, weatherService, imageService
│   ├── App.jsx
│   ├── index.css           # Global design system (Tailwind + custom)
│   └── main.jsx
├── .env.example            # Environment variable template
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Design System

WanderLux uses a custom **Saffron Gold × Rose Crimson × Warm Obsidian** palette:

| Token | Value | Usage |
|---|---|---|
| `primary` | `#f59e00` (Saffron Gold) | Buttons, highlights, active states |
| `accent` | `#f83a4e` (Rose Crimson) | Gradient text, accents, CTAs |
| `dark-900` | `#0c0a08` (Warm Obsidian) | Page background |
| `dark-800` | `#141210` | Card surfaces |

Typography uses **Playfair Display** (display/headings) + **Inter** (body) + **JetBrains Mono** (code/time).

---

## Security

- **API keys** are managed via `.env` and prefixed with `VITE_` — they are bundled into the client build. For production, consider a backend proxy for sensitive API calls.
- **`.env` is excluded from Git** via `.gitignore`
- `console.log`, `console.warn`, and `console.debug` are **stripped from production builds** via Vite esbuild config
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) are set in `index.html` and `vite preview`
- No use of `dangerouslySetInnerHTML` or `eval` anywhere in the codebase
- Geolocation is only requested on user action (weather widget)

---

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

Add your environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Netlify

```bash
npm run build
# Drag the dist/ folder to netlify.com/drop
```

Or connect the GitHub repo and set build command to `npm run build`, publish directory to `dist`.

### Manual

```bash
npm run build
# Serve the dist/ folder with any static file server (nginx, Caddy, etc.)
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to your branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT © WanderLux

---

*Built with React, Vite, Tailwind CSS, Framer Motion, and Google Gemini AI.*
