import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { enableMapSet } from 'immer'
import { createResourcesSlice, ResourcesSlice } from './resourcesSlice'
import { createTimersSlice, TimersSlice } from './timersSlice'
import { createTechSlice, TechSlice } from './techSlice'
import { createUiSlice, UiSlice } from './uiSlice'

// Enable MapSet plugin for Immer to handle Sets
enableMapSet()

export type StoreState = ResourcesSlice & TimersSlice & TechSlice & UiSlice

export const useStore = create<StoreState>()(immer((set, get) => ({
  ...createResourcesSlice(set, get),
  ...createTimersSlice(set, get),
  ...createTechSlice(set, get),
  ...createUiSlice(set, get),
})))

// Convenience for non-react modules
export const getStoreApi = () => ({ set: useStore.setState, get: useStore.getState })
