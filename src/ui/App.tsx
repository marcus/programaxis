import React from 'react'
import { HUD } from './HUD'
import { TechTree } from './TechTree'
import { Milestones } from './Milestones'
import { TechPurchaseAnimation } from './TechPurchaseAnimation'
import { ActionButtonAnimation } from './ActionButtonAnimation'
import { AnimationTestPanel } from './AnimationTestPanel'
import { IntroModal } from './IntroModal'
import { useStore } from '../state/store'
import { clear, del, get } from 'idb-keyval'

// Set to true to enable animation testing panel
const ENABLE_ANIMATION_TESTING = false

export const App: React.FC = () => {
  // Subscribe to UI state for intro modal
  const showIntroModal = useStore(state => state.ui.showIntroModal)
  const markIntroAsSeen = useStore(state => state.markIntroAsSeen)
  const handleClearData = async () => {
    const confirmed = window.confirm(
      '⚠️ WARNING: This will permanently delete ALL your save data!\n\n' +
      'Your progress, purchased tech nodes, and revenue will be lost.\n\n' +
      'This action cannot be undone. Are you sure you want to continue?'
    )

    if (confirmed) {
      try {
        // Stop auto-save to prevent re-saving during clearing
        for (let i = 1; i < 10000; i++) {
          clearInterval(i)
        }

        // Clear specific save key first
        await del('programaxis_save_v1')

        // Clear all idb-keyval data
        await clear()

        // Clear localStorage
        localStorage.clear()

        // Clear sessionStorage
        sessionStorage.clear()

        // Clear all IndexedDB databases more aggressively
        if ('indexedDB' in window) {
          try {
            // Delete common database names
            const dbNames = ['keyval-store', 'programaxis', 'programaxis_save_v1']
            for (const dbName of dbNames) {
              try {
                const deleteReq = indexedDB.deleteDatabase(dbName)
                await new Promise((resolve, reject) => {
                  deleteReq.onsuccess = () => resolve(undefined)
                  deleteReq.onerror = () => reject(deleteReq.error)
                  deleteReq.onblocked = () => reject(new Error('Database deletion blocked'))
                })
              } catch (e) {
                // Ignore errors for databases that don't exist
              }
            }
          } catch (e) {
            console.warn('Could not clear some IndexedDB databases:', e)
          }
        }

        // Clear all cookies for this domain
        if (document.cookie) {
          document.cookie.split(";").forEach(cookie => {
            const eqPos = cookie.indexOf("=")
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
          })
        }

        // Wait longer to ensure all clearing completes
        await new Promise(resolve => setTimeout(resolve, 500))

        // Force reload without cache
        window.location.href = window.location.href
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
      <TechPurchaseAnimation />
      <ActionButtonAnimation />
      {ENABLE_ANIMATION_TESTING && <AnimationTestPanel />}
      <IntroModal
        isOpen={showIntroModal}
        onClose={markIntroAsSeen}
      />
    </div>
  )
}
