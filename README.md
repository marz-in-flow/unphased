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
- Assigning a recommended daily "mode"  
- Filtering suggestions based on aligned effort levels  
- Delivering one clear daily mode to orient the user's day  

The goal is sustainable alignment, not productivity maximization.

## Architecture

UnPhased follows a client-server architecture:

### Frontend
- Vanilla JavaScript + Bootstrap  
- Progressive Web App (PWA)  
- localStorage for cycle profile persistence  
- Renders daily mode and aligned suggestions across four views: Today, Mind, Body, Rest  

### Backend
- Node.js + Express  
- REST API handling phase calculation and filtering logic  

### Database
- PostgreSQL  
- Stores suggestion data and cycle configuration  

## Core Backend Components

- Phase Calculation Engine  
- Mode Mapping Logic  
- Suggestion Filtering Algorithm  
- Low Energy Override  
- REST API endpoints returning structured JSON  

## Project Structure
```
unphased/
├── backend/
├── frontend/
├── database/
├── docs/
│   ├── architecture/
│   ├── schema/
│   └── wireframes/
├── api-tests/
├── CHANGELOG.md
└── README.md
```

## Getting Started (In Progress)

Backend setup and database integration complete. Frontend implementation in progress.

Setup instructions will be added as core components are finalized.

## Current Status

Phase 1 — Backend MVP functional. Suggestion filtering and frontend implementation in progress.

## Future Roadmap

- User authentication with persistent profiles
- LLM-powered personalized suggestions
- Daily intention list (3 items max, ephemeral)