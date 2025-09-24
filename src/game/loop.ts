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

    // Update agent system (if method exists)
    if (s.updateAgents) {
      s.updateAgents()
    }

    // Idle LoC generation (base + agents)
    const baseIdleLoc = (s.stats.idle_loc_per_sec || 0) * (s.stats.global_multiplier || 1)
    const agentLoc = s.getAgentLocPerSec ? s.getAgentLocPerSec() : 0
    const totalLocDelta = (baseIdleLoc + agentLoc) * dt
    s.addLoc(totalLocDelta)

    // Tech debt accumulation (if techDebt exists)
    const debtGrowth = (s.stats.tech_debt_growth || 1) * dt * 0.1
    if (s.resources.techDebt !== undefined) {
      set(state => {
        if (state.resources.techDebt !== undefined) {
          state.resources.techDebt += debtGrowth
        }
      })
    }

    // Refactor bonus (convert some tech debt to LoC)
    const refactorBonus = (s.stats.refactor_bonus || 0) * dt
    if (refactorBonus > 0 && (s.resources.techDebt || 0) > 0) {
      const debtToConvert = Math.min(s.resources.techDebt || 0, refactorBonus)
      set(state => {
        if (state.resources.techDebt !== undefined) {
          state.resources.techDebt -= debtToConvert
          state.resources.loc += debtToConvert * 0.5 // Convert debt to LoC at reduced rate
        }
      })
    }

    // Passive revenue if any
    const passiveRev = (s.stats.passive_rev_per_sec || 0) * dt
    if (passiveRev > 0) s.addRevenue(passiveRev)

    // Automated shipping based on automation level
    let shipRev = 0
    const autoLevel = s.systems?.shipping?.automationLevel || 0
    const manualAuto = s.systems?.shipping?.auto || (s.stats.ship_automation || 0) > 0
    const now = Date.now()
    const lastAutoShip = s.systems?.shipping?.lastAutoShipAt || 0

    let shouldAutoShip = manualAuto
    if (autoLevel > 0) {
      const interval = Math.max(1000, 20000 / Math.pow(2, autoLevel - 1)) // 20s, 10s, 5s, 2.5s, 1.25s...
      shouldAutoShip = shouldAutoShip || (now - lastAutoShip) >= interval
    }

    if (shouldAutoShip) {
      shipRev = s.shipNow()
      if (s.systems?.shipping) {
        set(state => {
          if (state.systems?.shipping) {
            state.systems.shipping.lastAutoShipAt = now
          }
        })
      }
    }

    // Update UI rates
    s.recomputeUiRates(dt, totalLocDelta, passiveRev + shipRev)

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
