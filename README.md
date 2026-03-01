# UnPhased  
**Daily Direction, Powered by Your Biology.**

UnPhased is a cycle-aware daily decision support system designed to help neurodivergent women align effort with capacity and reduce burnout.

The system provides minimal-input daily guidance powered by biological rhythm modeling.

## The Problem

Fluctuating energy levels can make consistent productivity difficult. Without contextual guidance, this often leads to overextension, decision fatigue, and burnout.

Most planning tools assume static daily capacity and fail to account for biological rhythm shifts.

## Solution Overview

UnPhased reduces cognitive load by:

- Estimating biological phase from user input  
- Assigning a recommended daily “mode”  
- Filtering suggestions based on aligned effort levels  
- Delivering one clear daily direction  

The goal is sustainable alignment, not productivity maximization.

## Architecture

UnPhased follows a client-server architecture:

### Frontend
- React  
- Renders daily mode and aligned suggestions  

### Backend
- Node.js + Express  
- REST API handling phase calculation and filtering logic  

### Database
- PostgreSQL  
- Stores user inputs and suggestion data  

## Core Backend Components

- Phase Calculation Engine  
- Mode Mapping Logic  
- Suggestion Filtering Algorithm  
- REST API endpoints returning structured JSON  

## Project Structure (Planned)

```
unphased/
├── backend/
├── frontend/
├── database/
└── README.md
```

*(Structure subject to change as development progresses.)*

## Getting Started (In Progress)

Backend setup and architecture scaffolding currently in progress.

Setup instructions will be added as core components are implemented.

## Current Status

Phase 0 — Backend initialization and architectural planning.
