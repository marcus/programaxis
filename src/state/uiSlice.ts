import type { StateCreator } from 'zustand'

export interface UiSlice {
  ui: {
    showDependencyGraph: boolean
  }
  toggleDependencyGraph: () => void
}

export const createUiSlice: StateCreator<UiSlice, [], [], UiSlice> = (set, get) => ({
  ui: {
    showDependencyGraph: false,
  },
  toggleDependencyGraph: () => set(state => {
    state.ui.showDependencyGraph = !state.ui.showDependencyGraph
  }),
})