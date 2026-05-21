# Product Modeling

## Purpose

This document defines the business reality, responsibilities, and system boundaries of PokeAtlas v0.0.1.

The goal is to establish a lean, evolvable product model before implementation.

> *This document intentionally avoids implementation details, database schemas, or technical architecture.*
>

---

## Product Scope

PokeAtlas is a Pokémon GO personal tracking companion focused on helping trainers track and understand their collection progress. PokeAtlas complements gameplay sessions by enabling fast, low-friction collection tracking.

**Core behavior:**

Play Pokémon GO → Open PokeAtlas → Update collection progress → See progress → Leave

---

## Domain

> ***Pokemon GO Personal Tracking***
>

PokeAtlas operates within the domain of helping trainers track personal progression inside Pokémon GO. This domain intentionally allows future expansion beyond collection tracking.

**Examples of future possibilities:**

- PvP tracking
- shiny counters
- raid progress
- stardust goals
- trainer progression tracking

**These are not part of v0.0.1.**

---

## Subdomains

### Core Subdomain

> ***Collection Tracking***

Responsible for tracking trainer Pokémon collection ownership and progression.

**Responsibilities:**

- track Pokémon collection states
- browse Pokémon
- search Pokémon
- filter Pokémon
- manage tracked collection progress

Without Collection Tracking: **PokeAtlas has no product.**

This subdomain defines the MVP.

---

## Supporting Subdomain

### Progress & Insights

> *Responsible for summarizing and visualizing trainer collection progress.*

**Responsibilities:**

- compute completion progress
- summarize tracked collection states
- derive lightweight insights
- surface progression visibility

This subdomain depends entirely on Collection Tracking. Without tracked collection data, **no progress exists**.

---

## Generic Subdomains

### Profile

Handles trainer-local profile preferences. Examples:

- app preferences
- personalization settings

### Settings

Handles application configuration. Examples:

- enabled tracking options
- visual preferences
- reset data

### Persistence

Responsible for saving trainer progress. Examples:

- local persistence
- sync strategies (future)

---

## Bounded Contexts

### Collection Context (Core)

**Purpose**: Manage trainer Pokémon collection progress.

**Responsibilities**:

- browse Pokémon collection
- search Pokémon
- filter Pokémon
- mark Pokémon states
- unmark Pokémon states
- maintain collection truth

**Inputs**: Trainer interactions.

**Examples**:

- Tap Pokémon
- Search Pokémon
- Filter Pokémon
- Switch collection mode

**Outputs**:  Tracked collection state.

**Examples:**

- Bulbasaur
  - owned = true
  - shiny = false
  - hundo = true

**Rules**:

1. Collection state is the source of truth.
2. Tracked Pokémon states belong here.
3. Progress must not be computed here.

**Boundary**:

**This context owns**: what the trainer has tracked

It does not own: completion percentages, dashboards, insights

---

## Progress Context (Supporting)

**Purpose**: Transform tracked collection data into visible progress.

**Responsibilities**:

- calculate completion metrics
- summarize tracked progress
- derive lightweight insights
- surface progress visibility

**Inputs**: Collection state data from Collection Context.

Examples:

- owned
- shiny
- hundo
- shadow
- purified

**Outputs**: Derived progress.

**Examples**:

- 842 / 1207 complete
- 31% shiny completion
- Kanto 148 / 151
- Closest region to completion

**Rules**:

- Progress is derived.
- Progress should never be persisted as truth.
- Insights must remain descriptive.
- No recommendations.
- No coaching.
- No gameplay optimization.

**Boundary**:

*This context owns*: visibility of progress

*It does not own*: collection editing

---

## Context Relationships

> **Collection Context → Progress Context**
>

### Relationship Type

1. Upstream → downstream
2. Collection produces tracked state.
3. Progress consumes tracked state.
4. Progress cannot modify Collection.
5. Collection does not depend on Progress.

---

## MVP Scope

**Collection Tracking**:

- Pokémon browsing
- Pokémon search
- collection modes
- one-tap tracking
- tracked ownership states

**Progress & Insights**:

- collection completion
- progress dashboard
- lightweight insights

**Explicitly Excluded**:

- PvP tracking
- team builder
- battle logs
- shiny odds tracking
- raid analytics
- stardust / PokéCoin tracking
- AI assistant
- OCR
- account sync
- community features
- goals system
- Pokémon encyclopedia experience

---

## Future Expansion Seams

The domain intentionally allows future growth without redesigning v0.0.1.

Potential future subdomains:

```bash
PvP Tracking
Goal Tracking
Economy Tracking
Pokemon Reference
```

Potential future contexts:

```bash
Battle Context
Journey Context
Pokemon Reference Context
```

These are intentionally excluded from MVP.

---

## Modeling Principles

**Low Friction First**. Trainer updates must feel fast. Primary interaction:

```bash
Open app
↓
Search Pokémon
↓
Tap Pokémon
↓
Done
```

---

## Collection Truth First

Collection data is truth.

Everything else derives from it.

---

## Progress Is Derived

Progress is computed, not stored.

---

## Scope Discipline

New features must strengthen: **trainer personal progress tracking**

Otherwise: **exclude or defer**
