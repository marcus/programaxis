# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Programaxis is a coding-themed idle game built with React + TypeScript + Vite. Players progress through a tech tree to automate software development, manage resources (LoC, Revenue, Tech Debt), and optimize their development process.

## Development Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:5173
npm run build           # Production build to dist/
npm run preview         # Preview built app

# Analysis
npm run analyze         # Run progression analyzer
npm run analyze:save    # Save analysis to docs/progression-analysis.md
```

## Architecture Overview

### State Management
- **Zustand store** with Immer middleware for immutable updates
- **Three main slices**: resources, tech, timers
- **Single store composition** in `src/state/store.ts`

### Core Systems
- **Game loop** (`src/game/loop.ts`): 250ms tick interval driving idle generation, auto-shipping, UI updates
- **Tech tree** (`context/tech-tree.json`): 8 branches (A-H) with 5 tiers each, loaded dynamically
- **Persistence** (`src/game/persistence.ts`): IndexedDB via idb-keyval, autosave every 10s, offline credit calculation
- **Milestones** (`src/game/progression.ts`): Revenue-based thresholds that unlock features and bonuses

### Directory Structure
```
src/
├── state/           # Zustand slices (resources, tech, timers, ui)
├── game/           # Core game logic (loop, persistence, progression)
├── ui/             # React components (App, HUD, TechTree, etc.)
├── data/           # Game data and utilities
└── utils/          # Shared utilities

context/            # Game design docs and content data
├── tech-tree.json  # Tech node definitions, costs, effects
├── spec.md         # High-level game design
└── DEVELOPER_ONBOARDING.md  # Detailed architecture guide
```

### Key Data Flow
1. **Game loop** runs every 250ms, updates resources via store actions
2. **Tech purchases** apply effects to stats, unlock new nodes
3. **UI components** subscribe to store slices via selectors
4. **Persistence layer** handles save/load with offline credit calculation

## Tech Tree System

The tech tree is entirely data-driven from `context/tech-tree.json`:
- **8 branches** (A=Programming, B=Automation, C=Infrastructure, D=Testing, E=Agents, F=Revenue, G=Market, H=Quality)
- **Effect types**: `add`, `mul`, `cap`, `unlock`, `toggle`
- **Dependencies**: within-branch tier progression + cross-branch requirements
- **Cost scaling**: exponential with per-branch discounts

## Store Structure

```typescript
interface StoreState {
  resources: { loc, revenue, lifetimeRevenue, ui rates }
  systems: { shipping: { auto, bufferedLoc, lastShipAt } }
  stats: { loc_per_click, idle_loc_per_sec, ship_fraction, multipliers... }
  caps: { agentConcurrencyCap, parallelismCap }
  milestones: { reached: Array<{id, time}> }

  nodeById: Record<string, TechNode>
  purchased: Record<string, number>
  unlocked: Set<string>

  timers: { tickMs, lastTickAt, lastSavedAt, offlineCapHours }
}
```

## Development Patterns

### Adding New Tech Nodes
1. Edit `context/tech-tree.json` in appropriate branch
2. Add effects using supported types (`add`, `mul`, `cap`, `unlock`, `toggle`)
3. Add icon case in `src/ui/Icons.tsx` for the node ID
4. Ensure referenced stats exist in `resourcesSlice.ts`

### Adding New Stats/Effects
1. Add to `StatsState` interface in `src/state/resourcesSlice.ts`
2. Initialize default value in `createResourcesSlice`
3. Update computations in `src/game/loop.ts` if stat affects rates
4. Wire into UI components as needed

### Adding Milestones
1. Add entry to `src/game/progression.ts` with threshold and apply function
2. Reference any new stats/caps needed in store slices

## Key Files for Modifications

- **Game balance**: `context/tech-tree.json`, `src/game/progression.ts`
- **UI components**: `src/ui/App.tsx`, `src/ui/HUD.tsx`, `src/ui/TechTree.tsx`
- **Game mechanics**: `src/game/loop.ts`, `src/state/resourcesSlice.ts`
- **Visual design**: `src/index.css`, `src/ui/Icons.tsx`

## Save Data

- **Storage**: IndexedDB key `programaxis_save_v1`
- **Structure**: Full store state serialization
- **Offline handling**: Time-based credit calculation on load
- **Reset**: Clear IndexedDB to reset save data

## Testing and Building

No test framework currently configured. Build validation via `npm run build`. Game features are tested through the dev server with save data persistence.