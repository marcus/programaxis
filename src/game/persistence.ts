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
  }
  await set(SAVE_KEY, snapshot)
  useStore.setState(state => { state.timers.lastSavedAt = Date.now() })
}

export async function loadAndHydrate() {
  const saved: any = await get(SAVE_KEY)
  if (saved) {
    useStore.setState(state => {
      state.resources = saved.resources || state.resources
      state.systems = saved.systems || state.systems
      state.caps = saved.caps || state.caps
      state.stats = { ...state.stats, ...(saved.stats || {}) }
      state.purchased = saved.purchased || {}
      state.unlocked = new Set<string>(saved.unlocked || Array.from(state.unlocked))
      state.discounts = saved.discounts || {}
      state.timers = saved.timers || state.timers
      state.milestones = saved.milestones || state.milestones
    })

    // Offline credit
    const s = useStore.getState()
    const now = Date.now()
    const last = s.timers.lastSavedAt || now
    const elapsedMs = Math.max(0, now - last)
    const capMs = (s.timers.offlineCapHours || 8) * 3600_000
    const ms = Math.min(elapsedMs, capMs)
    const dt = ms / 1000
    if (dt > 0) {
      const locRate = (s.stats.idle_loc_per_sec || 0) * (s.stats.focus_multiplier || 1) * (s.stats.global_multiplier || 1)
      const offlineLoc = locRate * dt
      useStore.getState().addLoc(offlineLoc)

      // Approximate auto-shipping offline
      const frac = (s.stats.ship_fraction || 0)
      const revPerLoc = (s.stats.revenue_per_loc || 0.05) * (s.stats.revenue_multiplier || 1) * (s.stats.features_multiplier || 1) * (s.stats.price_premium || 1) * (s.stats.market_expansion || 1) * (s.stats.global_multiplier || 1)
      const auto = s.systems.shipping.auto || (s.stats.ship_automation || 0) > 0
      if (auto) {
        const shipped = offlineLoc * frac
        useStore.getState().addRevenue(shipped * revPerLoc)
        useStore.setState(state => { state.systems.shipping.bufferedLoc += (offlineLoc - shipped) })
      }
    }
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
