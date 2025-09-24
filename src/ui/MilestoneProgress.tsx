import React from 'react'
import { useStore } from '../state/store'
import milestonesData from '../data/milestones.json'
import { MilestoneBackground } from './MilestoneBackground'

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
  const recentAchievement = useStore(s => s.ui.recentAchievement)
  const clearRecentAchievement = useStore(s => s.clearRecentAchievement)

  const milestones = milestonesData as Milestone[]

  // Find current milestone (highest reached) and next milestone
  const reachedIds = new Set(reachedMilestones.map(m => m.id))

  // Auto-award the $0 milestone if player meets it but doesn't have it
  const zeroMilestone = milestones.find(m => m.threshold === 0)
  if (zeroMilestone && !reachedIds.has(zeroMilestone.id) && lifetimeRevenue >= 0) {
    reachedIds.add(zeroMilestone.id)
  }

  const currentMilestone = milestones
    .filter(m => reachedIds.has(m.id))
    .sort((a, b) => b.threshold - a.threshold)[0]

  const nextMilestone = milestones
    .filter(m => !reachedIds.has(m.id))
    .sort((a, b) => a.threshold - b.threshold)[0]

  if (!nextMilestone) {
    // All milestones completed
    return (
      <MilestoneBackground
        currentMilestoneId="M_10T"
        progress={100}
        isAchieving={false}
      >
        <div className="milestone-progress completed">
          <div className="milestone-crown">👑</div>
          <div className="milestone-content">
            <div className="milestone-title">ALL MILESTONES COMPLETE</div>
            <div className="milestone-subtitle">Reality Architect Achieved</div>
            <div className="milestone-revenue">${fmt(lifetimeRevenue)}</div>
          </div>
        </div>
      </MilestoneBackground>
    )
  }

  const progress = nextMilestone && nextMilestone.threshold > 0
    ? Math.min(100, (lifetimeRevenue / nextMilestone.threshold) * 100)
    : 100
  const remaining = Math.max(0, nextMilestone.threshold - lifetimeRevenue)

  // Check if we're celebrating an achievement
  const isAchieving = recentAchievement &&
    (recentAchievement.id === currentMilestone?.id) &&
    (Date.now() - recentAchievement.timestamp < 3000) // Animation lasts 3 seconds

  const handleAchievementComplete = () => {
    clearRecentAchievement()
  }

  return (
    <MilestoneBackground
      currentMilestoneId={currentMilestone?.id || 'M_0'}
      nextMilestoneId={nextMilestone.id}
      progress={progress}
      isAchieving={isAchieving}
      onAchievementAnimationComplete={handleAchievementComplete}
    >
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
    </MilestoneBackground>
  )
}