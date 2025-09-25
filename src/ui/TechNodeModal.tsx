import React from 'react'
import { Modal } from './Modal'
import { NodeIcon } from './Icons'
import { useStore } from '../state/store'

interface TechNodeModalProps {
  nodeId: string | null
  isOpen: boolean
  onClose: () => void
}

function formatPct(mult: number) {
  const pct = (mult - 1) * 100
  const fixed = Math.abs(pct) < 10 ? pct.toFixed(1) : Math.round(pct).toString()
  return (pct >= 0 ? '+' : '') + fixed + '%'
}

function effectLines(n: any): { text: string; kind: 'loc' | 'ship' | 'revenue' | 'global' }[] {
  const lines: { text: string; kind: 'loc' | 'ship' | 'revenue' | 'global' }[] = []
  const effects = (n.effects || []) as { stat: string; type: string; value: any; display?: string }[]
  for (const ef of effects) {
    const s = ef.stat
    if (s === 'loc_per_click') {
      if (ef.type === 'mul') lines.push({ text: `LoC/click ${formatPct(ef.value)}`, kind: 'loc' })
      else if (ef.type === 'add') lines.push({ text: `LoC/click +${ef.value}`, kind: 'loc' })
    } else if (s === 'idle_loc_per_sec') {
      if (ef.type === 'mul') lines.push({ text: `Idle LoC/s ${formatPct(ef.value)}`, kind: 'loc' })
      else if (ef.type === 'add') lines.push({ text: `Idle LoC/s +${ef.value}`, kind: 'loc' })
    } else if (s === 'compile_speed') {
      if (ef.type === 'mul') lines.push({ text: `Coding speed ${formatPct(ef.value)}`, kind: 'loc' })
      else if (ef.type === 'add') lines.push({ text: `Coding speed +${ef.value}x`, kind: 'loc' })
    } else if (s === 'ship_fraction') {
      if (ef.type === 'mul') lines.push({ text: `Ship fraction ${formatPct(ef.value)}`, kind: 'ship' })
      else if (ef.type === 'add') lines.push({ text: `Ship fraction +${Math.round(ef.value * 100)}%`, kind: 'ship' })
    } else if (s === 'ship_automation') {
      if ((ef.type === 'add' && ef.value > 0) || (ef.type === 'toggle' && !!ef.value)) {
        lines.push({ text: 'Auto-ship enabled', kind: 'ship' })
      }
    } else if (s === 'test_coverage') {
      if (ef.type === 'mul') lines.push({ text: `Test coverage ${formatPct(ef.value)}`, kind: 'ship' })
      else if (ef.type === 'add') lines.push({ text: `Test coverage +${Math.round(ef.value * 100)}%`, kind: 'ship' })
    } else if (s === 'revenue_per_loc') {
      if (ef.type === 'mul') lines.push({ text: `Revenue/LoC ${formatPct(ef.value)}`, kind: 'ship' })
      else if (ef.type === 'add') lines.push({ text: `Revenue/LoC +$${ef.value}`, kind: 'ship' })
    } else if (s === 'revenue_multiplier') {
      if (ef.type === 'mul') lines.push({ text: `Revenue ${formatPct(ef.value)}`, kind: 'revenue' })
    } else if (s === 'features_multiplier') {
      if (ef.type === 'mul') lines.push({ text: `Revenue ${formatPct(ef.value)} (features)`, kind: 'revenue' })
    } else if (s === 'price_premium') {
      if (ef.type === 'mul') lines.push({ text: `Revenue ${formatPct(ef.value)} (price)`, kind: 'revenue' })
    } else if (s === 'market_expansion') {
      if (ef.type === 'mul') lines.push({ text: `Revenue ${formatPct(ef.value)} (market)`, kind: 'revenue' })
    } else if (s === 'global_multiplier') {
      if (ef.type === 'mul') lines.push({ text: `Global ${formatPct(ef.value)}`, kind: 'global' })
    } else if (s === 'agentProductivity') {
      if (ef.type === 'mul') lines.push({ text: `Agent productivity ${formatPct(ef.value)}`, kind: 'global' })
    } else if (s === 'agentConcurrencyCap') {
      if (ef.type === 'cap') lines.push({ text: `Agent slots: ${ef.value}`, kind: 'global' })
      else if (ef.type === 'add') lines.push({ text: `Agent slots +${ef.value}`, kind: 'global' })
    } else if (s === 'automationLevel') {
      if (ef.type === 'add') {
        const levelTexts = {
          1: 'Enable auto-ship (20s)',
          2: 'Faster auto-ship (10s)',
          4: 'Rapid auto-ship (5s)',
          8: 'Instant auto-ship (1s)'
        }
        const description = levelTexts[ef.value as keyof typeof levelTexts] || `Automation +${ef.value} level`
        lines.push({ text: description, kind: 'ship' })
      }
    } else if (s === 'tech_debt_growth') {
      if (ef.type === 'mul') {
        if (ef.value === 0) lines.push({ text: `No tech debt growth`, kind: 'global' })
        else lines.push({ text: `Tech debt growth ${formatPct(ef.value)}`, kind: 'global' })
      }
    } else if (s === 'refactor_bonus') {
      if (ef.type === 'add') lines.push({ text: `LoC/click +${ef.value * 10}%`, kind: 'loc' })
    } else if (s === 'passive_rev_per_sec') {
      if (ef.type === 'add') lines.push({ text: `Passive revenue +$${ef.value}/s`, kind: 'revenue' })
    } else if (s === 'code_quality') {
      if (ef.type === 'mul') lines.push({ text: `Code quality ${formatPct(ef.value)}`, kind: 'global' })
      else if (ef.type === 'add') lines.push({ text: `Code quality +${ef.value}`, kind: 'global' })
    } else if (s === 'bug_rate') {
      if (ef.type === 'mul') {
        const bugReduction = Math.round((1 - ef.value) * 100)
        lines.push({ text: `Bug reduction -${bugReduction}%`, kind: 'global' })
      }
    }
  }
  return lines
}

export const TechNodeModal: React.FC<TechNodeModalProps> = ({ nodeId, isOpen, onClose }) => {
  const nodeById = useStore(s => s.nodeById)
  const purchased = useStore(s => s.purchased)
  const unlocked = useStore(s => s.unlocked)
  const revenue = useStore(s => s.resources.revenue)

  if (!nodeId || !nodeById[nodeId]) {
    return null
  }

  const node = nodeById[nodeId]
  const isPurchased = !!purchased[nodeId]
  const isUnlocked = unlocked.has(nodeId)
  const requires = (node.requires || []) as { node: string }[]
  const effects = effectLines(node)

  // Calculate cost using the same logic as TechTree
  const costFor = (id: string) => {
    const s = useStore.getState()
    const branchKey = s.nodeToBranch[id]
    const branchDiscount = s.discounts[branchKey] ?? 1
    const n = s.nodeById[id]
    return (n?.baseCost || 0) * branchDiscount
  }

  const cost = costFor(nodeId)
  const canAfford = revenue >= cost

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${nodeId}: ${node.name}`}
      className="tech-node-modal"
    >
      <div className="tech-node-modal-content">
        {/* Icon Section */}
        <div className="tech-node-modal-icon">
          <NodeIcon id={nodeId} size={100} />
        </div>

        {/* Description */}
        <div className="tech-node-modal-description">
          <p style={{
            fontStyle: 'italic',
            color: 'var(--muted)',
            fontSize: '14px',
            lineHeight: '1.4',
            marginBottom: '16px'
          }}>
            {node.description}
          </p>
        </div>

        {/* Status */}
        <div className="tech-node-modal-status">
          <div className={`status-badge ${isPurchased ? 'purchased' : isUnlocked ? 'unlocked' : 'locked'}`}>
            {isPurchased ? '✓ Purchased' : isUnlocked ? '🔓 Available' : '🔒 Locked'}
          </div>
        </div>

        {/* Cost */}
        <div className="tech-node-modal-cost">
          <div className="cost-container">
            <span className="cost-label">Cost:</span>
            <span className={`cost-value ${canAfford ? 'affordable' : 'expensive'}`}>
              ${cost.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Requirements */}
        {requires.length > 0 && (
          <div className="tech-node-modal-requirements">
            <h4>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="chain-icon">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Requirements:
            </h4>
            <div className="requirements-list">
              {requires.map((req, i) => (
                <span key={i} className="requirement-badge">
                  {req.node}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Effects */}
        {effects.length > 0 && (
          <div className="tech-node-modal-effects">
            <h4>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="lightning-icon">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2"/>
              </svg>
              Effects:
            </h4>
            <div className="effects-list">
              {effects.map((effect, i) => (
                <div key={i} className={`effect-item ${effect.kind}`}>
                  <span className="effect-bullet">•</span>
                  <span className="effect-text">{effect.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Details */}
        <div className="tech-node-modal-details">
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Tier:</span>
              <span className="detail-value">{node.tier}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Base Cost:</span>
              <span className="detail-value">${node.baseCost.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Cost Curve:</span>
              <span className="detail-value">{node.costCurve}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}