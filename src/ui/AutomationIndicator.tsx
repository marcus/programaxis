import React from 'react'
import { useStore } from '../state/store'

export const AutomationIndicator: React.FC = () => {
  const automationLevel = useStore(s => s.systems?.shipping?.automationLevel ?? 0)
  const manualShipAuto = useStore(s => s.systems?.shipping?.auto ?? false)

  if (automationLevel === 0 && !manualShipAuto) return null

  const getAutomationDescription = (level: number) => {
    if (level === 0) return 'Manual shipping only'
    const interval = Math.max(1000, 20000 / Math.pow(2, level - 1))
    const seconds = interval / 1000
    if (seconds < 2) return `Auto-ship every ${(seconds * 1000).toFixed(0)} ms`
    if (seconds < 60) return `Auto-ship every ${seconds.toFixed(1)} seconds`
    return `Auto-ship every ${(seconds / 60).toFixed(1)} minutes`
  }

  const getAutomationIcon = (level: number) => {
    if (level === 0) return '📦'
    if (level <= 2) return '🔄'
    if (level <= 4) return '⚡'
    return '🚀'
  }

  return (
    <div className="automation-indicator">
      <div className="automation-header">
        <h3>{getAutomationIcon(automationLevel)} Automation</h3>
        <div className="automation-level">
          Level {automationLevel}
        </div>
      </div>

      <div className="automation-description">
        {getAutomationDescription(automationLevel)}
      </div>

      <div className="automation-progress">
        <div className="progress-bar">
          <div
            className="progress-fill automation-progress-fill"
            style={{ width: `${Math.min(100, (automationLevel / 5) * 100)}%` }}
          />
        </div>
        <div className="progress-steps">
          {[0, 1, 2, 3, 4, 5].map(step => (
            <div
              key={step}
              className={`step-marker ${automationLevel >= step ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      {manualShipAuto && automationLevel === 0 && (
        <div className="manual-auto-notice">
          ⚠️ Manual auto-ship enabled
        </div>
      )}
    </div>
  )
}