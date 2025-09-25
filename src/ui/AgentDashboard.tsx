import React from 'react'
import { useStore } from '../state/store'
import { AgentIcon } from './Icons'

function formatNumber(num: number, precision = 1): string {
  if (num >= 1000000) return (num / 1000000).toFixed(precision) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(precision) + 'K'
  return num.toFixed(precision)
}

export const AgentDashboard: React.FC = () => {
  const activeAgents = useStore(s => s.systems?.agents?.activeAgents ?? 0)
  const maxAgents = useStore(s => s.caps?.agentConcurrencyCap ?? 0)
  const agentProductivity = useStore(s => s.systems?.agents?.agentProductivity ?? 1.0)
  const agentLocPerSec = useStore(s => s.getAgentLocPerSec?.() ?? 0)

  if (maxAgents === 0) return null

  return (
    <div className="agent-dashboard">
      <div className="agent-header">
        <h3>
          <AgentIcon size={18} />
          AI Agents
        </h3>
        <div className="agent-count">
          {activeAgents}/{maxAgents}
        </div>
      </div>

      <div className="agent-stats">
        <div className="agent-stat">
          <span className="stat-label">Productivity:</span>
          <span className="stat-value">{agentProductivity.toFixed(1)}x</span>
        </div>
        <div className="agent-stat">
          <span className="stat-label">LoC/sec:</span>
          <span className="stat-value">{formatNumber(agentLocPerSec)}</span>
        </div>
      </div>

      <div className="agent-progress">
        <div className="progress-bar">
          <div
            className="progress-fill agent-progress-fill"
            style={{ width: `${(activeAgents / Math.max(1, maxAgents)) * 100}%` }}
          />
        </div>
        <div className="progress-label">
          {activeAgents > 0 ? `${activeAgents} agents working` : 'No agents active'}
        </div>
      </div>
    </div>
  )
}