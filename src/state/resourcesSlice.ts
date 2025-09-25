import type { StateCreator } from 'zustand'
import { saveNow } from '../game/persistence'

export interface ResourcesState {
  loc: number
  revenue: number
  lifetimeRevenue: number
  uiLocPerSec: number
  uiRevPerSec: number
  techDebt: number
}

export interface ShippingSystem {
  auto: boolean
  bufferedLoc: number
  lastShipAt: number | null
  automationLevel: number
  lastAutoShipAt: number | null
}

export interface CapsState {
  agentConcurrencyCap: number
  parallelismCap: number
}

export interface AgentSystem {
  activeAgents: number
  agentProductivity: number
  lastAgentUpdate: number | null
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
  // New quality and process stats
  bug_rate: number
  code_quality: number
  test_coverage: number
  compile_speed: number
  refactor_bonus: number
  tech_debt_growth: number
  // Agent specialization stats
  qa_agents: number
  devops_agents: number
  // Future expansion space for specialized stats
}

export interface MilestonesState {
  reached: { id: string; time: number }[]
}

export interface UIState {
  showDependencyGraph: boolean
}

export interface ResourcesSlice {
  resources: ResourcesState
  systems: { shipping: ShippingSystem; agents: AgentSystem }
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
  updateAgents: () => void
  payDownTechDebt: (amount: number) => void
  getEffectiveShipFraction: () => number
  getAgentLocPerSec: () => number
  ensureProperState: () => void
}

export const createResourcesSlice: StateCreator<ResourcesSlice, [], [], ResourcesSlice> = (set, get) => ({
  resources: {
    loc: 0,
    revenue: 0,
    lifetimeRevenue: 0,
    uiLocPerSec: 0,
    uiRevPerSec: 0,
    techDebt: 0,
  },
  systems: {
    shipping: {
      auto: false,
      bufferedLoc: 0,
      lastShipAt: null,
      automationLevel: 0,
      lastAutoShipAt: null,
    },
    agents: {
      activeAgents: 0,
      agentProductivity: 1.0,
      lastAgentUpdate: null,
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
    // New quality and process stats
    bug_rate: 1.0,
    code_quality: 1.0,
    test_coverage: 1.0,
    compile_speed: 1.0,
    refactor_bonus: 0.0,
    tech_debt_growth: 1.0,
    // Agent specialization stats
    qa_agents: 0,
    devops_agents: 0,
    // Future expansion space
  },
  milestones: {
    reached: [],
  },
  ui: {
    showDependencyGraph: false,
  },
  click: () => {
    const s = get()
    const refactorBonus = 1 + ((s.stats.refactor_bonus || 0) * 0.1) // Each point = 10% bonus
    const mult = (s.stats.global_multiplier || 1) * (s.stats.compile_speed || 1) * refactorBonus
    const d = (s.stats.loc_per_click || 1) * mult
    s.addLoc(d)
  },
  shipNow: () => {
    const s = get()
    const effectiveShipFrac = s.getEffectiveShipFraction ? s.getEffectiveShipFraction() : (s.stats?.ship_fraction || 0.2)
    const buf = s.systems?.shipping?.bufferedLoc || 0
    if (buf <= 0) return 0
    const shipped = buf * effectiveShipFrac

    // Enhanced revenue calculation with quality and bug factors
    const baseRevPerLoc = s.stats.revenue_per_loc || 0.05
    const qualityMultiplier = s.stats.code_quality || 1
    const bugPenalty = 2 - (s.stats.bug_rate || 1) // Lower bug rate = higher revenue
    const multipliers = (s.stats.revenue_multiplier || 1) * (s.stats.features_multiplier || 1) *
                       (s.stats.price_premium || 1) * (s.stats.market_expansion || 1) *
                       (s.stats.global_multiplier || 1)

    const revPerLoc = baseRevPerLoc * qualityMultiplier * bugPenalty * multipliers
    const gain = shipped * revPerLoc

    set(state => {
      if (state.systems?.shipping) {
        state.systems.shipping.bufferedLoc -= shipped
        state.systems.shipping.lastShipAt = Date.now()
      }
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
    if (state.systems?.shipping) {
      // Ensure bufferedLoc is a valid number before adding
      if (isNaN(state.systems.shipping.bufferedLoc) || state.systems.shipping.bufferedLoc === undefined) {
        state.systems.shipping.bufferedLoc = 0
      }
      state.systems.shipping.bufferedLoc += amount
    }
  }),
  addRevenue: (amount: number) => set(state => {
    // Ensure revenue fields are valid numbers
    if (isNaN(state.resources.revenue) || state.resources.revenue === undefined) {
      state.resources.revenue = 0
    }
    if (isNaN(state.resources.lifetimeRevenue) || state.resources.lifetimeRevenue === undefined) {
      state.resources.lifetimeRevenue = 0
    }

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

  updateAgents: () => set(state => {
    const maxAgents = state.caps.agentConcurrencyCap
    state.systems.agents.activeAgents = Math.min(maxAgents, maxAgents)
    state.systems.agents.lastAgentUpdate = Date.now()
  }),

  payDownTechDebt: (amount: number) => {
    const s = get()
    const cost = amount * 2 // Each LoC pays down 0.5 debt
    console.log(`PayDownTechDebt: amount=${amount}, cost=${cost}, currentLoc=${s.resources.loc}, currentDebt=${s.resources.techDebt}`)

    if (s.resources.loc >= cost) {
      set(state => {
        state.resources.loc -= cost
        state.resources.techDebt = Math.max(0, state.resources.techDebt - amount)
      })
      console.log(`After payment: newLoc=${get().resources.loc}, newDebt=${get().resources.techDebt}`)

      // Save immediately after debt payment to persist the change
      saveNow().catch(console.error)
    } else {
      console.log(`Insufficient LoC: need ${cost}, have ${s.resources.loc}`)
    }
  },

  getEffectiveShipFraction: () => {
    const s = get()
    const baseFraction = s.stats.ship_fraction || 0.2
    const debtPenalty = Math.max(0, 1 - (s.resources.techDebt / 1000))
    const testCoverageBonus = s.stats.test_coverage || 1
    return Math.max(0, Math.min(1, baseFraction * debtPenalty * testCoverageBonus))
  },

  getAgentLocPerSec: () => {
    const s = get()
    const agentCount = s.systems?.agents?.activeAgents || 0
    const baseAgentRate = 0.5
    const productivity = s.systems?.agents?.agentProductivity || 1
    const globalMult = s.stats?.global_multiplier || 1
    // Team synergy bonuses based on agent count (simplified implementation)
    let synergyBonus = 1
    if (agentCount >= 5) synergyBonus = 1.2   // Small team
    if (agentCount >= 15) synergyBonus = 1.4  // Full team
    if (agentCount >= 30) synergyBonus = 1.7  // Department
    if (agentCount >= 60) synergyBonus = 2.0  // Large organization

    return agentCount * baseAgentRate * productivity * globalMult * synergyBonus
  },

  ensureProperState: () => set(state => {
    // Ensure resources has all required fields
    if (state.resources.techDebt === undefined) state.resources.techDebt = 0
    if (isNaN(state.resources.revenue) || state.resources.revenue === undefined) state.resources.revenue = 0
    if (isNaN(state.resources.lifetimeRevenue) || state.resources.lifetimeRevenue === undefined) state.resources.lifetimeRevenue = 0

    // Ensure systems structure exists
    if (!state.systems) state.systems = { shipping: { auto: false, bufferedLoc: 0, lastShipAt: null, automationLevel: 0, lastAutoShipAt: null }, agents: { activeAgents: 0, agentProductivity: 1.0, lastAgentUpdate: null } }
    if (!state.systems.shipping) state.systems.shipping = { auto: false, bufferedLoc: 0, lastShipAt: null, automationLevel: 0, lastAutoShipAt: null }
    if (!state.systems.agents) state.systems.agents = { activeAgents: 0, agentProductivity: 1.0, lastAgentUpdate: null }

    // Ensure shipping fields
    if (state.systems.shipping.automationLevel === undefined) state.systems.shipping.automationLevel = 0
    if (state.systems.shipping.lastAutoShipAt === undefined) state.systems.shipping.lastAutoShipAt = null
    if (state.systems.shipping.bufferedLoc === undefined || isNaN(state.systems.shipping.bufferedLoc)) state.systems.shipping.bufferedLoc = 0

    // Ensure agent fields
    if (state.systems.agents.activeAgents === undefined) state.systems.agents.activeAgents = 0
    if (state.systems.agents.agentProductivity === undefined) state.systems.agents.agentProductivity = 1.0
    if (state.systems.agents.lastAgentUpdate === undefined) state.systems.agents.lastAgentUpdate = null

    // Ensure new stats exist
    if (state.stats.bug_rate === undefined) state.stats.bug_rate = 1.0
    if (state.stats.code_quality === undefined) state.stats.code_quality = 1.0
    if (state.stats.test_coverage === undefined) state.stats.test_coverage = 1.0
    if (state.stats.compile_speed === undefined) state.stats.compile_speed = 1.0
    if (state.stats.refactor_bonus === undefined) state.stats.refactor_bonus = 0.0
    if (state.stats.tech_debt_growth === undefined) state.stats.tech_debt_growth = 1.0

    // Agent specialization stats
    if (state.stats.qa_agents === undefined) state.stats.qa_agents = 0
    if (state.stats.devops_agents === undefined) state.stats.devops_agents = 0

    // Future stats initialization space
  }),
})
