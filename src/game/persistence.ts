import { set, get } from 'idb-keyval'
import { useStore } from '../state/store'

const SAVE_KEY = 'programaxis_save_v1'

export async function saveNow() {
  const s = useStore.getState()
  const snapshot = {
    meta: { schemaVersion: 1, gameVersion: 1, lastSavedAt: Date.now() },
    resources: s.resources,
    systems: s.systems,
    caps: s.caps,
    stats: s.stats,
    purchased: s.purchased,
    unlocked: Array.from(s.unlocked),
    discounts: s.discounts,
    timers: s.timers,
    milestones: s.milestones,
    ui: s.ui,
  }
  await set(SAVE_KEY, snapshot)
  useStore.setState(state => { state.timers.lastSavedAt = Date.now() })
}

export async function loadAndHydrate() {
  const saved: any = await get(SAVE_KEY)

  // Validate save data - if tier 0 nodes are purchased but revenue is very low, consider it corrupt
  if (saved && saved.purchased) {
    const tier0Purchased = Object.keys(saved.purchased).filter(id => id.endsWith('0')).length
    const revenue = saved.resources?.revenue || 0

    // If all 8 tier 0 nodes are purchased but revenue is less than $10, the save is likely corrupt
    if (tier0Purchased >= 8 && revenue < 10) {
      console.warn('Detected corrupt save data - tier 0 nodes purchased with insufficient revenue. Starting fresh.')
      await del(SAVE_KEY)
      return
    }
  }

  if (saved) {
    useStore.setState(state => {
      // Migrate resources - add new fields if missing
      state.resources = {
        ...state.resources,
        ...(saved.resources || {}),
        techDebt: saved.resources?.techDebt ?? 0
      }

      // Migrate systems - ensure agents system exists
      const savedSystems = saved.systems || {}
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

      state.caps = saved.caps || state.caps

      // Migrate stats - add new quality/process stats
      state.stats = {
        ...state.stats,
        ...(saved.stats || {}),
        // Ensure new stats exist with defaults
        bug_rate: saved.stats?.bug_rate ?? 1.0,
        code_quality: saved.stats?.code_quality ?? 1.0,
        test_coverage: saved.stats?.test_coverage ?? 1.0,
        compile_speed: saved.stats?.compile_speed ?? 1.0,
        refactor_bonus: saved.stats?.refactor_bonus ?? 0.0,
        tech_debt_growth: saved.stats?.tech_debt_growth ?? 1.0
      }

      state.purchased = saved.purchased || {}
      state.unlocked = new Set<string>(saved.unlocked || Array.from(state.unlocked))
      state.discounts = saved.discounts || {}
      state.timers = saved.timers || state.timers
      state.milestones = saved.milestones || state.milestones

      // Migrate UI state - preserve intro status if exists
      state.ui = {
        ...state.ui,
        ...(saved.ui || {}),
        // If no saved UI state, this is a new player - show intro
        showIntroModal: !saved.ui,
        hasSeenIntro: saved.ui?.hasSeenIntro ?? false
      }
    })

    // Ensure all required properties exist after load
    useStore.getState().ensureProperState()

    // Offline credit
    const s = useStore.getState()
    const now = Date.now()
    const last = s.timers.lastSavedAt || now
    const elapsedMs = Math.max(0, now - last)
    const capMs = (s.timers.offlineCapHours || 8) * 3600_000
    const ms = Math.min(elapsedMs, capMs)
    const dt = ms / 1000
    if (dt > 0) {
      // Calculate offline LoC generation (base + agents)
      const baseLocRate = (s.stats.idle_loc_per_sec || 0) * (s.stats.global_multiplier || 1)
      const agentLocRate = (s.systems?.agents?.activeAgents || 0) * 0.5 * (s.systems?.agents?.agentProductivity || 1) * (s.stats.global_multiplier || 1)
      const totalLocRate = baseLocRate + agentLocRate
      const offlineLoc = totalLocRate * dt
      useStore.getState().addLoc(offlineLoc)

      // Approximate auto-shipping offline
      const techDebtPenalty = Math.max(0, 1 - ((s.resources?.techDebt || 0) / 1000))
      const frac = (s.stats.ship_fraction || 0) * techDebtPenalty * (s.stats.test_coverage || 1)
      const qualityMultiplier = s.stats.code_quality || 1
      const bugPenalty = 2 - (s.stats.bug_rate || 1)
      const revPerLoc = (s.stats.revenue_per_loc || 0.05) * qualityMultiplier * bugPenalty *
                       (s.stats.revenue_multiplier || 1) * (s.stats.features_multiplier || 1) *
                       (s.stats.price_premium || 1) * (s.stats.market_expansion || 1) * (s.stats.global_multiplier || 1)

      const auto = (s.systems?.shipping?.auto === true) || ((s.systems?.shipping?.automationLevel || 0) > 0)
      if (auto) {
        const shipped = offlineLoc * frac
        const offlineRevenue = shipped * revPerLoc + (s.stats.passive_rev_per_sec || 0) * dt
        useStore.getState().addRevenue(offlineRevenue)
        useStore.setState(state => { state.systems.shipping.bufferedLoc += (offlineLoc - shipped) })
      }
    }
  } else {
    // No saved data - this is a completely new player
    useStore.setState(state => {
      state.ui.showIntroModal = true
      state.ui.hasSeenIntro = false
    })
  }
}

export function scheduleAutosave() {
  // Save every 3 seconds instead of 10
  setInterval(() => { saveNow() }, 3_000)

  // Save when tab becomes hidden (user switches tab/closes browser)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveNow()
  })

  // Save before page unload
  window.addEventListener('beforeunload', () => {
    saveNow()
  })

  // Save when page regains focus (in case user comes back)
  window.addEventListener('focus', () => {
    saveNow()
  })
}
