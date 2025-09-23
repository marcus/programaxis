import { useStore } from '../state/store'
import { saveNow } from './persistence'

export interface MilestoneDef {
  id: string
  threshold: number
  title: string
  short?: string
  apply: () => void
}

export const milestones: MilestoneDef[] = [
  { id: 'M_0', threshold: 0, title: 'Starving Artist', short: 'Start', apply: () => {
    // No bonus for starting milestone, just recognition
  }},
  { id: 'M_1K', threshold: 1_000, title: 'First Sale', short: '$1K', apply: () => {
    useStore.setState(state => { state.stats.ship_automation = (state.stats.ship_automation || 0) + 1 })
  }},
  { id: 'M_10K', threshold: 10_000, title: 'Micro-Studio (+5% global dev velocity)', short: '$10K', apply: () => {
    useStore.setState(state => { state.stats.global_multiplier = (state.stats.global_multiplier || 1) * 1.05 })
  }},
  { id: 'M_100K', threshold: 100_000, title: 'Tooling Pays Off (Editor path −10%)', short: '$100K', apply: () => {
    useStore.setState(state => { state.discounts['B'] = (state.discounts['B'] ?? 1) * 0.9 })
  }},
  { id: 'M_1M', threshold: 1_000_000, title: 'Indie Darling (Unlock Agents tier 1)', short: '$1M', apply: () => {
    useStore.setState(state => { state.unlocked.add('E1') })
  }},
  { id: 'M_10M', threshold: 10_000_000, title: 'Live-Ops On (Platforms −10%)', short: '$10M', apply: () => {
    useStore.setState(state => { state.discounts['G'] = (state.discounts['G'] ?? 1) * 0.9 })
  }},
  { id: 'M_100M', threshold: 100_000_000, title: 'Brand Found (Marketing passive Rev/s +0.5)', short: '$100M', apply: () => {
    useStore.setState(state => { state.stats.passive_rev_per_sec = (state.stats.passive_rev_per_sec || 0) + 0.5 })
  }},
  { id: 'M_1B', threshold: 1_000_000_000, title: 'Global Hit (+1 concurrent job)', short: '$1B', apply: () => {
    useStore.setState(state => { state.caps.parallelismCap = (state.caps.parallelismCap || 0) + 1 })
  }},
  { id: 'M_10B', threshold: 10_000_000_000, title: 'Studio Group (Agents cap +25%)', short: '$10B', apply: () => {
    useStore.setState(state => { state.caps.agentConcurrencyCap = Math.max(state.caps.agentConcurrencyCap, Math.floor((state.caps.agentConcurrencyCap || 0) * 1.25) || 1) })
  }},
  { id: 'M_100B', threshold: 100_000_000_000, title: 'Platform Owner (Feature prices +10%)', short: '$100B', apply: () => {
    useStore.setState(state => { state.stats.revenue_per_loc = (state.stats.revenue_per_loc || 0.05) * 1.1 })
  }},
  { id: 'M_1T', threshold: 1_000_000_000_000, title: 'Cultural Monopoly (unlock Superintelligence gate)', short: '$1T', apply: () => {
    // Represented as a flag; tech requires still apply normally
    useStore.setState(state => { (state.stats as any)['superintelligence_gate'] = true })
  }},
  { id: 'M_10T', threshold: 10_000_000_000_000, title: 'Reality Architect (+1 Insight)', short: '$10T', apply: () => {
    useStore.setState(state => { (state as any).prestige = { ...(state as any).prestige, insight: ((state as any).prestige?.insight || 0) + 1 } })
  }},
]

export function checkMilestones() {
  const s = useStore.getState()
  const reached = new Set(s.milestones.reached.map(r => r.id))
  let anyNewMilestones = false

  for (const m of milestones) {
    if (!reached.has(m.id) && s.resources.lifetimeRevenue >= m.threshold) {
      m.apply()
      useStore.setState(state => { state.milestones.reached.push({ id: m.id, time: Date.now() }) })
      anyNewMilestones = true
    }
  }

  // Save immediately when milestones are reached
  if (anyNewMilestones) {
    saveNow().catch(console.error)
  }
}
