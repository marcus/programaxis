import React from 'react'
import { useStore } from '../state/store'
import milestonesData from '../data/milestones.json'

interface Milestone {
  id: string
  name: string
  threshold: number
}

function fmt(n: number, digits = 2) {
  if (!isFinite(n)) return '0'
  if (Math.abs(n) >= 1_000_000_000_000) return (n/1_000_000_000_000).toFixed(digits)+'T'
  if (Math.abs(n) >= 1_000_000_000) return (n/1_000_000_000).toFixed(digits)+'B'
  if (Math.abs(n) >= 1_000_000) return (n/1_000_000).toFixed(digits)+'M'
  if (Math.abs(n) >= 1_000) return (n/1_000).toFixed(digits)+'K'
  return n.toFixed(digits)
}

export const MilestoneProgress: React.FC = () => {
  const lifetimeRevenue = useStore(s => s.resources.lifetimeRevenue)
  const reachedMilestones = useStore(s => s.milestones.reached)

  const milestones = milestonesData as Milestone[]

  // Find current milestone (highest reached) and next milestone
  const reachedIds = new Set(reachedMilestones.map(m => m.id))
  const currentMilestone = milestones
    .filter(m => reachedIds.has(m.id))
    .sort((a, b) => b.threshold - a.threshold)[0]

  const nextMilestone = milestones
    .filter(m => !reachedIds.has(m.id))
    .sort((a, b) => a.threshold - b.threshold)[0]

  if (!nextMilestone) {
    // All milestones completed
    return (
      <div className="milestone-progress completed">
        <div className="milestone-crown">👑</div>
        <div className="milestone-content">
          <div className="milestone-title">ALL MILESTONES COMPLETE</div>
          <div className="milestone-subtitle">Reality Architect Achieved</div>
          <div className="milestone-revenue">${fmt(lifetimeRevenue)}</div>
        </div>
      </div>
    )
  }

  const progress = nextMilestone ? Math.min(100, (lifetimeRevenue / nextMilestone.threshold) * 100) : 100
  const remaining = Math.max(0, nextMilestone.threshold - lifetimeRevenue)

  return (
    <div className="milestone-progress">
      <div className="milestone-header">
        <div className="milestone-status">
          {currentMilestone ? (
            <>
              <span className="current-milestone">✓ {currentMilestone.name}</span>
              <span className="next-arrow">→</span>
            </>
          ) : (
            <span className="starting">Starting Journey</span>
          )}
          <span className="next-milestone">{nextMilestone.name}</span>
        </div>
      </div>

      <div className="milestone-progress-bar">
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
          <div className="progress-glow" style={{ left: `${progress}%` }} />
        </div>
        <div className="progress-labels">
          <span className="current-amount">${fmt(lifetimeRevenue)}</span>
          <span className="target-amount">${fmt(nextMilestone.threshold)}</span>
        </div>
      </div>

      <div className="milestone-details">
        <div className="progress-percent">{progress.toFixed(1)}%</div>
        <div className="remaining-amount">
          ${fmt(remaining)} to go
        </div>
      </div>
    </div>
  )
}