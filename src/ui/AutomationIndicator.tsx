import React from 'react'
import { useStore } from '../state/store'

export const AutomationIndicator: React.FC = () => {
  const automationLevel = useStore(s => s.systems?.shipping?.automationLevel ?? 0)
  const manualShipAuto = useStore(s => s.systems?.shipping?.auto ?? false)

  if (automationLevel === 0 && !manualShipAuto) return null

  const getAutomationDescription = (level: number) => {
    switch (level) {
      case 0: return 'Manual shipping only'
      case 1: return 'Auto-ship every 10 seconds'
      case 2: return 'Auto-ship every 5 seconds'
      case 3: return 'Auto-ship every 3.3 seconds'
      case 4: return 'Auto-ship every 2.5 seconds'
      default: return `Auto-ship every ${(10 / (1 + level)).toFixed(1)} seconds`
    }
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