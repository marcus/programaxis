import React, { useEffect, useMemo } from 'react'
import { useStore } from '../state/store'
import { AgentIcon } from './Icons'

function formatNumber(num: number, precision = 1): string {
  if (num >= 1000000) return (num / 1000000).toFixed(precision) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(precision) + 'K'
  return num.toFixed(precision)
}

// Generate agent particles with randomized positions and speeds
function generateAgentParticles(count: number) {
  const particles = []
  const maxVisualAgents = Math.min(count, 35) // Cap for performance

  for (let i = 0; i < maxVisualAgents; i++) {
    particles.push({
      id: i,
      // Random orbital parameters
      radius: 20 + Math.random() * 25, // Orbit radius
      speed: 0.5 + Math.random() * 1.5, // Rotation speed multiplier
      offset: Math.random() * Math.PI * 2, // Starting angle
      size: 2 + Math.random() * 2, // Particle size
      brightness: 0.6 + Math.random() * 0.4 // Glow intensity
    })
  }

  return particles
}

export const AgentDashboard: React.FC = () => {
  const activeAgents = useStore(s => s.systems?.agents?.activeAgents ?? 0)
  const maxAgents = useStore(s => s.caps?.agentConcurrencyCap ?? 0)
  const agentProductivity = useStore(s => s.systems?.agents?.agentProductivity ?? 1.0)
  const agentLocPerSec = useStore(s => s.getAgentLocPerSec?.() ?? 0)

  // Generate particles when agent count changes
  const agentParticles = useMemo(() => generateAgentParticles(activeAgents), [activeAgents])

  if (maxAgents === 0) return null

  return (
    <div className="agent-dashboard">
      {/* Digital Agent Counter */}
      <div className="agent-digital-display">
        <div className="agent-count-large">
          <span className="count-number">{activeAgents}</span>
          <span className="count-max">/{maxAgents}</span>
        </div>
        <div className="agent-label">
          <AgentIcon size={14} />
          AGENTS ACTIVE
        </div>
      </div>

      {/* Swarm Visualization */}
      <div className="agent-swarm-container">
        <div className="agent-swarm-grid" />
        <div className="agent-swarm">
          {agentParticles.map((particle) => (
            <div
              key={particle.id}
              className="agent-particle"
              style={{
                '--radius': `${particle.radius}px`,
                '--speed': `${particle.speed}`,
                '--offset': `${particle.offset}rad`,
                '--size': `${particle.size}px`,
                '--brightness': particle.brightness,
                animationDelay: `${particle.id * 0.1}s`
              } as React.CSSProperties}
            />
          ))}

          {/* Center hub */}
          <div className="agent-swarm-center">
            <AgentIcon size={16} />
          </div>
        </div>

        {/* Scan line effect */}
        <div className="agent-scan-line" />
      </div>

      {/* Stats Row */}
      <div className="agent-stats-compact">
        <div className="agent-stat-item">
          <span className="stat-value">{agentProductivity.toFixed(1)}×</span>
          <span className="stat-label">EFFICIENCY</span>
        </div>
        <div className="agent-stat-divider" />
        <div className="agent-stat-item">
          <span className="stat-value">{formatNumber(agentLocPerSec)}</span>
          <span className="stat-label">LOC/SEC</span>
        </div>
      </div>
    </div>
  )
}