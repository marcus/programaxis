import { useStore } from '../state/store'
import { checkMilestones } from './progression'

let timer: number | null = null

export function startGameLoop() {
  if (timer) return
  const get = useStore.getState
  const set = useStore.setState
  const tickMs = get().timers.tickMs

  timer = window.setInterval(() => {
    const s = get()
    const dt = s.timers.tickMs / 1000

    // Idle LoC generation
    const locDelta = (s.stats.idle_loc_per_sec || 0) * (s.stats.focus_multiplier || 1) * (s.stats.global_multiplier || 1) * dt
    s.addLoc(locDelta)

    // Passive revenue if any
    const passiveRev = (s.stats.passive_rev_per_sec || 0) * dt
    if (passiveRev > 0) s.addRevenue(passiveRev)

    // Auto-ship if enabled
    let shipRev = 0
    const autoShip = s.systems.shipping.auto || (s.stats.ship_automation || 0) > 0
    if (autoShip) shipRev = s.shipNow()

    // Update UI rates
    s.recomputeUiRates(dt, locDelta, passiveRev + shipRev)

    // Milestones
    checkMilestones()

    s.setLastTickAt(Date.now())
  }, tickMs) as unknown as number
}

export function stopGameLoop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}
