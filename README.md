# UnPhased
**Daily Direction, Powered by Your Biology.**

UnPhased is a cycle-aware web app that helps neurodivergent women plan their day around capacity instead of pushing through it.

The app estimates the user’s current cycle phase, assigns a daily mode — Restore, Build, Peak, or Protect — and offers simple Mind, Body, and Rest suggestions that match the user’s energy level. Users can also log period start dates over time so the app can refine cycle predictions and support more personalized guidance.

The goal is not to maximize productivity.  
The goal is to make daily decisions feel lighter, more sustainable, and more aligned with the body.

🔗 **Live App**: [unphased.onrender.com](https://unphased.onrender.com)

> ⚠️ Hosted on Render's free tier — the app spins down after 15 minutes of inactivity. First load after idle may take ~30 seconds to wake up.

## The Problem
Most planning tools treat every day like it should have the same capacity. For people whose energy, focus, and recovery needs shift throughout the month, that can make planning feel frustrating or unrealistic.

Without guidance that accounts for those shifts, users may overcommit, ignore low-energy signals, or spend too much energy deciding what kind of day they are having.

UnPhased was built around a different idea: daily planning should adapt to the user, not the other way around.

## Solution Overview
UnPhased reduces decision fatigue by turning cycle data into one clear daily orientation.

The app:
- Estimates the user’s current cycle phase from a start date and cycle length
- Maps that phase to a daily mode: Restore, Build, Peak, or Protect
- Suggests aligned Mind, Body, and Rest activities
- Offers a Low Energy Mode for gentler recommendations
- Uses logged period history to refine predictions over time

UnPhased is designed around sustainable alignment, not productivity maximization.

## Features
- **Daily Guidance** — a clear daily orientation based on the user’s estimated cycle phase. Providing suggestions across Mind, Body, and Rest categories
- **Low Energy Mode** — capacity-aware filtering that swaps high-effort suggestions for gentler alternatives
- **Period Tracking** — lets users log period start dates to improve prediction accuracy
- **Prediction Refinement** — calculates rolling-average cycle length and suggests updates when patterns shift
- **User Accounts** — session-based authentication with argon2id password hashing
- **Progressive Web App** — installable on mobile devices with offline-aware service worker support

## Tech Stack
**Frontend**: Vanilla JavaScript (ES modules), CSS3 with custom properties, Bootstrap (form components), PWA (manifest + service worker)
**Backend**: Node.js, Express, argon2id (password hashing), express-session with Postgres-backed store (`connect-pg-simple`)
**Database**: PostgreSQL
**Deployment**: Render (web service + managed Postgres)

## Architecture
UnPhased follows a single-server architecture where Express serves both the JSON API and the static frontend assets.

### Frontend
- Single-container rendering pattern: each screen exports a `render()` function that injects HTML into a shared `#content` div
- Dual-cache system in `api.js` for default and low-energy suggestion states
- Phase-specific styling via dynamic mode classes on `document.body`
- localStorage retained for device-level preferences only (low energy toggle, daily picked suggestion IDs)

### Backend
- REST API with session-based authentication and route protection middleware
- Phase calculation engine using proportional boundary scaling (not fixed-day cutoffs)
- Hash-based pseudo-randomization for daily-consistent suggestion ordering
- Postgres-backed session store for persistence across container restarts
- Cycle profile and period logs scoped to authenticated users

### Database
- `users`, `cycle_profiles`, `cycle_logs`, `suggestions`, and `session` tables
- Parameterized suggestion filtering using PostgreSQL's `ANY()` operator

## Project Structure
```
unphased/
├── backend/
│   ├── utils/
│   │   └── cycleUtils.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── css/
│   │   └── styles.css
│   ├── icons/
│   ├── images/
│   ├── js/
│   │   ├── screens/
│   │   ├── api.js
│   │   ├── app.js
│   │   └── phaseBlurbs.js
│   ├── index.html
│   ├── manifest.json
│   └── sw.js
├── database/
│   ├── schema.sql
│   └── seed.sql
├── docs/
│   ├── architecture/
│   ├── schema/
│   ├── wireframes/
│   ├── design-overview.md
│   └── mode-mapping.md
├── api-tests/
├── CHANGELOG.md
├── LICENSE
└── README.md
```

## Getting Started (Local Development)

### Prerequisites
You'll need Node.js (v18+) and PostgreSQL (v14+) installed. (`npm` comes bundled with Node — no separate install needed.)

**macOS (using Homebrew):**
```bash
# Node.js
brew install node

# PostgreSQL
brew install postgresql@16
```

**Other platforms:**
- Node.js — [download installer](https://nodejs.org/)
- PostgreSQL — [download installer](https://www.postgresql.org/download/)

Verify both are installed:
```bash
node --version
psql --version
```

### Setup

1. Clone the repository:
```bash
   git clone https://github.com/[your-username]/unphased.git
   cd unphased
```

2. Install backend dependencies:
```bash
   cd backend
   npm install
```

3. Start PostgreSQL (macOS with Homebrew):
```bash
   brew services start postgresql@16
```
   On other systems, follow your installation method's instructions for starting the service.

4. Create a local database:
```bash
   createdb unphased
```

5. Create a `.env` file in `backend/` with:
```
   DATABASE_URL=postgresql://localhost:5432/unphased
   SESSION_SECRET=your-random-secret-here
```
   Generate a secret with:
```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

6. Load schema and seed data from the project root:
```bash
   psql "$DATABASE_URL" -f database/schema.sql
   psql "$DATABASE_URL" -f database/seed.sql
```

7. Start the server:
```bash
   cd backend
   node server.js
```

8. Open `http://localhost:3000` in your browser.

## Design Overview
See [Design Overview](./docs/design-overview.md) for primary design artifacts.

## Project Status
**Current**: Final capstone version deployed to Render with authentication, period tracking, cycle prediction refinement, and PWA support.

## Roadmap
**Phase 6 (post-capstone)**:
- React refactor for portfolio polish
- AWS migration (Elastic Beanstalk, RDS, S3 + CloudFront)
- LLM-powered personalized suggestions
- Daily intention list (3 items max, ephemeral)

## License
This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
