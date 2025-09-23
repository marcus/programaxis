Tech Stack (browser-based, local only)
	•	Framework: React + Vite
	•	State: Zustand (single store; composable slices)
	•	Persistence: IndexedDB via idb-keyval (fast, durable, handles bigger saves than localStorage)
	•	Time: requestAnimationFrame for rendering; fixed game tick with setInterval (e.g., 250 ms) for simulation
	•	Routing: none for v1
	•	Assets: inline SVG + simple spritesheets
	•	Packaging: Vite dev server; vite build for a static bundle you can open locally

Minimal file layout

/src
  /game
    loop.ts           // start/stop tick, delta calc, offline catch-up
    balance.ts        // tuning constants and curves
    progression.ts    // unlock checks, dependency gating
    persistence.ts    // save/load to IndexedDB, versioning, migrations
  /state
    store.ts          // create store; combine slices
    resourcesSlice.ts // LoC, Revenue, multipliers
    techSlice.ts      // nodes, status, costs, effects
    timersSlice.ts    // tick time, lastSaved, offline credit
  /ui
    App.tsx
    HUD.tsx           // LoC/s, Rev/s, totals, prestige meter
    TechTree.tsx      // eight ladders; node cards; buy/upgrade
    Milestones.tsx    // milestone ribbon & history
    Modals.tsx
    Icons.tsx
  main.tsx
  index.css

Game flow (v1)

1) New run
	•	Start nodes unlocked:
	•	AI Models: Cut & Paste
	•	Editor: Plain Editor
	•	Hardware: Office Laptop
	•	Base resources: Lines of Code (LoC), Revenue.
	•	Base rates: click = +1 LoC, idle = +0.1 LoC/s. Shipping converts LoC → Revenue at a base efficiency.

2) Core loop
	•	Click to generate LoC.
	•	Unlock upgrades to add idle LoC/s, conversion efficiency, and multipliers.
	•	Periodic “Ship Build” action (auto-unlocks early) converts a portion of buffered LoC to Revenue; later upgrades automate shipping.

3) Tech ladders (eight)
	•	Each ladder node costs Revenue (and sometimes LoC) and applies effects:
	•	AI Models: feature quality, bug reduction → better conversion and feature multipliers.
	•	Editor & Tools: dev velocity, automation, shipping automation.
	•	Hardware: compute gates for higher AI tiers, increases parallelism caps.
	•	Ergonomics: session length, focus multipliers, error-rate reduction.
	•	AI Agents: parallel tasks; unlock queued jobs and background projects.
	•	Marketing & Distribution: CAC↓/LTV↑ multipliers, passive Revenue/s.
	•	Platforms & Features: new monetization streams (DLC/IAP/Multiplayer).
	•	Graphics & Content Gen: asset cost↓, quality↑, premium price multipliers.
	•	Dependencies enforced in progression.ts (e.g., C2 -> A2, B2 -> G3).

4) Jobs & queues (simple for v1)
	•	A Build Queue holds small tasks (tests, packaging, release).
	•	Agents increase concurrent jobs; hardware raises concurrency caps.
	•	Each job ticks on the 250 ms loop and yields either LoC, QoL multipliers, or direct Revenue.

5) Prestige (optional toggle for day-1, safe to add week-1)
	•	“New Startup” reset converts lifetime Revenue into a permanent Insight multiplier.
	•	Soft cap on late-game growth without prestige; prestige breaks the cap.

6) Save/load
	•	Autosave every 10 s and on visibility change.
	•	On load, compute offline progress (time delta × capped idle rates) and credit LoC/Revenue.
	•	Versioned saves; simple migration map in persistence.ts.

HUD
	•	LoC total, LoC/s
	•	Revenue total, Rev/s
	•	Next unlock preview (cost, effect)
	•	Current caps (agents, concurrency)
	•	Ship button state (manual → auto)
	•	Milestone ribbon

Milestones
	•	$1,000 — “First Sale”: unlock Ship Build automation tier 1
	•	$10,000 — “Micro-Studio”: +5% global dev velocity
	•	$100,000 — “Tooling Pays Off”: Editor path discount −10%
	•	$1,000,000 — “Indie Darling”: unlock Agents tier 1
	•	$10,000,000 — “Live-Ops On”: Platforms path discount −10%
	•	$100,000,000 — “Brand Found”: Marketing passive Rev/s +10%
	•	$1,000,000,000 — “Global Hit”: +1 concurrent job slot
	•	$10,000,000,000 — “Studio Group”: Agents cap +25%
	•	$100,000,000,000 — “Platform Owner”: Feature prices +10%
	•	$1,000,000,000,000 — “Cultural Monopoly”: unlock Superintelligence gate
	•	$10,000,000,000,000 — “Reality Architect”: +1 permanent Insight (prestige seed)

Tuning defaults
	•	Tick: 250 ms
	•	Manual click: +1 LoC
	•	Base idle: 0.1 LoC/s
	•	Base conversion: ship 20% of buffered LoC → Revenue at $0.05/LoC
	•	Early upgrades target 2–5× growth each tier; costs exponential with soft k-factor (e.g., 1.12–1.18)

Implementation notes
	•	Zustand slices: resources, tech, timers.
	•	loop.ts pulls derived production rates from the store every tick, applies deltas, then commits a single batched update.
	•	persistence.ts stores a compact state snapshot (idb-keyval.set('save', state)) and restores on boot; handle lastSavedAt for offline credit.
	•	UI: Flexbox grid; each ladder is a column with node cards; dotted “dependency” badges on node cards.
