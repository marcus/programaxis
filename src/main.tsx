import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './ui/App'
import { startGameLoop } from './game/loop'
import { useStore, getStoreApi } from './state/store'
import { loadAndHydrate, scheduleAutosave } from './game/persistence'

async function boot() {
  // Render immediately; hydrate state once loaded.
  const rootEl = document.getElementById('root')!
  const root = createRoot(rootEl)
  root.render(<App />)

  await loadAndHydrate()

  // Ensure state is properly initialized (handles both new games and migrated saves)
  useStore.getState().ensureProperState()

  // Start main loop and autosave
  startGameLoop()
  scheduleAutosave()
}

boot()
