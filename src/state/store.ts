import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createResourcesSlice, ResourcesSlice } from './resourcesSlice'
import { createTimersSlice, TimersSlice } from './timersSlice'
import { createTechSlice, TechSlice } from './techSlice'

export type StoreState = ResourcesSlice & TimersSlice & TechSlice

export const useStore = create<StoreState>()(immer((set, get) => ({
  ...createResourcesSlice(set, get),
  ...createTimersSlice(set, get),
  ...createTechSlice(set, get),
})))

// Convenience for non-react modules
export const getStoreApi = () => ({ set: useStore.setState, get: useStore.getState })
