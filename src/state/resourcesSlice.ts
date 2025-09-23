import type { StateCreator } from 'zustand'
import { saveNow } from '../game/persistence'

export interface ResourcesState {
  loc: number
  revenue: number
  lifetimeRevenue: number
  uiLocPerSec: number
  uiRevPerSec: number
}

export interface ShippingSystem {
  auto: boolean
  bufferedLoc: number
  lastShipAt: number | null
}

export interface CapsState {
  agentConcurrencyCap: number
  parallelismCap: number
}

export interface StatsState {
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

export interface MilestonesState {
  reached: { id: string; time: number }[]
}

export interface UIState {
  showDependencyGraph: boolean
}

export interface ResourcesSlice {
  resources: ResourcesState
  systems: { shipping: ShippingSystem }
  caps: CapsState
  stats: StatsState
  milestones: MilestonesState
  ui: UIState
  click: () => void
  shipNow: () => number
  addLoc: (amount: number) => void
  addRevenue: (amount: number) => void
  recomputeUiRates: (tickSec: number, lastLocDelta: number, lastRevDelta: number) => void
  toggleDependencyGraph: () => void
}

export const createResourcesSlice: StateCreator<ResourcesSlice, [], [], ResourcesSlice> = (set, get) => ({
  resources: {
    loc: 0,
    revenue: 0,
    lifetimeRevenue: 0,
    uiLocPerSec: 0,
    uiRevPerSec: 0,
  },
  systems: {
    shipping: {
      auto: false,
      bufferedLoc: 0,
      lastShipAt: null,
    }
  },
  caps: {
    agentConcurrencyCap: 0,
    parallelismCap: 0,
  },
  stats: {
    loc_per_click: 1,
    idle_loc_per_sec: 0.1,
    ship_fraction: 0.2,
    revenue_per_loc: 0.05,
    ship_automation: 0,
    global_multiplier: 1,
    features_multiplier: 1,
    revenue_multiplier: 1,
    price_premium: 1,
    market_expansion: 1,
    focus_multiplier: 1,
    passive_rev_per_sec: 0,
  },
  milestones: {
    reached: [],
  },
  ui: {
    showDependencyGraph: false,
  },
  click: () => {
    const s = get()
    const mult = (s.stats.focus_multiplier || 1) * (s.stats.global_multiplier || 1)
    const d = (s.stats.loc_per_click || 1) * mult
    s.addLoc(d)
  },
  shipNow: () => {
    const s = get()
    const frac = Math.max(0, Math.min(1, s.stats.ship_fraction || 0))
    const buf = s.systems.shipping.bufferedLoc
    if (buf <= 0) return 0
    const shipped = buf * frac
    const revPerLoc = (s.stats.revenue_per_loc || 0.05) * (s.stats.revenue_multiplier || 1) * (s.stats.features_multiplier || 1) * (s.stats.price_premium || 1) * (s.stats.market_expansion || 1) * (s.stats.global_multiplier || 1)
    const gain = shipped * revPerLoc
    set(state => {
      state.systems.shipping.bufferedLoc -= shipped
      state.systems.shipping.lastShipAt = Date.now()
    })
    s.addRevenue(gain)

    // Save after significant revenue gain (shipping)
    if (gain > 0) {
      saveNow().catch(console.error)
    }

    return gain
  },
  addLoc: (amount: number) => set(state => {
    state.resources.loc += amount
    state.systems.shipping.bufferedLoc += amount
  }),
  addRevenue: (amount: number) => set(state => {
    state.resources.revenue += amount
    state.resources.lifetimeRevenue += amount
  }),
  recomputeUiRates: (tickSec: number, lastLocDelta: number, lastRevDelta: number) => set(state => {
    const a = 0.2 // EMA smoothing
    state.resources.uiLocPerSec = state.resources.uiLocPerSec * (1 - a) + (lastLocDelta / tickSec) * a
    state.resources.uiRevPerSec = state.resources.uiRevPerSec * (1 - a) + (lastRevDelta / tickSec) * a
  }),
  toggleDependencyGraph: () => set(state => {
    state.ui.showDependencyGraph = !state.ui.showDependencyGraph
  }),
})
