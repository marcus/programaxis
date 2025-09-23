import React from 'react'
import { useStore } from '../state/store'
import { milestones } from '../game/progression'

export const Milestones: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const reached = useStore(s => s.milestones.reached)
  const revenue = useStore(s => s.resources.revenue)

  return (
    <div>
      <div style={{ marginTop: 8, marginBottom: 4, color: '#9bb1c9' }}>Milestones</div>
      <div className="ribbon">
        {milestones.map(m => {
          const hit = reached.some(r => r.id === m.id)
          const label = `${m.title} (${m.threshold.toLocaleString()})`
          return (
            <span key={m.id} className={`badge ${hit ? 'hit' : ''}`} title={label}>
              {hit ? '✓ ' : ''}{m.short || m.title}
            </span>
          )
        })}
      </div>
      {!compact && (
        <div style={{ marginTop: 8, fontSize: 12, color: '#9bb1c9' }}>
          Revenue: ${revenue.toLocaleString()}
        </div>
      )}
    </div>
  )
}
