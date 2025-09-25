import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useStore } from '../state/store'
import { actionAnimationSystem } from '../game/actionAnimationSystem'
import { HealthChartIcon } from './Icons'

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

// Generate SVG path for mini line graph
function generateGraphPath(dataPoints: number[], width: number, height: number): string {
  if (dataPoints.length < 2) return ''

  const maxValue = Math.max(...dataPoints, 1)
  const minValue = Math.min(...dataPoints, 0)
  const range = maxValue - minValue || 1

  const stepX = width / (dataPoints.length - 1)

  let path = ''
  dataPoints.forEach((value, index) => {
    const x = index * stepX
    const normalizedValue = (value - minValue) / range
    const y = height - (normalizedValue * height * 0.8) - (height * 0.1) // Leave 10% padding top/bottom

    if (index === 0) {
      path += `M ${x} ${y}`
    } else {
      path += ` L ${x} ${y}`
    }
  })

  return path
}

// Generate historical data points (simulated trend)
function useGraphData(currentValue: number, dataPointCount = 20) {
  return useMemo(() => {
    const points = []
    for (let i = 0; i < dataPointCount; i++) {
      // Simulate gradual trend toward current value with some noise
      const progress = i / (dataPointCount - 1)
      const baseValue = currentValue * (0.7 + progress * 0.3)
      const noise = (Math.random() - 0.5) * currentValue * 0.1
      points.push(Math.max(0, baseValue + noise))
    }
    // Ensure the last point is exactly the current value
    points[points.length - 1] = currentValue
    return points
  }, [currentValue])
}

interface QualityIndicatorProps {
  onInfoClick?: () => void
}

export const QualityIndicator: React.FC<QualityIndicatorProps> = ({ onInfoClick }) => {
  const [showTechDebtSection, setShowTechDebtSection] = useState(false)
  const [showPayButton, setShowPayButton] = useState(false)
  const hasEverHadDebt = useRef(false)

  const codeQuality = useStore(s => s.stats?.code_quality ?? 1.0)
  const bugRate = useStore(s => s.stats?.bug_rate ?? 1.0)
  const bugFreeRate = 1 - bugRate // Convert to bug-free percentage
  const testCoverage = useStore(s => s.stats?.test_coverage ?? 1.0)
  const techDebt = useStore(s => s.resources?.techDebt ?? 0)
  const payDownTechDebt = useStore(s => s.payDownTechDebt)
  const currentLoc = useStore(s => s.resources?.loc ?? 0)

  // Generate graph data
  const qualityGraphData = useGraphData(codeQuality)
  const bugFreeGraphData = useGraphData(bugFreeRate)
  const testCoverageGraphData = useGraphData(testCoverage)

  const debtCost = Math.ceil(Math.min(techDebt, currentLoc / 2) * 2)
  const debtReduction = Math.ceil(Math.min(techDebt, currentLoc / 2))

  // Manage tech debt section visibility with stable state
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (techDebt > 0) {
      hasEverHadDebt.current = true
      setShowTechDebtSection(true)
    } else if (hasEverHadDebt.current && techDebt === 0) {
      // Keep showing for a brief moment after debt is paid off
      timer = setTimeout(() => {
        setShowTechDebtSection(false)
        setShowPayButton(false)
      }, 1000)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [techDebt])

  // Manage pay button visibility separately to prevent flashing
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (debtReduction > 0 && currentLoc >= debtCost) {
      setShowPayButton(true)
    } else if (techDebt === 0) {
      // Hide button when debt is fully paid
      timer = setTimeout(() => {
        setShowPayButton(false)
      }, 500)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [debtReduction, currentLoc, debtCost, techDebt])

  return (
    <div className="quality-dashboard">
      {/* Header */}
      <div className="quality-dashboard-header">
        <div className="dashboard-title">
          <HealthChartIcon size={16} />
          <span>CODE HEALTH</span>
        </div>
        <button
          className="dashboard-info-btn"
          onClick={onInfoClick}
          title="Learn about code health mechanics"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 12V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="8" cy="5" r="1" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* Graphs Grid */}
      <div className="health-graphs-grid">
        {/* Quality Graph */}
        <div className="health-graph-container">
          <div className="graph-header-stacked">
            <div className="graph-label">QUALITY</div>
            <div className="graph-value" style={{ color: getQualityColor(codeQuality) }}>
              {codeQuality.toFixed(1)}×
            </div>
          </div>
          <div className="graph-display">
            <svg width="100%" height="40" viewBox="0 0 100 40" className="health-graph">
              <defs>
                <linearGradient id="qualityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={getQualityColor(codeQuality)} stopOpacity="0.6"/>
                  <stop offset="100%" stopColor={getQualityColor(codeQuality)} stopOpacity="0.1"/>
                </linearGradient>
              </defs>
              <path
                d={`${generateGraphPath(qualityGraphData, 100, 40)} L 100 40 L 0 40 Z`}
                fill="url(#qualityGradient)"
                className="graph-fill"
              />
              <path
                d={generateGraphPath(qualityGraphData, 100, 40)}
                stroke={getQualityColor(codeQuality)}
                strokeWidth="1.5"
                fill="none"
                className="graph-line"
              />
              {/* Current value dot */}
              <circle
                cx="100"
                cy={40 - ((codeQuality - Math.min(...qualityGraphData)) / (Math.max(...qualityGraphData) - Math.min(...qualityGraphData) || 1)) * 32 - 4}
                r="2"
                fill={getQualityColor(codeQuality)}
                className="graph-dot"
              />
            </svg>
          </div>
        </div>

        {/* Bug-Free Graph */}
        <div className="health-graph-container">
          <div className="graph-header-stacked">
            <div className="graph-label">BUG-FREE</div>
            <div className="graph-value" style={{ color: getBugFreeColor(bugFreeRate) }}>
              {(bugFreeRate * 100).toFixed(0)}%
            </div>
          </div>
          <div className="graph-display">
            <svg width="100%" height="40" viewBox="0 0 100 40" className="health-graph">
              <defs>
                <linearGradient id="bugFreeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={getBugFreeColor(bugFreeRate)} stopOpacity="0.6"/>
                  <stop offset="100%" stopColor={getBugFreeColor(bugFreeRate)} stopOpacity="0.1"/>
                </linearGradient>
              </defs>
              <path
                d={`${generateGraphPath(bugFreeGraphData, 100, 40)} L 100 40 L 0 40 Z`}
                fill="url(#bugFreeGradient)"
                className="graph-fill"
              />
              <path
                d={generateGraphPath(bugFreeGraphData, 100, 40)}
                stroke={getBugFreeColor(bugFreeRate)}
                strokeWidth="1.5"
                fill="none"
                className="graph-line"
              />
              <circle
                cx="100"
                cy={40 - (bugFreeRate - Math.min(...bugFreeGraphData)) / (Math.max(...bugFreeGraphData) - Math.min(...bugFreeGraphData) || 1) * 32 - 4}
                r="2"
                fill={getBugFreeColor(bugFreeRate)}
                className="graph-dot"
              />
            </svg>
          </div>
        </div>

        {/* Test Coverage Graph */}
        <div className="health-graph-container">
          <div className="graph-header-stacked">
            <div className="graph-label">TEST COV</div>
            <div className="graph-value" style={{ color: '#8a78ff' }}>
              {(testCoverage * 100).toFixed(0)}%
            </div>
          </div>
          <div className="graph-display">
            <svg width="100%" height="40" viewBox="0 0 100 40" className="health-graph">
              <defs>
                <linearGradient id="coverageGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8a78ff" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#8a78ff" stopOpacity="0.1"/>
                </linearGradient>
              </defs>
              <path
                d={`${generateGraphPath(testCoverageGraphData, 100, 40)} L 100 40 L 0 40 Z`}
                fill="url(#coverageGradient)"
                className="graph-fill"
              />
              <path
                d={generateGraphPath(testCoverageGraphData, 100, 40)}
                stroke="#8a78ff"
                strokeWidth="1.5"
                fill="none"
                className="graph-line"
              />
              <circle
                cx="100"
                cy={40 - (testCoverage - Math.min(...testCoverageGraphData)) / (Math.max(...testCoverageGraphData) - Math.min(...testCoverageGraphData) || 1) * 32 - 4}
                r="2"
                fill="#8a78ff"
                className="graph-dot"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Tech Debt Warning Panel */}
      {showTechDebtSection && (
        <div className={`tech-debt-warning ${techDebt > 200 ? 'critical' : ''}`}>
          <div className="warning-header">
            <div className="warning-indicator">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L15 15H1L8 1Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M8 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="12" r="0.5" fill="currentColor"/>
              </svg>
              TECH DEBT
            </div>
            <div className="debt-amount" style={{ color: getTechDebtColor(techDebt) }}>
              {formatNumber(Math.max(0, techDebt))}
            </div>
          </div>

          <div className="debt-penalty-bar">
            <div className="penalty-fill" style={{
              width: `${Math.min(100, (techDebt / 1000) * 100)}%`,
              backgroundColor: getTechDebtColor(techDebt)
            }} />
            <div className="penalty-text">
              -{((Math.max(0, techDebt) / 1000) * 100).toFixed(1)}% ship efficiency
            </div>
          </div>

          {showPayButton && (
            <button
              className="tron-button debt-emergency-btn"
              onClick={(e) => {
                if (currentLoc < debtCost) return

                const rect = e.currentTarget.getBoundingClientRect()
                const centerX = rect.left + rect.width / 2
                const centerY = rect.top + rect.height / 2

                actionAnimationSystem.triggerPayDebtAnimation(
                  { x: centerX, y: centerY },
                  Math.min(1, (debtReduction / 500) + 0.2)
                )

                setTimeout(() => {
                  payDownTechDebt(debtReduction)
                }, 50)
              }}
              disabled={currentLoc < debtCost}
              style={{ opacity: currentLoc < debtCost ? 0.5 : 1 }}
            >
              EMERGENCY REFACTOR: {formatNumber(debtCost)} LoC → -{formatNumber(debtReduction)}
            </button>
          )}
        </div>
      )}
    </div>
  )
}