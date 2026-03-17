# Changelog

All notable changes to UnPhased will be documented here.

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