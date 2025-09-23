import React from 'react'
import { useStore } from '../state/store'

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

function getBugRateColor(bugRate: number): string {
  if (bugRate <= 0.3) return 'var(--accent)'
  if (bugRate <= 0.5) return '#4ade80'
  if (bugRate <= 0.7) return '#facc15'
  if (bugRate <= 0.9) return '#f97316'
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
  const codeQuality = useStore(s => s.stats?.code_quality ?? 1.0)
  const bugRate = useStore(s => s.stats?.bug_rate ?? 1.0)
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
            <span className="metric-label">Bug Rate:</span>
            <span
              className="metric-value"
              style={{ color: getBugRateColor(bugRate) }}
            >
              {(bugRate * 100).toFixed(0)}%
            </span>
          </div>
          <div className="metric-bar">
            <div
              className="metric-fill"
              style={{
                width: `${bugRate * 100}%`,
                backgroundColor: getBugRateColor(bugRate)
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
              onClick={() => payDownTechDebt(debtReduction)}
              disabled={currentLoc < debtCost}
            >
              Pay {formatNumber(debtCost)} LoC → -{formatNumber(debtReduction)} debt
            </button>
          )}
        </div>
      )}
    </div>
  )
}