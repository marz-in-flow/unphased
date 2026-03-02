# UnPhased — Design Overview (Phase 1 MVP)

This document outlines the primary design artifacts for the Phase 1 MVP.


## 1. System Architecture
[Architecture Diagram](./architecture-diagram.png)

Shows the client-server structure, backend API layer, business logic, and PostgreSQL database interaction.

## 2. Database Design
[Schema Diagram](./schema-diagram.png)

Relational schema for:
- cycle_profiles
- suggestions

## 3. Phase → Mode Mapping
[Mode Mapping Document](./mode-mapping.md)

Defines:
- Phase-to-mode mapping
- Mode-to-effort filtering logic
- Rationale for dynamic mode computation