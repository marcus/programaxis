import React from 'react'
import { useStore } from '../state/store'
import { Milestones } from './Milestones'
import { MilestoneProgress } from './MilestoneProgress'
import { AgentDashboard } from './AgentDashboard'
import { QualityIndicator } from './QualityIndicator'
import { CICDPipelineIndicator } from './CICDPipelineIndicator'
import { UpgradeIndicator } from './UpgradeIndicator'
import { actionAnimationSystem } from '../game/actionAnimationSystem'

function fmt(n: number, digits = 2) {
  if (!isFinite(n)) return '0'
  if (Math.abs(n) >= 1_000_000_000_000) return (n/1_000_000_000_000).toFixed(digits)+'T'
  if (Math.abs(n) >= 1_000_000_000) return (n/1_000_000_000).toFixed(digits)+'B'
  if (Math.abs(n) >= 1_000_000) return (n/1_000_000).toFixed(digits)+'M'
  if (Math.abs(n) >= 1_000) return (n/1_000).toFixed(digits)+'K'
  return n.toFixed(digits)
}

interface HUDProps {
  onQualityInfoClick?: () => void
}

export const HUD: React.FC<HUDProps> = ({ onQualityInfoClick }) => {
  const loc = useStore(s => s.resources.loc)
  const revenue = useStore(s => s.resources.revenue)
  const uiLocPerSec = useStore(s => s.resources.uiLocPerSec)
  const uiRevPerSec = useStore(s => s.resources.uiRevPerSec)
  const bufferedLoc = useStore(s => s.systems?.shipping?.bufferedLoc ?? 0)
  const autoShip = useStore(s => s.systems?.shipping?.auto ?? false)
  const shipAutomation = useStore(s => s.stats.ship_automation)
  const automationLevel = useStore(s => s.systems?.shipping?.automationLevel ?? 0)
  const lastAutoShipAt = useStore(s => s.systems?.shipping?.lastAutoShipAt)
  const onClick = useStore(s => s.click)
  const onShip = useStore(s => s.shipNow)

  const [isLightFlashing, setIsLightFlashing] = React.useState(false)
  const [lastKnownDeploy, setLastKnownDeploy] = React.useState(0)

  const caps = useStore(s => s.caps)

  const techDebt = useStore(s => s.resources?.techDebt ?? 0)
  const effectiveShipFraction = useStore(s => s.getEffectiveShipFraction?.() ?? (s.stats?.ship_fraction ?? 0.2))

  // Track automated deploys and trigger light flash
  React.useEffect(() => {
    if (lastAutoShipAt && lastAutoShipAt > lastKnownDeploy) {
      setLastKnownDeploy(lastAutoShipAt)

      // Only flash if deploys are slower than 1/second
      const interval = Math.max(1000, 20000 / Math.pow(2, automationLevel - 1))
      if (interval >= 1000 && automationLevel > 0) {
        setIsLightFlashing(true)
        setTimeout(() => setIsLightFlashing(false), 400) // Flash for 400ms
      }
    }
  }, [lastAutoShipAt, lastKnownDeploy, automationLevel])

  return (
    <div>
      <MilestoneProgress />
      <UpgradeIndicator />

      <div className="hud-grid">
        <div className="stat stat-loc">
          <div className="label">LoC</div>
          <div className="value">{fmt(loc)}</div>
          <div className="label">LoC/s {fmt(uiLocPerSec)}</div>
        </div>
        <div className="stat stat-revenue">
          <div className="label">Revenue</div>
          <div className="value">${fmt(revenue)}</div>
          <div className="label">Rev/s ${fmt(uiRevPerSec)}</div>
        </div>
        <div className="stat stat-buffered">
          <div className="label">Buffered LoC</div>
          <div className="value">{fmt(bufferedLoc)}</div>
          <div className="label">Ship {(effectiveShipFraction*100).toFixed(0)}% per action</div>
        </div>
        <div className={`stat ${techDebt > 0 ? 'stat-debt' : 'stat-agents'}`}>
          <div className="label">{techDebt > 0 ? 'Tech Debt' : 'Agents'}</div>
          <div className="value">{techDebt > 0 ? fmt(techDebt) : `${caps.agentConcurrencyCap} cap`}</div>
          <div className="label">{techDebt > 0 ? `${((techDebt/1000)*100).toFixed(0)}% ship penalty` : `${caps.parallelismCap} jobs`}</div>
        </div>
      </div>

      <div className="actions">
        <button
          className="tron-button write-code"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2

            actionAnimationSystem.triggerWriteCodeAnimation(
              { x: centerX, y: centerY },
              Math.min(1, (loc / 1000) * 0.1 + 0.5) // Intensity based on current LoC
            )

            onClick()
          }}
        >
          Write Code (+LoC)
        </button>
        <div className="deploy-button-container">
          <button
            className={`tron-button ship-build ${automationLevel > 0 || autoShip || shipAutomation > 0 ? 'automated' : ''}`}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const centerX = rect.left + rect.width / 2
              const centerY = rect.top + rect.height / 2

              actionAnimationSystem.triggerShipBuildAnimation(
                { x: centerX, y: centerY },
                Math.min(1, (bufferedLoc / 1000) * 0.2 + 0.3) // Intensity based on buffered LoC
              )

              onShip()
            }}
          >
            {automationLevel > 0 ? (
              <>
                <span className="cicd-indicator">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L4 7l8-5 8 5-8-5z" fill="currentColor" opacity="0.8"/>
                    <path d="M12 2v20l-2-6h4l-2 6z" fill="currentColor"/>
                    <path d="M10 16h4v2h-4z" fill="currentColor" opacity="0.6"/>
                    <path d="M8 7l4-5 4 5-2 2h-4l-2-2z" fill="currentColor" opacity="0.9"/>
                    <circle cx="7" cy="12" r="1.5" fill="#ff6b6b" opacity="0.8"/>
                    <circle cx="17" cy="12" r="1.5" fill="#ff6b6b" opacity="0.8"/>
                    <circle cx="6" cy="15" r="1" fill="#ffd93d" opacity="0.6"/>
                    <circle cx="18" cy="15" r="1" fill="#ffd93d" opacity="0.6"/>
                    <circle cx="5.5" cy="9" r="0.8" fill="#ff9ff3" opacity="0.5"/>
                    <circle cx="18.5" cy="9" r="0.8" fill="#ff9ff3" opacity="0.5"/>
                  </svg>
                </span>
                Manual Deploy
              </>
            ) : autoShip || shipAutomation > 0 ? (
              'Ship (Auto)'
            ) : (
              'Manual Deploy'
            )}
          </button>
          {(automationLevel > 0 || autoShip || shipAutomation > 0) && (
            <div className={`cicd-status-light ${automationLevel >= 5 ? 'high-frequency' : ''} ${isLightFlashing ? 'flashing' : ''}`}></div>
          )}
        </div>
      </div>

      <AgentDashboard />
      <QualityIndicator onInfoClick={onQualityInfoClick} />
      <CICDPipelineIndicator />

      <Milestones compact />
    </div>
  )
}
