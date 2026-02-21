---
title: "Sheett - Interactive Reactive Board"
publishedAt: "2026-02-01"
updatedAt: "2026-02-21"
tags: ["Expo", "React Native", "Tinybase", "Cloudflare", "Supabase", "Local-First"]
featured: true
public: true
slug: "interactive-reactive-board-sheett"
cover: "https://github.com/user-attachments/assets/78dffa3e-39ed-4a24-a9a2-48df09744f13"
status: "Building"
---

# Sheett: Interactive Reactive Board

> A local-first, real-time collaboration board where cells are interactive, stateful, and reactive instead of static data fields.

![Sheett board interface](https://github.com/user-attachments/assets/78dffa3e-39ed-4a24-a9a2-48df09744f13)

Sheett started as a question: **Why are spreadsheets still passive data containers in a world of real-time collaboration and automation?**

Traditional spreadsheets treat cells as static values. Collaboration happens around the data, not inside it. This works for calculations, but breaks down when spreadsheets are used for coordination, task assignment, event planning, or operational workflows.

Sheett rethinks the cell as a small state machine instead of a static value field. A board consists of rows (units of coordination) and interactive cells that:

- Maintain state
- Enforce constraints
- React to events
- Trigger rule-based changes

Instead of editing text in a cell, users interact with it. Examples: A **Claim** cell allows exactly one person to take ownership. A **Counter** cell enforces capacity limits. A **Status** cell unlocks or blocks other cells. A **Deadline** cell automatically changes state when time expires. The goal is to combine the structural clarity of spreadsheets with the interactivity of lightweight workflow systems.

## Tech Stack

- **Expo (iOS & Android):** Native mobile apps built with React Native via Expo
- **Expo Web:** Web app delivery using the same codebase
- **Tinybase:** Local-first storage with SQLite-based persistence
- **Cloudflare Durable Objects:** WebSocket connections for real-time sync and deterministic conflict resolution
- **Supabase:** Authentication and user management

![Sheett cell interactions](https://github.com/user-attachments/assets/0e35b857-eeaa-4d4e-991d-f78dac0d7437)

## Current Feature Set (Phase 1)

### 1. Local-First Architecture

Boards are stored locally by default using Tinybase. Users can work fully offline. Synchronization is opt-in and happens via WebSockets when enabled, with Cloudflare Durable Objects coordinating real-time sync and conflict resolution.

### 2. Interactive Cell Types

Initial supported cells:

- **Claim Cell** – ownership with exclusive locking
- **Status Cell** – finite states with dependency logic
- **Counter Cell** – capacity-based participation
- **Yes/No Cell** – binary interaction with vote tracking
- **Deadline Cell** – time-aware state transitions

Each cell maintains a controlled state model instead of free-form input.

![Sheett reactive rules](https://github.com/user-attachments/assets/4999e404-bf58-4a88-a971-e041465ebd0f)

### 3. Reactive Rule Engine

Users can configure rule templates such as:

- When all required tasks are "Done" → mark board as Ready
- When a slot becomes unclaimed → notify Owner
- When deadline passes → lock edits

Rules are human-readable and template-based to avoid scripting complexity.

### 4. Role-Based Permissions

Four roles: **Owner** (full control and deletion rights), **Manager** (structure + content control), **Editor** (content interaction only), **Viewer** (read-only). Permissions apply not just at document level, but per interaction type.

![Sheett permissions and visibility](https://github.com/user-attachments/assets/f5f30655-64ae-471e-a9fa-9a8ef5a94069)

## Challenges Solved

- Preventing accidental overwrites in collaborative grid environments
- Designing a rule engine without exposing users to scripting complexity
- Syncing stateful cells while preserving offline reliability via Tinybase
- Enforcing permissions at the cell-interaction level instead of just document level
- Maintaining deterministic state transitions across clients with Cloudflare Durable Objects

## Future Direction (Phase 2+)

1. **External Signals** – Cells react to webhooks, API-based status updates, and custom integrations
2. **Template Library** – Opinionated templates for event coordination, volunteer scheduling, shift planning
3. **Public SDK** – Embeddable interactive cells for third-party tools
4. **Conflict-Resistant Collaboration** – Refined deterministic merge strategies for simultaneous claims, state transitions, and offline edits

## Implementation Decisions

- Avoided formula support in early versions to prevent feature creep
- Rejected generic "custom cell builder" to maintain UX clarity
- Focused on constrained flexibility over open-ended configuration
- Prioritized deterministic state transitions over permissive editing

## Links

- **Repository:** Private – not yet public
- **Live URL:** Not yet deployed
- **Demo/Video:** Not yet available
- **Related write-up:** Planned – "Why Spreadsheets Should Be Stateful"
