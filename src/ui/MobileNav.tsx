import React from 'react'

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
        <span className="mobile-nav-icon">📊</span>
        <span className="mobile-nav-label">Stats</span>
      </button>
      <button
        className={`mobile-nav-tab ${activeTab === 'tech-tree' ? 'active' : ''}`}
        onClick={() => onTabChange('tech-tree')}
        aria-label="View and purchase tech nodes"
      >
        <span className="mobile-nav-icon">🌳</span>
        <span className="mobile-nav-label">Tech Tree</span>
      </button>
    </nav>
  )
}