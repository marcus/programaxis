import React, { useState, useEffect } from 'react'
import { useStore } from '../state/store'

export const CICDPipelineIndicator: React.FC = () => {
  const automationLevel = useStore(s => s.systems?.shipping?.automationLevel ?? 0)
  const manualShipAuto = useStore(s => s.systems?.shipping?.auto ?? false)
  const lastAutoShipAt = useStore(s => s.systems?.shipping?.lastAutoShipAt)
  const [timeUntilNext, setTimeUntilNext] = useState(0)
  const [pipelineState, setPipelineState] = useState<'idle' | 'building' | 'deploying' | 'success'>('idle')
  const [isFlashing, setIsFlashing] = useState(false)
  const [lastKnownDeployTime, setLastKnownDeployTime] = useState(0)

  const getDeployFrequency = (level: number) => {
    if (level === 0) return { interval: 0, description: 'Manual Deploy Only' }
    const interval = Math.max(1000, 20000 / Math.pow(2, level - 1))
    const seconds = interval / 1000
    if (seconds < 2) return { interval, description: `Deploy every ${(seconds * 1000).toFixed(0)}ms` }
    if (seconds < 60) return { interval, description: `Deploy every ${seconds.toFixed(1)}s` }
    return { interval, description: `Deploy every ${(seconds / 60).toFixed(1)}m` }
  }

  const getPipelineIcon = (level: number) => {
    if (level === 0) return '📦'
    if (level === 1) return '🔄'
    if (level <= 3) return '⚡'
    return '🚀'
  }

  const getPipelineStatus = (level: number) => {
    if (level === 0) return 'Manual'
    if (level === 1) return 'Basic CI'
    if (level <= 3) return 'CI/CD'
    return 'Zero-Downtime'
  }

  useEffect(() => {
    if (automationLevel === 0 && !manualShipAuto) return

    const interval = setInterval(() => {
      const now = Date.now()
      const { interval: deployInterval } = getDeployFrequency(automationLevel)

      if (deployInterval === 0) {
        setTimeUntilNext(0)
        setPipelineState('idle')
        return
      }

      if (lastAutoShipAt) {
        const timeSinceLastDeploy = now - lastAutoShipAt
        const timeUntilNextDeploy = Math.max(0, deployInterval - timeSinceLastDeploy)

        setTimeUntilNext(timeUntilNextDeploy)

        // Detect new automated deploy and trigger flash
        if (lastAutoShipAt > lastKnownDeployTime) {
          setLastKnownDeployTime(lastAutoShipAt)

          // Only flash if deploys are slower than 1/second (1000ms interval)
          if (deployInterval >= 1000) {
            setIsFlashing(true)
            setTimeout(() => setIsFlashing(false), 500) // Flash for 500ms
          }
        }
      } else {
        // No deploys yet, show full countdown
        setTimeUntilNext(deployInterval)
      }

      // Simulate pipeline states
      if (timeUntilNext === 0) {
        setPipelineState('success')
      } else if (timeUntilNext < deployInterval * 0.3) {
        setPipelineState('deploying')
      } else if (timeUntilNext < deployInterval * 0.7) {
        setPipelineState('building')
      } else {
        setPipelineState('idle')
      }
    }, 100)

    return () => clearInterval(interval)
  }, [automationLevel, manualShipAuto, lastAutoShipAt, lastKnownDeployTime])

  if (automationLevel === 0 && !manualShipAuto) return null

  const { description } = getDeployFrequency(automationLevel)
  const statusIcon = getPipelineIcon(automationLevel)
  const statusText = getPipelineStatus(automationLevel)

  const getPipelineStateIcon = () => {
    switch (pipelineState) {
      case 'building': return '🔨'
      case 'deploying': return '🚀'
      case 'success': return '✅'
      default: return '⏳'
    }
  }

  const getPipelineStateText = () => {
    switch (pipelineState) {
      case 'building': return 'Building...'
      case 'deploying': return 'Deploying...'
      case 'success': return 'Deployed!'
      default: return 'Waiting...'
    }
  }

  const { interval: deployInterval } = getDeployFrequency(automationLevel)
  const isHighFrequency = deployInterval < 1000 && deployInterval > 0

  return (
    <div className={`cicd-pipeline-indicator ${isFlashing ? 'flashing' : ''} ${isHighFrequency ? 'high-frequency' : ''}`}>
      <div className="pipeline-header">
        <h3>{statusIcon} {statusText} Pipeline</h3>
        <div className="pipeline-level">
          Level {automationLevel}
        </div>
      </div>

      <div className="pipeline-description">
        {description}
      </div>

      {(automationLevel > 0 || manualShipAuto) && (
        <div className="pipeline-status">
          <div className="status-row">
            <span className="status-icon">{getPipelineStateIcon()}</span>
            <span className="status-text">{getPipelineStateText()}</span>
            {timeUntilNext > 0 && (
              <span className="countdown">
                {timeUntilNext > 1000 ? `${(timeUntilNext / 1000).toFixed(1)}s` : `${timeUntilNext.toFixed(0)}ms`}
              </span>
            )}
          </div>

          <div className="progress-bar">
            <div
              className={`progress-fill pipeline-progress-fill ${pipelineState}`}
              style={{
                width: timeUntilNext > 0
                  ? `${100 - (timeUntilNext / getDeployFrequency(automationLevel).interval) * 100}%`
                  : '100%'
              }}
            />
          </div>
        </div>
      )}

      <div className="pipeline-progress">
        <div className="progress-steps">
          {[0, 1, 2, 4, 8].map(step => (
            <div
              key={step}
              className={`step-marker ${automationLevel >= step ? 'active' : ''}`}
              title={step === 0 ? 'Manual' : `Level ${step}`}
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