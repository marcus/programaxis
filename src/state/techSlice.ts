import type { StateCreator } from 'zustand'
import techTree from '../../context/tech-tree.json'
import type { ResourcesSlice, StatsState } from './resourcesSlice'

export type EffectType = 'add' | 'mul' | 'cap' | 'unlock' | 'toggle'
export interface Effect { stat: string; type: EffectType; value: any; display?: string }
export interface TechNode { id: string; tier: number; name: string; baseCost: number; costCurve: string; requires?: { node: string }[]; effects: Effect[] }
export interface Branch { key: string; name: string; nodes: TechNode[] }

export interface TechSlice {
  nodeById: Record<string, TechNode>
  nodeToBranch: Record<string, string>
  purchased: Record<string, number>
  unlocked: Set<string>
  discounts: Record<string, number> // per-branch cost multiplier
  canBuy: (nodeId: string) => boolean
  buyNode: (nodeId: string) => void
}

function ensureStat(stats: StatsState, key: keyof StatsState, defaultVal: any) {
  if (stats[key] === undefined || stats[key] === null) (stats as any)[key] = defaultVal
}

export const createTechSlice: StateCreator<ResourcesSlice & TechSlice, [], [], TechSlice> = (set, get) => {
  const branches = (techTree as any).branches as Branch[]
  const nodeById: Record<string, TechNode> = {}
  const nodeToBranch: Record<string, string> = {}
  const unlocked = new Set<string>()

  for (const br of branches) {
    for (const n of br.nodes) {
      nodeById[n.id] = n
      nodeToBranch[n.id] = br.key
    }
    // Unlock tier 0 for each branch (free)
    const tier0 = br.nodes.find(n => n.tier === 0)
    if (tier0) unlocked.add(tier0.id)
  }

  return {
    nodeById,
    nodeToBranch,
    purchased: {},
    unlocked,
    discounts: {},
    canBuy: (nodeId: string) => {
      const s = get()
      const node = s.nodeById[nodeId]
      if (!node) return false
      if (s.purchased[nodeId]) return false
      if (!s.unlocked.has(nodeId)) return false
      // Requires previous tier in branch
      const branchKey = s.nodeToBranch[nodeId]
      const branchNodes = (techTree as any).branches.find((b: Branch) => b.key === branchKey)!.nodes
      const prev = branchNodes.find(n => n.tier === node.tier - 1)
      if (prev && !s.purchased[prev.id]) return false
      // Requires dependencies
      if (node.requires && node.requires.some(r => !s.purchased[r.node])) return false
      // Cost check
      const disc = s.discounts[branchKey] ?? 1
      const cost = node.baseCost * disc
      return s.resources.revenue >= cost
    },
    buyNode: (nodeId: string) => set(state => {
      const node = state.nodeById[nodeId]
      if (!node) return
      const branchKey = state.nodeToBranch[nodeId]
      const cost = node.baseCost * (state.discounts[branchKey] ?? 1)
      if (state.resources.revenue < cost) return
      if (state.purchased[nodeId]) return

      // Pay cost
      state.resources.revenue -= cost

      // Mark purchased
      state.purchased[nodeId] = 1

      // Unlock next tier if requirements will be met later; we re-evaluate unlocks below as well
      const branchNodes = (techTree as any).branches.find((b: Branch) => b.key === branchKey)!.nodes
      const next = branchNodes.find(n => n.tier === node.tier + 1)
      if (next) state.unlocked.add(next.id)

      // Apply effects
      for (const ef of node.effects || []) {
        const key = ef.stat as keyof StatsState
        switch (ef.type) {
          case 'add': {
            ensureStat(state.stats, key, 0)
            ;(state.stats as any)[key] += ef.value
            break
          }
          case 'mul': {
            ensureStat(state.stats, key, 1)
            ;(state.stats as any)[key] *= ef.value
            break
          }
          case 'cap': {
            // caps live in caps, some caps also stored in stats for reference
            if (key in state.caps) {
              ;(state.caps as any)[key] = Math.max((state.caps as any)[key] || 0, ef.value)
            } else {
              ensureStat(state.stats, key, 0)
              ;(state.stats as any)[key] = Math.max((state.stats as any)[key] || 0, ef.value)
            }
            break
          }
          case 'unlock': {
            // Could toggle features; mark as stat flag
            ;(state.stats as any)[key] = ef.value
            break
          }
          case 'toggle': {
            ;(state.stats as any)[key] = !!ef.value
            break
          }
        }
      }

      // Recompute unlocks: any node whose prev tier purchased and requires satisfied becomes unlocked
      for (const br of (techTree as any).branches as Branch[]) {
        for (const n of br.nodes) {
          if (state.purchased[n.id]) continue
          const prev = br.nodes.find(x => x.tier === n.tier - 1)
          const prevOk = !prev || !!state.purchased[prev.id]
          const reqOk = !n.requires || n.requires.every(r => !!state.purchased[r.node])
          if (prevOk && reqOk) state.unlocked.add(n.id)
        }
      }
    }),
  }
}
