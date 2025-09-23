import React from 'react'
import { HUD } from './HUD'
import { TechTree } from './TechTree'
import { Milestones } from './Milestones'

export const App: React.FC = () => {
  return (
    <div className="app">
      <header className="header">
        <h1>Programaxis</h1>
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
        v0.1 — Local save only • React + Vite • Zustand • IndexedDB
      </footer>
    </div>
  )
}
