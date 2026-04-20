# CLAUDE.md — UA Quiz (Квізи України)

Interactive quiz platform about all 26 regions of Ukraine.
Users explore a clickable SVG map, take quizzes, get AI-powered explanations, track progress with badges, and compete on a leaderboard.

---

## Commands

```bash
npm run dev          # Start dev server (Next.js 14)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run check-types  # TypeScript type check
```

Required `.env` variables: see `.env.example`.
AI features require `ANTHROPIC_API_KEY`. Firebase vars are `NEXT_PUBLIC_` prefixed.

---

## Architecture

**Next.js 14** hybrid setup: App Router (`src/app/`) + Pages Router (`pages/`).
Firebase Realtime Database for quiz data and auth. Anthropic Claude for AI features.

### Routing

| Route               | Router | Purpose                              |
| -------------------- | ------ | ------------------------------------ |
| `/`                  | App    | Home — interactive SVG map           |
| `/progress`          | App    | User progress dashboard + badges     |
| `/leaderboard`       | App    | Global leaderboard                   |
| `/dashboard?data=X`  | Pages  | Region quiz list                     |
| `/quest/[id]?data=X` | Pages  | Individual quiz with AI explanations |
| `/builder`           | Pages  | Quiz creation wizard (auth required) |
| `/builder/settings`  | Pages  | User's quiz management               |
| `/auth/login`        | Pages  | Google OAuth login                   |

### API Routes (App Router — `src/app/api/`)

| Endpoint            | Method | Purpose                             |
| ------------------- | ------ | ----------------------------------- |
| `/api/ai/explain`   | POST   | AI explanation for quiz answer      |
| `/api/ai/generate`  | POST   | AI-generated quiz questions         |
| `/api/og`           | GET    | Dynamic OG image for sharing        |

### Key directories

```
src/
  app/                    # App Router pages + API routes
  components/
    MapUk/                # Interactive SVG map (8300+ lines)
    Quiz/                 # QuizTimer, AIExplanation, AIQuizGenerator, GameModeSelector
    Progress/             # ProgressDashboard
    Leaderboard/          # LeaderboardTable
    Share/                # ShareCard (social sharing)
    ui/                   # NavBar, LanguageToggle
    Auth/                 # AuthStateWrapper, Login
    Builder/              # Quiz builder (multi-step form)
    db/firebase.ts        # Firebase config
  hooks/                  # useProgress, useGameMode, useTranslation
  lib/                    # progress.ts, badges.ts, gameModes.ts, i18n.ts
  types/index.ts          # TypeScript types
  messages/               # uk.json, en.json (i18n)
  helpers/                # regionType, regionTranslate, functions
  layout/                 # PrimaryLayout, BuilderLayout, QuestLayout
pages/                    # Pages Router (dashboard, quest, builder, auth)
public/
  sw.js                   # Service worker (PWA)
  llms.txt                # AI crawler context
  .well-known/security.txt
  region-map/             # Region images (JPEG)
  geralds/                # Regional emblems (PNG)
```

---

## Critical rules

### 26 Ukrainian regions (always in English for Firebase keys)

`Crimea, Cherkasy, Chernihiv, Chernivtsi, Dnipropetrovsk, Donetsk, Ivano-Frankivsk, Kharkiv, Kherson, Khmelnytskyi, Kyiv, KyivCity, Kirovohrad, Luhansk, Lviv, Mykolaiv, Odessa, Poltava, Rivne, Sumu, Ternopil, Zakarpattia, Vinnytsia, Volyn, Zaporizhia, Zhytomyr`

### Firebase structure

```
regions/{regionName}/{quizId} → Quiz object
users/{userId} → User quizzes
leaderboard/{userId} → LeaderboardEntry
```

### Game modes

| Mode     | Hints | Timer         |
| -------- | ----- | ------------- |
| Learn    | Yes   | No            |
| Exam     | No    | 30s/question  |
| Marathon | Yes   | No (all Qs)   |

### Badge tiers

`bronze` → `silver` → `gold` → `platinum`

Region-specific badges require 90%+ accuracy. All badge conditions are defined in `src/lib/badges.ts`.

### Progress system

Stored in `localStorage` under `uaquiz_progress` key. Schema: `UserProgress` type from `src/types/index.ts`.

### AI API routes

- Input sanitization: all fields truncated to safe lengths
- Body size limits: 4KB for explain, 2KB for generate
- Model: `claude-haiku-4-5-20251001` (cheapest, fastest)
- Max questions per generation: 10
- Always validate AI JSON output before returning

### Security headers (next.config.js)

HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP, CSP.
`poweredByHeader: false`.

### SEO / GEO

- Dynamic OG images via `/api/og` (Edge runtime)
- JSON-LD `WebApplication` schema in root layout
- `sitemap.ts` — all regions + static pages
- `robots.ts` — allows AI bots (GPTBot, ClaudeBot, PerplexityBot)
- `public/llms.txt` — AI crawler context file

### i18n

Lightweight custom system (no next-intl). Translation files in `src/messages/{uk,en}.json`.
Locale stored in `localStorage` under `uaquiz_locale` key.
Use `useTranslation()` hook in components.

### PWA

`manifest.ts` generates manifest. `public/sw.js` service worker with stale-while-revalidate strategy.
Icons at `public/icons/icon-{192,512}.png` and `icon-maskable-512.png` (need to be created).

---

## Code style

- TypeScript strict mode (`strict: true`)
- Tailwind CSS utility-first + custom CSS in `globals.css` for map/builder
- Path aliases: `@/*` → `./src/*`
- Use `clsx` for conditional classes
- Never hardcode credentials — `.env` only
- All API routes validate Content-Type and body size
- Use `console.error` in catch blocks, never `console.log` in production

---

## Known issues / TODO

- [ ] PWA icons need to be created (192, 512, maskable-512 PNG)
- [ ] Quiz page (`pages/quest/[id].js`) needs AIExplanation integration (component exists, needs wiring)
- [ ] Leaderboard data population — runs `updateLeaderboard()` after quiz completion
- [ ] Dashboard page could show AI quiz generator for regions with no quizzes
- [ ] Consider migrating remaining Pages Router pages to App Router
