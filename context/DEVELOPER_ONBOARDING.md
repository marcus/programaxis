# Programaxis — Developer Onboarding & Architecture

Welcome! This document gives you a fast, practical overview of the codebase: how state flows, where to change things, and how to add content (tech nodes, milestones, UI).

If you prefer a birds-eye design, see: context/spec.md and context/tech-tree.md.

## TL;DR (Quickstart)
- Install: npm install
- Dev: npm run dev (Vite at http://localhost:5173)
- Build: npm run build; preview: npm run preview
- Save lives in IndexedDB under key programaxis_save_v1.

Key places to look:
- State store and slices: src/state/
- Game loop & systems: src/game/
- UI: src/ui/
- Content (specs, data): context/

## Tech Stack
- React + Vite + TypeScript
- Zustand (single store, composed slices) with Immer middleware
- IndexedDB via idb-keyval for persistence
- No routing (v1)
- Tick: 250 ms interval; rendering via React

## Repository Structure
- context/
  - spec.md — High-level game design and tuning notes
  - tech-tree.json — Content for 8 tech branches and nodes (costs, effects, dependencies)
  - tech-tree.md — Mermaid diagram of the tech tree
  - progress-example.json — Example save payload for reference
- src/state/
  - store.ts — Composes slices; exports the Zustand store
  - resourcesSlice.ts — Resources, stats, shipping, caps, milestone records; actions (click, ship)
  - techSlice.ts — Tech nodes mapping from JSON, unlock logic, purchase & effect application
  - timersSlice.ts — Tick interval, timestamps, offline cap
- src/game/
  - loop.ts — Main simulation loop; idle LoC, passive Rev, auto-ship, UI rate smoothing, milestones
  - progression.ts — Milestone definitions and checker (applies effects on thresholds)
  - persistence.ts — Save/load to IndexedDB; offline credit; autosave scheduling
- src/ui/
  - App.tsx — App layout (HUD sidebar + TechTree)
  - HUD.tsx — Resource stats, rates, actions (click, ship), milestone ribbon
  - TechTree.tsx — Renders branches and node cards from context/tech-tree.json
  - Milestones.tsx — Ribbon of milestones with hit state
  - Icons.tsx — ShipIcon + NodeIcon (unique per tech node)
- index.html, src/main.tsx, src/index.css — Entrypoint & styles

## Data Model (Store)
The Zustand store composes three slices: resources, tech, timers. With Immer enabled, we use set(state => { ... }) mutating style.

High-level shape:
```ts path=null start=null
interface StoreState {
  // resourcesSlice
  resources: {
    loc: number
    revenue: number
    lifetimeRevenue: number
    uiLocPerSec: number
    uiRevPerSec: number
  }
  systems: {
    shipping: { auto: boolean; bufferedLoc: number; lastShipAt: number | null }
  }
  caps: { agentConcurrencyCap: number; parallelismCap: number }
  stats: {
    loc_per_click: number
    idle_loc_per_sec: number
    ship_fraction: number
    revenue_per_loc: number
    ship_automation: number
    global_multiplier: number
    features_multiplier: number
    revenue_multiplier: number
    price_premium: number
    market_expansion: number
    focus_multiplier: number
    passive_rev_per_sec: number
  }
  milestones: { reached: { id: string; time: number }[] }

  // techSlice
  nodeById: Record<string, TechNode>
  nodeToBranch: Record<string, string>
  purchased: Record<string, number>
  unlocked: Set<string>
  discounts: Record<string, number>

  // timersSlice
  timers: { tickMs: number; lastTickAt: number | null; lastSavedAt: number | null; offlineCapHours: number }
}
```

## Game Loop (src/game/loop.ts)
- Runs every tickMs (250 ms default)
- Computes dt (seconds) for per-second rates
- Applies idle LoC: idle_loc_per_sec × multipliers
- Applies passive revenue (if any)
- Performs auto-ship if enabled (milestone or upgrades)
- Updates smoothed UI rates (EMA)
- Checks milestones (by lifetimeRevenue)

Key interactions happen through store actions (e.g., addLoc, addRevenue, shipNow, recomputeUiRates).

## Persistence & Offline (src/game/persistence.ts)
- Key: programaxis_save_v1 via idb-keyval
- Autosave: every 10s and on visibility change
- Offline credit: when loading a save, compute elapsed time since lastSavedAt, cap by offlineCapHours; grant idle LoC and approximate auto-shipping into Revenue if auto is enabled

Notes:
- This is purposefully simple for v1; no shard/version migrations beyond v1 scaffold.

## Tech Tree (context/tech-tree.json, src/state/techSlice.ts)
The tech tree lives entirely in JSON and is interpreted at runtime.

JSON highlights:
- branches: 8 ladders (A–H) with nodes tiered 0–4
- node: id, tier, name, baseCost, costCurve, requires?, effects[]
- effects types: add, mul, cap, unlock, toggle

Evaluation (buyNode):
- Validates unlock requirements (prev tier in branch, and cross-branch requires)
- Checks cost affordability (with per-branch discounts)
- Applies effects:
  - add: numeric addition to a stat
  - mul: numeric multiplication to a stat
  - cap: raises a cap either in caps slice or stats (whichever key exists)
  - unlock/toggle: boolean/flag features in stats for simple gating
- Unlocks next tier and any nodes whose requirements become satisfied

Branch discounts (e.g. milestone-driven) are tracked in discounts keyed by branch letter.

## Milestones & Progression (src/game/progression.ts)
Milestones are simple revenue thresholds with an apply() side-effect. Examples:
- $1K: enable ship automation (+1)
- $10K: +5% global_multiplier
- $100K: Editor path discount −10%
- Higher tiers: caps, passive revenue, and late-game gates

Checker runs each tick and applies newly reached milestones exactly once, appending to milestones.reached.

## UI Overview
- HUD shows totals, per-second rates, buffered LoC, ship fraction, caps, and action buttons (click to write code; ship to convert LoC→Revenue). When automation is active, the Ship button is disabled and labeled Auto.
- TechTree renders a column per branch. Each node card shows:
  - A unique inline SVG icon (NodeIcon by id)
  - Node id/name
  - Cost, requires, and Buy/Locked/Purchased state
- Milestones ribbon shows a compact list of milestones with a hit state.

Example hook usage:
```tsx path=null start=null
// Read resources
const revenue = useStore(s => s.resources.revenue)
// Fire an action
const buy = useStore(s => s.buyNode)
<button onClick={() => buy('A1')}>Buy Autocomplete</button>
```

## Adding Content
1) New tech node
- Edit context/tech-tree.json inside the appropriate branch
- Add effects using the supported types; ensure any new stat keys are present in stats (resourcesSlice.ts)
- Add a NodeIcon case for the new node id in src/ui/Icons.tsx

2) New milestone
- Add a new entry in src/game/progression.ts with id, threshold, title, and apply() function
- If it references a new stat or cap, wire that key into the store slices

3) New stat or cap
- Add to StatsState (src/state/resourcesSlice.ts) or CapsState
- Initialize default values
- Update any computations in loop.ts, shipNow(), etc. if the stat participates in rates

4) Discounts or pricing knobs
- Per-branch discounts live in state.discounts (keyed by branch letter)
- Costs are baseCost × branchDiscount at purchase time

## Coding Conventions
- TypeScript strict; prefer explicit types on store shape and UI selectors
- Zustand with Immer: use set(state => { state.foo = bar }) safely
- Avoid side effects inside selectors; use actions for mutations
- Keep UI presentational and retrieve minimal state via selectors (avoid over-rendering)
- Use inline SVGs for icons; keep them small and stroke-only for consistency

## Known Limitations (v1)
- Jobs/queues are stubbed in design but not implemented here
- No routing or multi-screen flows
- No unit tests yet
- Offline shipping is approximated rather than simulated step-by-step

## Troubleshooting
- If you see errors related to immer: ensure immer is installed and the store uses middleware/immer
- Clear save: clear site data for the origin (IndexedDB) to reset state
- HMR oddities: hard reload the page (Cmd+Shift+R)

## Release
- Build: npm run build
- Outputs a static bundle in dist/ which you can host or open locally. No server required.

Happy hacking! If you add significant systems (agents/jobs/marketing), consider creating a sub-doc in context/ and link it here.
