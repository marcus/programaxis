import React from 'react'
import { HUD } from './HUD'
import { TechTree } from './TechTree'
import { Milestones } from './Milestones'
import { clear } from 'idb-keyval'

export const App: React.FC = () => {
  const handleClearData = async () => {
    const confirmed = window.confirm(
      '⚠️ WARNING: This will permanently delete ALL your save data!\n\n' +
      'Your progress, purchased tech nodes, and revenue will be lost.\n\n' +
      'This action cannot be undone. Are you sure you want to continue?'
    )

    if (confirmed) {
      try {
        // Clear IndexedDB
        await clear()

        // Clear localStorage as well (just in case)
        localStorage.clear()

        // Reload the page to start fresh
        window.location.reload()
      } catch (error) {
        console.error('Failed to clear data:', error)
        alert('Failed to clear data. Please try again or manually clear your browser data.')
      }
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <img className="logo" src="/logo.png" alt="Programaxis logo" />
          <h1 className="sr-only">Programaxis</h1>
        </div>
        <span style={{ color: '#9bb1c9' }}>Build features, ship, grow revenue.</span>
      </header>
      <main className="main">
        <aside className="sidebar">
          <HUD />
        </aside>
        <section className="content">
          <TechTree />
        </section>
      </main>
      <footer className="footer">
        <span>v0.1 — Local save only • React + Vite • Zustand • IndexedDB</span>
        <button
          onClick={handleClearData}
          style={{
            marginLeft: '16px',
            padding: '4px 8px',
            fontSize: '11px',
            backgroundColor: '#f45b69',
            color: 'white',
            border: '1px solid #d14556',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          title="⚠️ Permanently delete all save data and restart the game"
        >
          🗑️ Clear Data
        </button>
      </footer>
    </div>
  )
}
