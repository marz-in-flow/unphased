# Changelog

All notable changes to UnPhased will be documented here.

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