import type { StateCreator } from 'zustand'

export interface UiSlice {
  ui: {
    showDependencyGraph: boolean
    showIntroModal: boolean
    hasSeenIntro: boolean
    recentAchievement?: { id: string; timestamp: number }
  }
  toggleDependencyGraph: () => void
  showIntro: () => void
  hideIntro: () => void
  markIntroAsSeen: () => void
  setRecentAchievement: (milestoneId: string) => void
  clearRecentAchievement: () => void
}

export const createUiSlice: StateCreator<UiSlice, [], [], UiSlice> = (set, get) => ({
  ui: {
    showDependencyGraph: false,
    showIntroModal: false,
    hasSeenIntro: false,
    recentAchievement: undefined,
  },
  toggleDependencyGraph: () => set(state => {
    state.ui.showDependencyGraph = !state.ui.showDependencyGraph
  }),
  showIntro: () => set(state => {
    state.ui.showIntroModal = true
  }),
  hideIntro: () => set(state => {
    state.ui.showIntroModal = false
  }),
  markIntroAsSeen: () => set(state => {
    state.ui.hasSeenIntro = true
    state.ui.showIntroModal = false
  }),
  setRecentAchievement: (milestoneId: string) => set(state => {
    state.ui.recentAchievement = { id: milestoneId, timestamp: Date.now() }
  }),
  clearRecentAchievement: () => set(state => {
    state.ui.recentAchievement = undefined
  }),
})