# unPhased — Phase → Mode Mapping (Phase 1 MVP)

## Overview

In Phase 1, **mode is derived deterministically from cycle phase**.

- **Phase** = biological state calculated from cycle data.
- **Mode** = behavioral guidance framing used to shape daily recommendations.

Mode is computed dynamically during the `/today` request and is not stored in the database.

---

## Phase → Mode Mapping

| Phase       | Mode     | Description                                  |
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

Note: Effort levels reflect executive function demand, 
not just physical exertion. For ADHD users, task initiation 
and transition costs are factored into effort classification.

### Filtering Rules

When generating daily suggestions, **both conditions must be met**:

1. `effort_level` is within the allowed set for the current mode
2. `phase_tag` matches the current phase OR `phase_tag` is NULL

A suggestion must pass both filters to be included.

---

## Low Energy Override

If the user activates the "Low energy day?" toggle on the Today screen:

- Allowed effort levels are capped at **low only**, regardless of current phase or mode.
- Phase-tagged suggestions are still included if they match the current phase and are low effort.
- NULL phase_tag suggestions are included if they are low effort.

This override only works downward. Users cannot override upward beyond their phase default.

### Logic Summary
```
if low_energy_override:
    allowed_effort = ['low']
else:
    allowed_effort = default for current mode
```

---

## Design Rationale

- Mode is not persisted because it:
  - Changes daily
  - Is derived from phase
  - Can be modified by the low energy override

- Separating **phase** (biological state) from **mode** (behavioral interpretation) allows:
  - Flexible UX messaging
  - Downward energy overrides without changing phase data
  - Clear separation of data layer vs. logic layer

---

## Future Extensions (Not in Phase 1)

- LLM-powered personalized suggestions