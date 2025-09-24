import type { StateCreator } from 'zustand'

export interface UiSlice {
  ui: {
    showDependencyGraph: boolean
    showIntroModal: boolean
    hasSeenIntro: boolean
  }
  toggleDependencyGraph: () => void
  showIntro: () => void
  hideIntro: () => void
  markIntroAsSeen: () => void
}

export const createUiSlice: StateCreator<UiSlice, [], [], UiSlice> = (set, get) => ({
  ui: {
    showDependencyGraph: false,
    showIntroModal: false,
    hasSeenIntro: false,
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
})