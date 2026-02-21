---
title: "Sheett - Realtime Collaborative Spreadsheets"
description: "A local-first, real-time collaboration board where cells are interactive, stateful, and reactive instead of static data fields."
publishedAt: "2026-02-01"
updatedAt: "2026-02-21"
tags: ["Expo", "Tinybase", "Cloudflare", "Supabase", "Local-First"]
featured: true
public: true
slug: "interactive-reactive-board-sheett"
cover: "https://github.com/user-attachments/assets/78dffa3e-39ed-4a24-a9a2-48df09744f13"
status: "Private Beta"
---

# Sheett: Interactive, Stateful Spreadsheets

> **A local-first, real-time collaboration board where cells are interactive, stateful, and reactive instead of static data fields.**

![Sheett Board Overview](https://github.com/user-attachments/assets/78dffa3e-39ed-4a24-a9a2-48df09744f13)

Sheett started as a question: *Why are spreadsheets still passive data containers in a world of real-time collaboration and automation?*

Traditional spreadsheets treat cells as static values. Collaboration happens around the data, not inside it. This works for calculations, but breaks down when spreadsheets are used for coordination, task assignment, event planning, or operational workflows.

Sheett rethinks the cell as a small state machine instead of a static value field. A board consists of rows (units of coordination) and interactive cells that maintain state, enforce constraints, react to events, and trigger rule-based changes. Instead of editing text in a cell, users **interact** with it.

![Interactive Cell Types](https://github.com/user-attachments/assets/0e35b857-eeaa-4d4e-991d-f78dac0d7437)

**Examples:**

- A **Claim cell** allows exactly one person to take ownership.
- A **Counter cell** enforces capacity limits.
- A **Status cell** unlocks or blocks other cells.
- A **Deadline cell** automatically changes state when time expires.

The goal is to combine the structural clarity of spreadsheets with the interactivity of lightweight workflow systems.

---

## Tech Stack

- **Mobile:** Expo (iOS and Android)
- **Web:** Expo Web
- **Local-first storage:** Tinybase (SQLite)
- **Realtime sync:** Cloudflare Durable Objects (WebSocket connection, conflict resolution)
- **Auth:** Supabase

---

## Current Feature Set (Phase 1)

### 1. Local-First Architecture

Boards are stored locally in SQLite via Tinybase. Users can work fully offline. Synchronization is opt-in and happens through Cloudflare Durable Objects when enabled.

### 2. Interactive Cell Types

Initial supported cells:

| Cell Type   | Purpose                                           |
| ----------- | ------------------------------------------------- |
| Claim Cell  | Ownership with exclusive locking                  |
| Status Cell | Finite states with dependency logic               |
| Counter Cell| Capacity-based participation                      |
| Yes/No Cell | Binary interaction with vote tracking             |
| Deadline Cell | Time-aware state transitions                    |

Each cell maintains a controlled state model instead of free-form input.

![Reactive Rules and Permissions](https://github.com/user-attachments/assets/4999e404-bf58-4a88-a971-e041465ebd0f)

### 3. Reactive Rule Engine

Users can configure rule templates such as:

- When all required tasks are "Done" → mark board as Ready
- When a slot becomes unclaimed → notify Owner
- When deadline passes → lock edits

Rules are human-readable and template-based to avoid scripting complexity.

### 4. Role-Based Permissions

Four roles with granular control:

- **Owner** – full control and deletion rights
- **Manager** – structure + content control
- **Editor** – content interaction only
- **Viewer** – read-only

Permissions apply not just at document level, but per interaction type. Board-level visibility controls include Private, Invite-only, and Public link access.

![Board Visibility and Collaboration](https://github.com/user-attachments/assets/f5f30655-64ae-471e-a9fa-9a8ef5a94069)

---

## Key Challenges Solved

- **Preventing accidental overwrites** in collaborative grid environments
- **Designing a rule engine** without exposing users to scripting complexity
- **Syncing stateful cells** while preserving offline reliability
- **Enforcing permissions** at the cell-interaction level instead of just document level
- **Maintaining deterministic state transitions** across clients with conflict-resistant collaboration

---

## Future Direction (Phase 2+)

1. **External Signals** – Cells react to webhooks, API-based status updates (shipment, scheduling), and custom integrations, transforming boards into live operational dashboards.

2. **Template Library** – Opinionated templates for event coordination, volunteer scheduling, shift planning, and lightweight ops tracking.

3. **Public SDK** – Expose interactive cells as embeddable components for third-party tools, positioning Sheett as a coordination engine.

4. **Conflict-Resistant Collaboration** – Refine deterministic merge strategies for simultaneous claims, state transitions, and offline edits.

---

## Implementation Decisions

- Avoided formula support in early versions to prevent feature creep
- Rejected generic "custom cell builder" to maintain UX clarity
- Focused on constrained flexibility over open-ended configuration
- Prioritized deterministic state transitions over permissive editing

---

## Links

- **Beta:** Currently in private beta (TestFlight). Want to try it out? [Drop me an email](mailto:jano@janodetzel.com).
- **Repository:** Private (not yet public)
- **Live URL:** Not yet deployed
- **Demo/Video:** Not yet available
- **Related write-up:** Planned: "Why Spreadsheets Should Be Stateful"
