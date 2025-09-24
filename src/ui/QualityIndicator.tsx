import React, { useState } from 'react'
import { useStore } from '../state/store'
import { CodeHealthInfoModal } from './CodeHealthInfoModal'
import { actionAnimationSystem } from '../game/actionAnimationSystem'

function formatNumber(num: number, precision = 1): string {
  if (num >= 1000000) return (num / 1000000).toFixed(precision) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(precision) + 'K'
  return num.toFixed(precision)
}

function getQualityColor(quality: number): string {
  if (quality >= 2.0) return 'var(--accent)'
  if (quality >= 1.5) return '#4ade80'
  if (quality >= 1.2) return '#facc15'
  if (quality >= 1.0) return '#f97316'
  return '#ef4444'
}

function getBugFreeColor(bugFreeRate: number): string {
  if (bugFreeRate >= 0.7) return 'var(--accent)'
  if (bugFreeRate >= 0.5) return '#4ade80'
  if (bugFreeRate >= 0.3) return '#facc15'
  if (bugFreeRate >= 0.1) return '#f97316'
  return '#ef4444'
}

function getTechDebtColor(debt: number): string {
  if (debt >= 500) return '#ef4444'
  if (debt >= 200) return '#f97316'
  if (debt >= 100) return '#facc15'
  if (debt >= 50) return '#4ade80'
  return 'var(--accent)'
}

export const QualityIndicator: React.FC = () => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)

  const codeQuality = useStore(s => s.stats?.code_quality ?? 1.0)
  const bugRate = useStore(s => s.stats?.bug_rate ?? 1.0)
  const bugFreeRate = 1 - bugRate // Convert to bug-free percentage
  const testCoverage = useStore(s => s.stats?.test_coverage ?? 1.0)
  const techDebt = useStore(s => s.resources?.techDebt ?? 0)
  const payDownTechDebt = useStore(s => s.payDownTechDebt)
  const currentLoc = useStore(s => s.resources?.loc ?? 0)

  const debtCost = Math.ceil(Math.min(techDebt, currentLoc / 2) * 2)
  const debtReduction = Math.ceil(Math.min(techDebt, currentLoc / 2))

  return (
    <div className="quality-indicator">
      <div className="quality-header">
        <h3>📊 Code Health</h3>
        <button
          className="info-button"
          onClick={() => setIsInfoModalOpen(true)}
          title="Learn about code health mechanics"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 12V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="8" cy="5" r="1" fill="currentColor"/>
          </svg>
        </button>
      </div>

      <div className="quality-metrics">
        <div className="quality-metric">
          <div className="metric-row">
            <span className="metric-label">Quality:</span>
            <span
              className="metric-value"
              style={{ color: getQualityColor(codeQuality) }}
            >
              {codeQuality.toFixed(1)}x
            </span>
          </div>
          <div className="metric-bar">
            <div
              className="metric-fill"
              style={{
                width: `${Math.min(100, (codeQuality - 1) * 50)}%`,
                backgroundColor: getQualityColor(codeQuality)
              }}
            />
          </div>
        </div>

        <div className="quality-metric">
          <div className="metric-row">
            <span className="metric-label">Bug-Free:</span>
            <span
              className="metric-value"
              style={{ color: getBugFreeColor(bugFreeRate) }}
            >
              {(bugFreeRate * 100).toFixed(0)}%
            </span>
          </div>
          <div className="metric-bar">
            <div
              className="metric-fill"
              style={{
                width: `${bugFreeRate * 100}%`,
                backgroundColor: getBugFreeColor(bugFreeRate)
              }}
            />
          </div>
        </div>

        <div className="quality-metric">
          <div className="metric-row">
            <span className="metric-label">Test Coverage:</span>
            <span className="metric-value">
              {(testCoverage * 100).toFixed(0)}%
            </span>
          </div>
          <div className="metric-bar">
            <div
              className="metric-fill test-coverage-fill"
              style={{ width: `${Math.min(100, testCoverage * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {techDebt > 0 && (
        <div className="tech-debt-section">
          <div className="tech-debt-header">
            <span className="debt-label">Tech Debt:</span>
            <span
              className="debt-value"
              style={{ color: getTechDebtColor(techDebt) }}
            >
              {formatNumber(techDebt)}
            </span>
          </div>

          <div className="debt-impact">
            <span className="debt-penalty">
              Ship penalty: -{((techDebt / 1000) * 100).toFixed(1)}%
            </span>
          </div>

          {debtReduction > 0 && (
            <button
              className="tron-button debt-paydown-btn"
              onClick={(e) => {
                if (currentLoc < debtCost) return

                const rect = e.currentTarget.getBoundingClientRect()
                const centerX = rect.left + rect.width / 2
                const centerY = rect.top + rect.height / 2

                // Trigger animation first
                actionAnimationSystem.triggerPayDebtAnimation(
                  { x: centerX, y: centerY },
                  Math.min(1, (debtReduction / 500) + 0.2)
                )

                // Delay the state change to allow animation to start
                setTimeout(() => {
                  payDownTechDebt(debtReduction)
                }, 50) // Small delay to ensure animation starts before re-render
              }}
              disabled={currentLoc < debtCost}
            >
              Pay {formatNumber(debtCost)} LoC → -{formatNumber(debtReduction)} debt
            </button>
          )}
        </div>
      )}

      <CodeHealthInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  )
}