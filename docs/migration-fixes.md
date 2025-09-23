# Migration Fixes for Tech Tree Overhaul

## Issue
The tech tree overhaul introduced new state properties and methods that didn't exist in older save files, causing runtime errors when users with existing save data tried to use the updated game.

## Root Cause
```
TypeError: undefined is not an object (evaluating 's.systems.agents.activeAgents')
```

The new UI components were trying to access:
- `s.systems.agents.activeAgents`
- `s.systems.agents.agentProductivity`
- `s.systems.shipping.automationLevel`
- `s.resources.techDebt`
- New stats like `code_quality`, `bug_rate`, etc.
- New methods like `getAgentLocPerSec()`, `getEffectiveShipFraction()`

These didn't exist in save files created before the overhaul.

## Solutions Implemented

### 1. Defensive UI Components
Updated all new UI components to use optional chaining and nullish coalescing:

```typescript
// Before (would crash on old saves)
const activeAgents = useStore(s => s.systems.agents.activeAgents)

// After (safe with old saves)
const activeAgents = useStore(s => s.systems?.agents?.activeAgents ?? 0)
```

**Files updated:**
- `AgentDashboard.tsx`
- `QualityIndicator.tsx`
- `AutomationIndicator.tsx`
- `HUD.tsx`

### 2. Save Data Migration
Enhanced `persistence.ts` to migrate old save data to new schema:

```typescript
// Migrate resources - add new fields if missing
state.resources = {
  ...state.resources,
  ...(saved.resources || {}),
  techDebt: saved.resources?.techDebt ?? 0
}

// Migrate systems - ensure agents system exists
state.systems = {
  ...state.systems,
  shipping: {
    ...state.systems.shipping,
    ...(savedSystems.shipping || {}),
    automationLevel: savedSystems.shipping?.automationLevel ?? 0,
    lastAutoShipAt: savedSystems.shipping?.lastAutoShipAt ?? null
  },
  agents: {
    ...state.systems.agents,
    ...(savedSystems.agents || {}),
    activeAgents: savedSystems.agents?.activeAgents ?? 0,
    agentProductivity: savedSystems.agents?.agentProductivity ?? 1.0,
    lastAgentUpdate: savedSystems.agents?.lastAgentUpdate ?? null
  }
}

// Migrate stats - add new quality/process stats
state.stats = {
  ...state.stats,
  ...(saved.stats || {}),
  bug_rate: saved.stats?.bug_rate ?? 1.0,
  code_quality: saved.stats?.code_quality ?? 1.0,
  test_coverage: saved.stats?.test_coverage ?? 1.0,
  compile_speed: saved.stats?.compile_speed ?? 1.0,
  refactor_bonus: saved.stats?.refactor_bonus ?? 0.0,
  tech_debt_growth: saved.stats?.tech_debt_growth ?? 1.0
}
```

### 3. Enhanced Offline Calculations
Updated offline credit calculation to include new mechanics:

```typescript
// Calculate offline LoC generation (base + agents)
const baseLocRate = (s.stats.idle_loc_per_sec || 0) * (s.stats.focus_multiplier || 1) * (s.stats.global_multiplier || 1)
const agentLocRate = (s.systems?.agents?.activeAgents || 0) * 0.5 * (s.systems?.agents?.agentProductivity || 1) * (s.stats.global_multiplier || 1)
const totalLocRate = baseLocRate + agentLocRate

// Enhanced revenue calculation with quality/bug factors
const techDebtPenalty = Math.max(0, 1 - ((s.resources?.techDebt || 0) / 1000))
const frac = (s.stats.ship_fraction || 0) * techDebtPenalty * (s.stats.test_coverage || 1)
const qualityMultiplier = s.stats.code_quality || 1
const bugPenalty = 2 - (s.stats.bug_rate || 1)
```

### 4. Defensive Game Loop
Made the game loop robust against missing methods and properties:

```typescript
// Safe method calls
if (s.updateAgents) {
  s.updateAgents()
}

const agentLoc = s.getAgentLocPerSec ? s.getAgentLocPerSec() : 0

// Safe property access
const autoLevel = s.systems?.shipping?.automationLevel || 0
const manualAuto = s.systems?.shipping?.auto || (s.stats.ship_automation || 0) > 0

// Safe state updates
if (s.resources.techDebt !== undefined) {
  set(state => {
    if (state.resources.techDebt !== undefined) {
      state.resources.techDebt += debtGrowth
    }
  })
}
```

## Results

### ✅ Backward Compatibility
- Users with existing save files can now load the game without errors
- Old save data is automatically migrated to new schema
- New mechanics are initialized with sensible defaults

### ✅ Forward Compatibility
- New save files include all new properties
- Future updates can follow the same migration pattern
- Schema versioning infrastructure is in place

### ✅ Graceful Degradation
- If migration fails partially, game still functions
- Missing properties default to safe values
- UI components hide when features aren't available

## Testing
- Build succeeds without TypeScript errors
- Game loads successfully with both new and old save data
- All new features work correctly for new players
- Existing players get new features with proper defaults

## Prevention
For future updates with new state properties:

1. **Always add optional chaining** in UI components accessing new properties
2. **Update migration logic** in `persistence.ts` for any new schema changes
3. **Provide sensible defaults** for all new properties
4. **Test with both new and old save data** before releasing
5. **Consider schema versioning** for major changes

This approach ensures smooth user experience during game updates while maintaining development velocity.