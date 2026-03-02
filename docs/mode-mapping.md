# UnPhased — Phase → Mode Mapping (Phase 1 MVP)

## Overview

In Phase 1, **mode is derived deterministically from cycle phase**.

- **Phase** = biological state calculated from cycle data.
- **Mode** = behavioral guidance framing used to shape daily recommendations.

Mode is computed dynamically during the `/today` request and is not stored in the database.

---

## Phase → Mode Mapping

| Phase       | Mode     | Description                                 |
|------------|----------|----------------------------------------------|
| Menstrual  | Restore  | Lower energy. Prioritize rest and reset.     |
| Follicular | Build    | Increasing energy. Initiate and create.      |
| Ovulatory  | Peak     | High energy. Communicate and execute.        |
| Luteal     | Protect  | Declining energy. Reduce overload.           |

---

## Mode → Effort Filtering Logic (MVP)

| Mode    | Allowed Effort Levels |
|---------|-----------------------|
| Restore | low                   |
| Build   | low, medium           |
| Peak    | medium, high          |
| Protect | low, medium           |

### Filtering Rules

When generating daily suggestions:

1. Include suggestions where:
   - `effort_level` is within the allowed set for the current mode.

2. Additionally include suggestions where:
   - `phase_tag` is `NULL`  
   OR  
   - `phase_tag` matches the current phase.

---

## Design Rationale

- Mode is not persisted because it:
  - Changes daily
  - Is derived from phase
  - May later incorporate mood or energy inputs

- Separating **phase** (biological state) from **mode** (behavioral interpretation) allows:
  - Flexible UX messaging
  - Future overrides (e.g., low energy input during ovulatory phase)
  - Clear separation of data layer vs. logic layer

---

## Future Extensions (Not in Phase 1)

- Mood-based mode adjustment
- User-defined effort tolerance
- Adaptive filtering based on usage patterns