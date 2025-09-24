import React from 'react'
import { StatsIcon, TechTreeIcon } from './MobileNavIcons'

interface MobileNavProps {
  activeTab: 'hud' | 'tech-tree'
  onTabChange: (tab: 'hud' | 'tech-tree') => void
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="mobile-nav">
      <button
        className={`mobile-nav-tab ${activeTab === 'hud' ? 'active' : ''}`}
        onClick={() => onTabChange('hud')}
        aria-label="View game stats and actions"
      >
        <StatsIcon className="mobile-nav-icon" />
        <span className="mobile-nav-label">Stats</span>
      </button>
      <button
        className={`mobile-nav-tab ${activeTab === 'tech-tree' ? 'active' : ''}`}
        onClick={() => onTabChange('tech-tree')}
        aria-label="View and purchase tech nodes"
      >
        <TechTreeIcon className="mobile-nav-icon" />
        <span className="mobile-nav-label">Tech Tree</span>
      </button>
    </nav>
  )
}