# FocusTube

FocusTube is a local-first YouTube learning workspace for distraction-free playback, timestamped notes, and spaced review.



## What Is Actually Deployed
- A Next.js App Router frontend (`app/`) running on Vercel.
- YouTube metadata requests are proxied through Next.js route handlers.
- User data (notes, review state, playlist metadata) is stored in browser LocalStorage.

## Real Stack
- Framework: Next.js 16 + React 19 + TypeScript
- Styling/UI: Tailwind CSS + Radix UI primitives
- Database: None (no server-side database in production)
- Authentication: None (no user accounts or login flow)
- External API: YouTube Data API v3 (server-side proxy routes)

## Run Locally
```bash
cd app
npm install
```

Create `app/.env.local`:
```env
YOUTUBE_API_KEY=your_youtube_api_key
```

Start:
```bash
npm run dev
```

## Lessons Learned
- Vercel deployment initially broke when YouTube API calls were attempted from the client. That exposed key-handling risk and caused CORS-related failures. I fixed it by moving API access into server route handlers and using server-only env vars.
- The hybrid backend approach was abandoned because it increased operational complexity (extra deployment surface, extra config, slower iteration) without improving the core learning workflow for this MVP.
- If I started over, I would still ship local-first first, but I would design a clear migration path from day one for accounts, sync, and conflict handling so the jump to multi-device support is smoother.

## Engineering Decisions

### 1) Session Security Model (archived hybrid experiment)
- **Decision:** Use server-managed sessions with HTTP-only cookies instead of JWTs stored in browser-accessible storage.
- **Alternatives considered:** JWT access tokens in localStorage/sessionStorage, or JWT-in-cookie with stateless auth.
- **Why this won:** HTTP-only cookies reduce XSS blast radius because JavaScript cannot read the session token directly; for the server-rendered/hybrid flow this was the safer default.
- **Tradeoff:** Added server-side session state and CSRF considerations; less horizontally simple than fully stateless JWT auth.

### 2) Deployment Target
- **Decision:** Deploy the TypeScript/Next.js app as production (`vextube.vercel.app`) and archive the hybrid stack.
- **Alternatives considered:** Ship the Ruby + Next.js hybrid on Vercel as the primary production path.
- **Why this won:** The Next.js-only deployment was more reliable on Vercel, avoided extra cold-start/runtime coordination, and cut configuration/operational complexity.
- **Tradeoff:** No server-backed user model in production (no accounts/sync), so functionality is intentionally local-first.

### 3) Spaced Repetition Algorithm
- **Decision:** Use SM-2 style scheduling for review timing.
- **Alternatives considered:** More complex modern schedulers (FSRS variants), custom tuning, or ML-personalized ranking.
- **Why this won:** SM-2 is simple, well-understood, and easy to reason about/debug for an MVP; it delivered predictable behavior without introducing model complexity.
- **Tradeoff:** Scheduling is less adaptive than newer data-driven approaches and may be suboptimal for edge learning patterns.

### 4) Data Layer / ORM
- **Decision:** No ORM in the deployed app because there is no server-side database; in archived backend experiments, Sequel was used.
- **Alternatives considered:** Add a production DB + ORM now (Prisma/Drizzle/Sequelize in TS stack), or use lower-level SQL access in Ruby.
- **Why this won:** For the deployed product, localStorage removed backend persistence complexity entirely. In experiments, Sequel provided a lightweight Ruby ORM with straightforward SQL control and good fit for SQLite/libSQL prototyping.
- **Tradeoff:** Deployed app sacrifices cross-device durability/query power; experimental ORM path added backend maintenance overhead not justified for the MVP timeline.

## Known Limitations
- This is MVP-quality for personal/local usage, not production-grade collaboration software.
- No auth, no multi-device sync, no shared/team features.
- "Cloud sync" is not implemented in the deployed app; all state is local browser storage only.
- LocalStorage capacity and browser clearing can cause data loss; there is no automated backup.
- Some roadmap ideas in the UI/docs are aspirational and not fully implemented end-to-end yet.

## Experiments (Archived)
I explored Ruby/Sinatra and a hybrid stack. Those experiments are archived in `experiments/` with their own README.
