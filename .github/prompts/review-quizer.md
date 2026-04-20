# UA Quiz — Project-Specific Review Overlay

Extends `review-base.md` with project-specific patterns.

## Context
- **Purpose**: Interactive quiz platform about Ukraine's 26 regions
- **Stack**: Next.js 14 (hybrid App + Pages Router), TypeScript, Tailwind CSS, Firebase Realtime DB, Anthropic Claude
- **Infrastructure**: Vercel deployment, Firebase for auth + data

## Critical rules

### Firebase data structure
- Region names are ALWAYS English keys matching `regions` array in `src/helpers/regionType.js`
- Never use translated/Ukrainian names as Firebase keys
- Always validate `snapshot.exists()` before calling `.val()`
- Never expose Firebase admin credentials — client SDK only

### AI API routes (`src/app/api/ai/`)
- Always validate and sanitize ALL input fields (truncate to safe lengths)
- Always check `ANTHROPIC_API_KEY` exists before creating client
- Always validate Content-Length header (body size limit)
- Always wrap JSON.parse of AI response in try/catch
- AI responses must be validated field-by-field — never trust AI output shape
- Model should be `claude-haiku-4-5-20251001` for cost efficiency
- Never embed API keys in client-side code

### Security patterns
- `next.config.js` security headers must include: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, CSP
- `poweredByHeader: false` — never expose framework version
- CSP must whitelist Firebase domains for `connect-src`
- API routes must not accept arbitrary URLs (SSRF risk)
- Never store sensitive data in `localStorage` (progress data is fine, tokens are NOT)

### Progress system (`src/lib/progress.ts`)
- All localStorage operations wrapped in try/catch
- `getProgress()` must return valid empty `UserProgress` if localStorage is empty/corrupted
- Badge conditions are pure functions — never side effects in `condition()`
- `recordQuizResult()` must update streak correctly (same-day vs consecutive-day logic)

### i18n (`src/lib/i18n.ts`)
- Translation keys use dot notation: `common.home`, `quiz.start`
- `t()` function must return the key itself as fallback (never throw)
- Both `uk.json` and `en.json` must have identical key structure
- Locale stored in `localStorage` (`uaquiz_locale`) — not in URL

### Component patterns
- MapUk is 8300+ lines of SVG — never modify inline, only add CSS overlays
- `"use client"` only where needed (event handlers, hooks, browser APIs)
- Use `clsx` for conditional Tailwind classes — not string template literals
- All Firebase reads should handle: loading state, empty state, error state

### Quiz data invariants
- `correctAnswer` is 1-indexed (1-4) in Firebase, matching `react-quiz-component`
- `answers` array always has exactly 4 elements
- `questionType` is always `"text"` (photo questions use `questionPic`)
- `point` field is a string (legacy — treat as number when calculating)
- `completeQuizCount` must be incremented atomically using Firebase `update()`

### Performance
- Never fetch all quizzes for all regions — always filter by `regionName`
- AI generation limited to max 10 questions per request
- OG image generation runs on Edge runtime — keep it lightweight
- Service worker skips `/api/` and Firebase requests (no caching those)

### GEO / AI Search readiness
- `public/llms.txt` must exist and describe the app
- `robots.ts` must allow AI bots: GPTBot, ClaudeBot, PerplexityBot, Google-Extended
- JSON-LD schema in root layout (`WebApplication` type)
- Dynamic `sitemap.ts` must include all 26 region pages
