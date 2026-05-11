# Changelog

All notable changes to UnPhased will be documented here.

## 2026-05-10 | Phase 5: Final Wrap-up

### Added
- Render deployment of the vanilla JS version with managed PostgreSQL
- Postgres-backed session store using `connect-pg-simple` (replaces default MemoryStore)
- `trust proxy` setting for HTTPS behind Render's reverse proxy
- Conditional `secure` cookie attribute (HTTPS-only in production)
- LICENSE (MIT)
- Live URL in README

### Changed
- README rewritten to reflect final app state, features, tech stack, and setup instructions
- Port reads from `process.env.PORT` (falls back to 3000 locally)

### Removed
- Cookie test artifacts (`cookies-*.txt`) from repo; added gitignore pattern


## 2026-05-10 | Phase 4 Cap: Cycle Length Insight

### Added
- Average cycle length calculated in `/daily-guidance` from period start gaps when 3+ logs exist
- Cycle length insight banner on Today displaying current average and logged period count (informational only — no effect on mode, phase, or profile)


## 2026-05-09 | Phase 4: Period Tracker

### Added
- `cycle_logs` table with `(user_id, period_start_date)` unique constraint
- `POST`, `GET`, `PATCH`, `DELETE /cycle-logs` endpoints with user ownership verification
- Period Tracker screen with form for logging periods and list view of past entries
- Edit mode reusing the tracker form (cancel button + refresh after save)
- Delete behavior via event delegation on the logs container
- Period tracker entry button on Today header
- Onboarding `cycleStartDate` seeded into `cycle_logs` so the first period is part of history
- Cached daily guidance cleared after period logs are added, edited, or deleted

### Changed
- `/daily-guidance` uses the most recent `cycle_logs.period_start_date` as the active cycle start; falls back to `cycle_profiles.cycle_start_date` if no logs exist
- POST validation: future dates and duplicates blocked (409 on duplicates); removed hard lower bound on `cycle_start_date` so users can correct onboarding dates or backfill history
- PATCH supports partial updates via `COALESCE` to preserve unchanged fields
- Period Tracker uses neutral styling to avoid inheriting stale cycle mode colors

### Fixed
- Service worker caching stale `api.js` during development (resolved by clearing/unregistering cache)
- Date-only string comparison for edit validation, avoiding timezone shifts when editing the seeded onboarding log


## 2026-04-29 | Phase 3: Auth Frontend Integration

### Added
- Login screen wired to `POST /login` with success/error handling
- Register screen mirroring login's structure, wired to `POST /register`
- `GET /me` endpoint reporting authentication and cycle profile state (200 in all cases)
- Auth-aware app load: `routeAfterAuth` in `app.js` routes to login, onboarding, or Today based on `/me` response
- `onComplete` callback pattern decoupling screen rendering from routing logic
- Logout button on Today header — clears session, in-memory cache, and device-level localStorage (low energy toggle, `todayPickedIds`)
- Fetch wrapper catching 401 on protected routes and routing user back to login with session-expired message
- `postLogin`, `postRegister`, `postLogout`, `getMe` in `api.js`, all with `credentials: "include"`

### Changed
- md5 suggestion ordering seed now factors `userId` (`todayKey || userId || id`) so users with the same cycle profile get different suggestion ordering
- Cycle profile moved from localStorage to database, scoped per authenticated user
- localStorage retained for device-level preferences only

### Fixed
- `/me` returns 200 for unauthenticated (was 401), 500 only for genuine server errors
- Missing `req.session.save()` in `/register` that prevented authentication on the next request after signup
- Backend 401 returning HTML instead of JSON on protected routes


## 2026-04-22 | Auth Integration

### Added
- Session-based authentication with express-session
- `users` table with argon2id password hashing
- `POST /register`, `POST /login`, `POST /logout` endpoints
- `requireAuth` middleware protecting `/cycle-profile` and `/daily-guidance`
- `user_id` foreign key on `cycle_profiles` scoping data per user

### Changed
- `getCycleDay` now accepts `cycleLengthDays` and wraps past cycle length via modulo
- `GET /daily-guidance` filters profile by authenticated user instead of pulling most recent

### Removed
- `period_length_days` column and references (deferred to tracker phase)
- bcrypt dependency (replaced with argon2)


## 2026-04-13 | Phase 2: Frontend Polish  

### Added
- Mode-based visual theming with gradient backgrounds per phase
- CSS variables for mode accent colors and UI surfaces
- Moon icon per phase on Today screen header
- Frosted glass effect on suggestion cards and energy toggle
- Active tab highlighting with mode-colored background
- Onboarding gradient using full cycle color palette
- iOS safe area handling for bottom navigation
- Backdrop blur effect on bottom nav
- PWA support with manifest.json and service worker
- App icons for home screen installation

### Changed
- Moved gradient backgrounds from #app to body for full viewport coverage
- Updated energy toggle to match mode accent color
- Refined gradients for Build (spring sunrise) and Protect (lavender dusk)


## 2026-03-26 | Phase 2: Frontend

### Added
- Mind tab screen with filtered suggestions and phase blurb
- Body tab screen with Nourish and Move sections
- Rest tab screen with recovery suggestions
- Shared phaseBlurbs.js with phase-aware descriptions for all tabs
- todayPickedIds exclusion to prevent duplicate suggestions across tabs


## 2026-03-26 | Phase 2: Frontend 

### Added
- Low energy toggle with daily auto-reset via localStorage
- Dual cache system for default and low energy suggestion responses
- Today screen suggestion tracking for tab deduplication
- fetchDailyGuidance, isLowEnergy, and setLowEnergy functions in api.js


## 2026-03-25 | Phase 2: Frontend 

### Changed
- Added date-based pseudorandom ordering for daily suggestions in `/today`
- Normalized `today` to local midnight using `new Date()` and `setHours(0, 0, 0, 0)` before generating the daily hash key
- Simplified the hash input by removing date separators from the date key

### Fixed
- Removed the backend query `LIMIT` so `/today` can return enough suggestions to support all three categories

## 2026-03-24 | Phase 2: Frontend 

### Added
- Today screen with daily guidance, mode/phase display, and filtered suggestions rendering
- fetchDailyGuidance function in api.js
- Centralized API base URL in api.js

### Changed
- Moved postCycleProfile from onboarding.js to api.js
- Removed app-header from index.html (each screen owns its header)
- Updated Bootstrap CDN to matching versions
- Added nested try/catch for localStorage in onboarding


## 2026-03-23 | Phase 2: Frontend 

### Added 
- Built onboarding screen for the Unphased MVP
- Added onboarding form inputs for cycle start date and cycle length
- Added basic onboarding styling and logo placement
- Added client-side validation for onboarding input
- Connected onboarding form submission to the backend
- Saved returned cycle profile data to localStorage
- Added transition from onboarding to Today screen after successful setup

### Changed
- Updated backend cycle profile handling and validation
- Kept onboarding limited to cycle start date and cycle length for MVP scope

### Fixed
- Resolved local development issues with onboarding POST requests across separate frontend/backend origins


## 2026-03-17 | Phase 2: Frontend Setup

### Added
- Frontend project structure with module-based architecture
- Tab navigation with view switching (Today, Mind, Body, Rest)
- Placeholder render functions for all screens
- index.html with Bootstrap CDN


## 2026-03-17 | Phase 1: MVP Backend 

### Added
- Low energy override flag on /today endpoint
- Category column on suggestions table (mind, move, rest, nourish)
- Expanded seed data to 50 suggestions across all phases and categories
- Executive function note added to effort level documentation


## 2026-03-10 | Phase 1: MVP Backend + Design
### Added
- UI wireframes for onboarding, Today, Mind, Body, and Rest screens
- Real example suggestions and rationale copy in wireframes
- Energy input (optional) on Today screen
- Calendar popup concept for predicted cycle dates

### Changed
- Organized docs into architecture, schema, and wireframes subfolders
- Updated design overview with new file paths and wireframe links


## 2026-03-05 | Phase 1: MVP Backend
### Added
- Cycle day calculation using start date and today's date
- Proportional phase mapping scaled to user's cycle length
- Mode mapping from phase to daily guidance mode (Restore, Build, Peak, Protect)
- `getDailyGuidance` utility function wiring all three together
- Wired cycle logic into `/today` endpoint replacing all placeholders


## 2026-03-01 | Phase 1: MVP Backend | Phase 0: Setup
### Added
- Express server with health endpoint
- Placeholder `/today` endpoint
- README with project details and structure
- GitHub issue template for tasks
- gitignore for macOS files
- PostgreSQL connection to backend
- Phase 1 relational schema (cycle_profiles, suggestions)
- Seed data for Phase 1 tables
- `/today` endpoint upgraded to fetch real data from database
- `/cycle-profile` POST endpoint (stub)
- Phase 1 design overview and mode mapping documentation
- Architecture diagrams and schema diagram
- Bruno API collection for endpoint testing

### Changed
- API folder renamed to api-tests for clarity


## 2026-02-26 | Phase 0: Project Setup
### Added
- Initial commit