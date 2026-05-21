# PokeAtlas

> Track your Pokémon GO collection progress in one place.                                v0.0.1 (MVP)
>

---

## 1. Product Vision

“*Help trainers see and track their Pokémon GO collection progress in a simple, organized, and low-friction way.”*

PokeAtlas is a companion app focused on **collection progress**, not gameplay automation, analytics, or account syncing.

The goal is to help trainers answer:

- What do I already own?
- What am I still missing?
- How far along is my collection?
- How is my progress evolving over time?

---

## 2. Product Thesis

PokeAtlas makes Pokémon GO collection progress visible, organized, and effortless to track — without spreadsheets, screenshots, or account syncing.

---

## 3. Core User Problem

Today, Pokémon GO collection progress feels:

- scattered
- invisible
- difficult to remember
- annoying to track manually

Players often:

- forget what they already have
- don’t know what they are missing
- can’t easily measure progress
- use spreadsheets, notes, screenshots, or memory

---

## 4. Core User Loop

Trainer catches or obtains Pokémon in-game

↳ Trainer updates PokeAtlas

Trainer sees collection progress improve

↳ Trainer notices what is still missing

Trainer returns after future gameplay sessions

---

## 5. Scope

**What PokeAtlas Is**: A Pokémon GO collection progress tracker.

**What PokeAtlas Is NOT**:

- PvP tracker
- raid assistant
- stardust tracker
- analytics platform
- OCR scanner
- auto-sync tool
- AI coach
- social platform

---

## 6. MVP Goal

Enable trainers to quickly track Pokémon ownership states and see meaningful collection progress.

The MVP should feel:

- fast
- rewarding
- low friction
- visually clear

---

## 7. Features (v0.0.1)

### 7.1 Complete Pokémon GO Database

Browse the full Pokémon GO Pokédex. Includes:

- Pokémon species
- generations/regions
- search
- filters
- etc

---

### 7.2 Collection Tracking

Users can track Pokémon ownership states. Supported states:

- Owned
- Shiny
- Hundo
- Shadow
- Purified

---

### 7.3 Progress Dashboard

Home screen showing collection progress. Example metrics:

- National completion %
- Generation completion %
- Shiny completion %
- Hundo completion %
- Shadow completion %

Example UI:

National Dex → 842 / 1207

Kanto → 148 / 151

Shiny Collection → 113 / 1207

Recently Updated:

- Totodile
- Rookidee

---

### 7.4 Pokédex Screen

Primary interaction screen.

Capabilities:

- browse Pokémon
- search Pokémon
- filter Pokémon
- update ownership states

Example filters:

Status:

- Owned
- Missing

Collection Type:

- Everything
- Shiny
- Hundo
- Shadow
- Purified

Generation:

- Kanto
- Johto
- Hoenn
- etc.

This screen replaces the need for a dedicated “missing” view.

---

### 7.5 Minimal Insights

Simple derived insights from tracked data.

Allowed insights:

- “Kanto: 148/151 complete”
- “Only 3 Pokémon left in Johto”
- “31% shiny completion”
- “Shiny collection +4 this month”

Rule:

Insights must be derived and descriptive.

No recommendations.

No coaching.

No AI.

---

## 8. Screens

### Screen 1 — Home / Progress Dashboard

Purpose: Help users feel momentum.

Shows:

- overall progress
- collection percentages
- recently updated Pokémon
- quick summary

---

### Screen 2 — Pokédex

Purpose: Browse and update collection.

Capabilities:

- search
- filter
- state updates

Primary daily-use screen.

---

### Screen 3 — Pokémon Detail

Purpose: View and edit Pokémon state.

Example: Rookidee

States:

☑ Owned

☐ Shiny

☐ Hundo

☐ Shadow

☐ Purified

Optional metadata later:

- notes
- encounter count
- form variants

Not MVP.

---

## 9. Out of Scope (Strict)

v0.0.1 explicitly excludes:

- PvP tracking
- battle logs
- raid analytics
- stardust / coins tracking
- team builder
- AI assistant
- OCR imports
- account sync
- notifications
- community/social features
- public profiles
- challenge systems

---

## 10. Product Principles

1. Low friction over complexity: Updating progress should be fast.
2. Progress over data dumping: Users care about momentum, not databases.
3. Collection-first: Everything in v0.0.1 serves collection progress.
4. No sync dependency: PokeAtlas should feel useful without risky integrations or heavy setup.

---

## 11. Success Criteria for MVP

A trainer should be able to:

1. Find a Pokémon quickly
2. Mark ownership state in seconds
3. Understand collection progress immediately
4. Return after gameplay to update progress

---

## 12. Future Expansion Hooks (NOT MVP)

Potential evolution paths:

Collection Depth

- forms
- costumes
- lucky Pokémon
- regional tracking

Progress Layer

- goals
- challenges
- collection milestones

Insight Layer

- smarter summaries
- progress trends

Companion Layer

- event relevance
- contextual reminders

Rule:

> Future growth must build on collection progress, not replace it.
>

[Product Overview](PokeAtlas/Product%20Overview%2036605a966e6080678f98d87e9150480f.md)
