import React, { useMemo, useCallback } from 'react'
import { useStore } from '../state/store'
import { NodeIcon } from './Icons'
import { GarbledText } from './GarbledText'
import { PurchasedIcon, UnlockedIcon, LockedIcon } from './StatusIcons'
import { animationSystem } from '../game/animationSystem'

interface TechNodeComponentProps {
  node: {
    id: string
    tier: number
    branch: string
    name: string
    isPurchased: boolean
    isUnlocked: boolean
    canAfford: boolean
    requires?: { node: string }[]
  }
  position: { x: number, y: number }
  onClick: (nodeId: string, event: React.MouseEvent) => void
  scale: number
  onSizeChange?: (nodeId: string, size: number) => void
}

// Helper function to get effect lines (extracted from original TechTree)
function effectLines(nodeId: string) {
  const node = useStore.getState().nodeById[nodeId]
  const lines: { text: string; kind: 'loc' | 'ship' | 'revenue' | 'global' }[] = []
  const effects = (node?.effects || []) as { stat: string; type: string; value: any }[]

  for (const ef of effects) {
    const s = ef.stat
    if (s === 'loc_per_click') {
      if (ef.type === 'mul') lines.push({ text: `LoC/click ${formatPct(ef.value)}`, kind: 'loc' })
      else if (ef.type === 'add') lines.push({ text: `LoC/click +${ef.value}`, kind: 'loc' })
    } else if (s === 'idle_loc_per_sec') {
      if (ef.type === 'mul') lines.push({ text: `Idle LoC/s ${formatPct(ef.value)}`, kind: 'loc' })
      else if (ef.type === 'add') lines.push({ text: `Idle LoC/s +${ef.value}`, kind: 'loc' })
    } else if (s === 'global_multiplier') {
      if (ef.type === 'mul') lines.push({ text: `Global ${formatPct(ef.value)}`, kind: 'global' })
    } else if (s === 'agentConcurrencyCap') {
      if (ef.type === 'cap') lines.push({ text: `Agent slots: ${ef.value}`, kind: 'global' })
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
    }
    // Add more effect types as needed...
  }

  return lines
}

function formatPct(mult: number) {
  const pct = (mult - 1) * 100
  const fixed = Math.abs(pct) < 10 ? pct.toFixed(1) : Math.round(pct).toString()
  return (pct >= 0 ? '+' : '') + fixed + '%'
}

function costFor(nodeId: string) {
  const s = useStore.getState()
  const branchKey = s.nodeToBranch[nodeId]
  const branchDiscount = s.discounts[branchKey] ?? 1
  const node = s.nodeById[nodeId]
  return (node?.baseCost || 0) * branchDiscount
}

export const TechNodeComponent: React.FC<TechNodeComponentProps> = ({
  node,
  position,
  onClick,
  scale,
  onSizeChange
}) => {
  const buy = useStore(s => s.buyNode)
  const revenue = useStore(s => s.resources.revenue)

  const cost = costFor(node.id)
  const effects = effectLines(node.id)
  const requires = node.requires || []

  // Determine visual state
  const stateClass = node.isPurchased ? 'is-purchased' : node.isUnlocked ? 'is-unlocked' : 'is-locked'

  // Responsive sizing based on zoom level
  const nodeSize = useMemo(() => {
    const baseSize = 120
    const minSize = 80
    const maxSize = 160

    // Scale inversely with zoom - smaller nodes when zoomed out
    const scaleFactor = Math.max(0.7, Math.min(1.3, 1 / scale))
    const calculatedSize = Math.max(minSize, Math.min(maxSize, baseSize * scaleFactor))

    // Report size change for connection calculations
    if (onSizeChange) {
      onSizeChange(node.id, calculatedSize)
    }

    return calculatedSize
  }, [scale, node.id, onSizeChange])

  const handlePurchase = useCallback((event: React.MouseEvent) => {
    event.stopPropagation()

    if (!node.isUnlocked || node.isPurchased || !node.canAfford) return

    // Calculate animation position
    const buttonRect = event.currentTarget.getBoundingClientRect()
    const centerX = buttonRect.left + buttonRect.width / 2
    const centerY = buttonRect.top + buttonRect.height / 2

    // Trigger animation before purchase
    animationSystem.triggerTechPurchaseAnimation(
      node.id,
      node.branch,
      { x: centerX, y: centerY },
      node.tier,
      effects
    )

    // Execute purchase
    buy(node.id)
    onClick(node.id, event)
  }, [node, buy, onClick, effects])

  return (
    <div
      className={`tech-node ${stateClass} branch-${node.branch}`}
      style={{
        position: 'absolute',
        left: position.x - nodeSize / 2,
        top: position.y - nodeSize / 2,
        width: nodeSize,
        height: 'auto',
        minHeight: nodeSize,
        transform: 'translate3d(0, 0, 0)', // Force hardware acceleration
        zIndex: node.isPurchased ? 3 : node.isUnlocked ? 2 : 1,
      }}
      data-node-id={node.id}
      data-tier={node.tier}
      data-branch={node.branch}
    >
      {/* Status icon */}
      <div className="status-icon-container">
        {node.isPurchased ? (
          <PurchasedIcon size={16} />
        ) : node.isUnlocked ? (
          <UnlockedIcon size={16} />
        ) : (
          <LockedIcon size={16} />
        )}
      </div>

      {/* Node content */}
      <div className="node-hero">
        <div className="icon-wrap" style={{ width: nodeSize * 0.4, height: nodeSize * 0.4 }}>
          <NodeIcon id={node.id} size={nodeSize * 0.3} />
        </div>

        <div className="node-info">
          <div className="node-id">
            <GarbledText isLocked={!node.isUnlocked} category={node.branch}>
              {node.id}
            </GarbledText>
          </div>

          <div className="node-name">
            <GarbledText
              isLocked={!node.isUnlocked}
              category={node.branch}
              revealOnHover={true}
            >
              {node.name}
            </GarbledText>
          </div>
        </div>
      </div>

      {/* Effects (show only when unlocked and zoomed in enough) */}
      {node.isUnlocked && scale > 0.6 && effects.length > 0 && (
        <div className="effects" style={{ fontSize: Math.max(10, 12 * scale) }}>
          {effects.slice(0, 3).map((effect, i) => (
            <div key={i} className={`effect ${effect.kind}`}>
              • <GarbledText
                  isLocked={false}
                  category={node.branch}
                  animated={false}
                  style="fragmented"
                >
                  {effect.text}
                </GarbledText>
            </div>
          ))}
          {effects.length > 3 && (
            <div className="effect-more">+{effects.length - 3} more</div>
          )}
        </div>
      )}

      {/* Requirements (show for locked nodes when zoomed in) */}
      {!node.isUnlocked && scale > 0.8 && requires.length > 0 && (
        <div className="requirements" style={{ fontSize: Math.max(9, 10 * scale) }}>
          <div className="req-label">Requires:</div>
          {requires.slice(0, 2).map(req => (
            <div key={req.node} className="req-item">{req.node}</div>
          ))}
          {requires.length > 2 && (
            <div className="req-more">+{requires.length - 2} more</div>
          )}
        </div>
      )}

      {/* Action area */}
      <div className="node-action">
        {node.isPurchased ? (
          <div className="purchased-indicator">
            <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: Math.max(10, 12 * scale) }}>
              ✓ Purchased
            </span>
          </div>
        ) : node.isUnlocked && !node.canAfford ? (
          <div className="unaffordable-price" style={{ fontSize: Math.max(11, 13 * scale) }}>
            ${cost.toLocaleString()}
          </div>
        ) : (
          <button
            className="tron-button purchase-btn"
            disabled={!node.isUnlocked || !node.canAfford}
            onClick={handlePurchase}
            style={{
              fontSize: Math.max(10, 12 * scale),
              padding: `${Math.max(4, 6 * scale)}px ${Math.max(8, 10 * scale)}px`,
              minHeight: Math.max(28, 32 * scale)
            }}
          >
            {node.isUnlocked ? `$${cost.toLocaleString()}` : 'Locked'}
          </button>
        )}
      </div>
    </div>
  )
}