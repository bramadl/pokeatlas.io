# Product Overview

---

## Product Goal

“*Enable trainers to quickly and effortlessly track their Pokémon GO collection progress.*”

PokeAtlas is optimized for:

- speed
- low friction
- visible progress

The app complements gameplay sessions rather than replacing them.

**Core behavior:**

> play Pokémon GO → update progress → feel momentum

---

## Core Product Loop

Trainer catches or obtains Pokémon in Pokémon GO

↳ Trainer opens PokeAtlas

Trainer switches collection mode

↳ Trainer taps Pokémon to update collection progress

Trainer sees progress improve

↳ Trainer closes app

---

## Navigation

Bottom Navigation:

1. Home
2. Dex
3. Profile / Settings

No additional tabs in v0.0.1.

---

## Screen 1 — Home

**Help trainers feel progress.**

Home should answer: “How am I doing?”

### Content

**Collection Progress** (Examples):

- National Dex → 842 / 1207
- Kanto → 148 / 151
- Shiny Collection → 113 / 1207
- Hundo Collection → 41 / 1207
- Shadow Collection → 87 / 1207
- Purified Collection → 65 / 1207

### Minimal Insights

Examples:

- Johto is closest to completion (5 remaining)
- Shiny completion: 31%
- Kanto completion: 98%

Insights are:

- descriptive
- derived
- lightweight

> ***No recommendations. No coaching. No AI.***
>

---

## Screen 2 — Dex

**Primary interaction screen.**

Users browse and update collection progress. *This is the most frequently used screen.*

### Layout

**Top**: Search Input

**Below Search**: Collection Mode Tabs (Standard, Shiny, Hundo, Shadow, Purified)

**Below Tabs**: Filter Trigger

**Possible filters**:

- Generation / Region
- Owned only
- Missing only
- Sort options

### Pokémon List or Grid

**Default state**: Pokémon are dimmed (50% opacity).

**Example**:

```bash
Bulbasaur      dimmed
Ivysaur        owned
Venusaur       dimmed
```

**Interaction**: Tap Pokémon

**Behavior**: Current collection mode toggles.

**Example**:

- If mode = Shiny
- Tap Bulbasaur

*Before*: Bulbasaur (dimmed)

*After*: Bulbasaur (full opacity)

*Equivalent system action*: `bulbasaur.shiny = true`

**Example**:

- If mode = Standard
- Tap Venusaur
- Equivalent system action: `venusaur.owned = true`

**Design principle**: one tap = one update

> *No modal. No confirmation. No extra clicks.*
>

### Pokémon Detail

> ***Not part of the core interaction flow.***
>

**Optional access**: Long press or info button.

**Purpose**: Read-only Pokémon information.

**Potential content**:

- artwork
- typing
- evolution chain
- Pokédex information

Not critical to v0.0.1.

---

## Screen 3 — Profile / Settings

**Simple configuration screen.**

Contains:

- theme
- reset/export data (later)
- about
- app version

Keep minimal.

---

## Interaction Principles

**Low friction first**: Updating progress must feel instant.

*Bad*: Tap → open detail → edit → save

*Good*: Tap → updated

---

## Contextual interaction

Current collection mode determines behavior.

*Example*:

- Shiny mode
- Tap Pokémon

*Result*: mark shiny owned

---

## No onboarding

**Users should immediately understand the app.**

*Flow*: Open app → Go to Dex → Tap Pokémon → Done.

---

## Data Model (Product-Level)

Tracked states per Pokémon:

- owned (standard)
- shiny
- hundo
- shadow
- purified

*State type*: boolean

*Example*:

```bash
**Bulbasaur**

owned: true
shiny: false
hundo: true
shadow: false
purified: false
```

---

## Out of Scope

Explicitly excluded from v0.0.1:

- PvP tracking
- battle logs
- raid analytics
- team builder
- stardust / coins
- goals system
- AI assistant
- OCR
- account sync
- notifications
- community/social features

---

## MVP Success Criteria

A trainer can:

1. Open app immediately
2. Find Pokémon quickly
3. Update collection state in one tap
4. Understand progress instantly
5. Return after gameplay sessions

---

## Design North Star

> **Fast enough to update after every Pokémon GO session.**
>