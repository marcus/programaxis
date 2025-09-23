import type { StateCreator } from 'zustand'

export interface TimersSlice {
  timers: {
    tickMs: number
    lastTickAt: number | null
    lastSavedAt: number | null
    offlineCapHours: number
  }
  setLastSavedAt: (ts: number) => void
  setLastTickAt: (ts: number) => void
}

export const createTimersSlice: StateCreator<TimersSlice, [], [], TimersSlice> = (set) => ({
  timers: {
    tickMs: 250,
    lastTickAt: null,
    lastSavedAt: Date.now(),
    offlineCapHours: 8,
  },
  setLastSavedAt: (ts: number) => set(state => { state.timers.lastSavedAt = ts }),
  setLastTickAt: (ts: number) => set(state => { state.timers.lastTickAt = ts }),
})
