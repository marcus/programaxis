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
- **Visual design**: `src/styles/*.css`, `src/ui/Icons.tsx`

## CSS Architecture

### Modular CSS Structure

The CSS is organized into modular files by functionality, all imported through `src/index.css`:

```
src/
├── index.css           # Main import file
└── styles/             # CSS modules by functionality
    ├── base.css        # Variables, resets, basic elements
    ├── layout.css      # App structure (grid, header, sidebar)
    ├── components.css  # Common UI components (stats, badges)
    ├── tron-buttons.css # Button variants with animations
    ├── tech-tree.css   # Tech tree, nodes, branches styles
    ├── progress.css    # Progress bars, milestone components
    ├── dashboard.css   # Agent dashboard, indicators
    ├── modals.css      # Modal dialogs, overlays
    └── animations.css  # Special effects, keyframes
```

### CSS Variables and Theming

Core design tokens are defined as CSS variables in `base.css`:

```css
:root {
  --bg: #0b0f14;        /* Main background */
  --panel: #121821;     /* Panel/card background */
  --text: #e5eef5;      /* Primary text */
  --muted: #9bb1c9;     /* Secondary text */
  --accent: #5ad6a0;    /* Primary accent (success/enabled) */
  --warn: #ffca5f;      /* Warning/attention color */
  --danger: #f45b69;    /* Error/danger color */
}
```

### Adding New Styles

1. **Choose the appropriate module** based on functionality
2. **Follow existing patterns** for naming and structure
3. **Use CSS variables** for colors and consistent values
4. **Keep selectors specific** to avoid style collisions
5. **Add new modules** if a new distinct component category emerges

### Branch Styling

Tech tree branches use CSS variables for visual differentiation:

```css
.branch { 
  --branch-accent: #5ad6a0; 
  --branch-glow: rgba(90, 214, 160, 0.22); 
  --branch-bg1: #0d1420; 
  --branch-bg2: #0b121a; 
}
.branch-A { --branch-accent: #46e6ff; ... }
.branch-B { --branch-accent: #5aa6ff; ... }
/* etc. */
```

### Component Styling Patterns

#### Futuristic UI Elements
- **Tron-style buttons**: Animated with glow effects and hover states
- **Gradient backgrounds**: Linear gradients for depth and visual interest
- **Glow effects**: Box-shadows with color-matched glows for interactive elements
- **Corner accents**: Animated corner elements for modal dialogs

#### Animation Guidelines
- **Smooth transitions**: Use `transition: all 0.3s ease` for general interactions
- **Subtle pulses**: Keyframe animations for attention-drawing elements
- **Text effects**: Specialized animations for garbled/encrypted text states
- **Performance**: Use `transform` and `opacity` for hardware-accelerated animations

#### Responsive Design
- **Mobile-first approach**: Base styles for mobile, enhance for desktop
- **Grid layouts**: CSS Grid for main app structure, Flexbox for components
- **Media queries**: Breakpoint at `min-width: 768px` for desktop enhancements

### Styling Best Practices

1. **Use semantic class names** that describe purpose, not appearance
2. **Scope styles appropriately** to avoid unintended inheritance
3. **Leverage CSS custom properties** for dynamic theming and consistency
4. **Group related styles** within logical sections in each module
5. **Comment complex animations** and calculations for maintainability

## Three.js Tech Purchase Animations

### Animation System Overview

The game features spectacular Three.js particle animations that trigger when purchasing tech nodes. The system consists of:

- **Animation Manager** (`src/game/animationSystem.ts`): Event system for triggering animations
- **Animation Component** (`src/ui/TechPurchaseAnimation.tsx`): Three.js rendering and particle physics
- **CSS Integration** (`src/styles/tech-animation.css`): Visual blending and performance optimizations

### Branch-Specific Animation Patterns

Each tech branch has distinct visual characteristics:

- **Programming (A)**: Matrix-style cascade effect with 200 particles flowing downward
- **Automation (B)**: Mechanical spiral burst with 120 larger particles in rotational pattern
- **Other Branches (C-H)**: Classic explosion pattern with branch-specific colors and timing

### Adding New Animation Patterns

1. **Add pattern configuration** in `createParticleSystem()` function:
```typescript
else if (branchKey === 'C') {
  particleCount = 180
  velocityPattern = 'your_pattern_name'
  sizeRange = [4, 10]
  speedMultiplier = 1.2
  animationDuration = 2200
}
```

2. **Implement particle behavior** in the animation loop:
```typescript
else if (system.velocityPattern === 'your_pattern_name') {
  // Custom physics and visual effects
  // Update positions, velocities, alphas, sizes based on pattern
}
```

3. **Update branch theme** in `animationSystem.ts` if needed for custom colors/symbols

### Animation Testing

- **Test Panel**: Set `ENABLE_ANIMATION_TESTING = true` in `src/ui/App.tsx`
- **Performance**: Animations auto-cleanup after completion, GPU-accelerated
- **Accessibility**: Respects `prefers-reduced-motion` setting

### Technical Details

- **Particle Count**: 120-200 particles per animation depending on branch
- **Duration**: 1.8-2.5 seconds based on branch theme
- **Physics**: Custom velocity patterns, gravity, fade effects
- **Shaders**: Custom vertex/fragment shaders for glowing particle effects
- **Cleanup**: Automatic geometry/material disposal prevents memory leaks

## Action Button Animations

### Button Animation System

Subtle 3D spark animations trigger when clicking action buttons (Write Code, Ship Build, Pay Down Debt). The system is designed for frequent use with minimal performance impact.

- **Action Animation Manager** (`src/game/actionAnimationSystem.ts`): Lightweight event system with performance monitoring
- **Action Button Component** (`src/ui/ActionButtonAnimation.tsx`): Three.js renderer optimized for small, frequent effects
- **CSS Enhancements** (`src/styles/action-animations.css`): 3D button transforms and immediate feedback

### Animation Characteristics

Each action button has a distinct spark pattern:

- **Write Code**: 3-6 green sparks floating upward with gentle scatter (optimized for frequent clicking)
- **Ship Build**: 4-8 yellow sparks in radial burst pattern with physics fall
- **Pay Down Debt**: 5-9 red sparks in spiral dissolve pattern (delayed execution to prevent component refresh interruption)

### Performance Features

- **Adaptive Quality**: Auto-reduces particle count/duration if FPS drops below 30
- **Object Pooling**: Reuses particles and shared materials
- **Smart Throttling**: Limits animations to prevent overwhelming on rapid clicks
- **Small Scale**: 1.5-5px spark particles, 280-420ms duration
- **3D Effects**: Cross-shaped spark shaders with Z-axis movement and rotation

### Integration Notes

- Animations trigger before game state changes to avoid component re-render interruption
- Intensity scales with game state (LoC amount, buffered code, debt reduction)
- Canvas at 70% opacity to avoid covering content
- Respects `prefers-reduced-motion` accessibility setting

## Save Data

- **Storage**: IndexedDB key `programaxis_save_v1`
- **Structure**: Full store state serialization
- **Offline handling**: Time-based credit calculation on load
- **Reset**: Clear IndexedDB to reset save data

## Testing and Building

No test framework currently configured. Build validation via `npm run build`. Game features are tested through the dev server with save data persistence.