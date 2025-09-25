import React, { useRef, useEffect, useState } from 'react'
import { useStore } from '../state/store'
import techTree from '../data/tech-tree.json'
import { NodeIcon } from './Icons'
import { GarbledText } from './GarbledText'
import { PurchasedIcon, UnlockedIcon, LockedIcon } from './StatusIcons'
import { animationSystem } from '../game/animationSystem'
import { TechTreeCanvas } from './TechTreeCanvas'

function costFor(nodeId: string) {
  const s = useStore.getState()
  const branchKey = s.nodeToBranch[nodeId]
  const branchDiscount = s.discounts[branchKey] ?? 1
  const node = s.nodeById[nodeId]
  return (node?.baseCost || 0) * branchDiscount
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

export const TechTree: React.FC = () => {
  const branches = (techTree as any).branches as { key:string, name:string, nodes:any[] }[]
  const purchased = useStore(s => s.purchased)
  const unlocked = useStore(s => s.unlocked)
  const canBuy = useStore(s => s.canBuy)
  const buy = useStore(s => s.buyNode)

  const revenue = useStore(s => s.resources.revenue)
  const showDependencyGraph = useStore(s => s.ui.showDependencyGraph)
  const toggleDependencyGraph = useStore(s => s.toggleDependencyGraph)

  // State for toggling between old and new layouts - default to classic view
  const [useNewLayout, setUseNewLayout] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number; width: number; height: number }>>({})

  // Calculate positions of all nodes for drawing lines
  const updateNodePositions = React.useCallback(() => {
    if (!containerRef.current) return

    const positions: Record<string, { x: number; y: number; width: number; height: number }> = {}
    const container = containerRef.current

    // Find all node elements and calculate their positions relative to the container's content area
    const nodeElements = container.querySelectorAll('.node')
    nodeElements.forEach((element) => {
      const nodeId = element.getAttribute('data-node-id')
      if (nodeId) {
        // Get the element's offset relative to its offset parent (the container)
        const elementOffsetLeft = (element as HTMLElement).offsetLeft
        const elementOffsetTop = (element as HTMLElement).offsetTop
        const rect = element.getBoundingClientRect()

        positions[nodeId] = {
          x: elementOffsetLeft + rect.width / 2,
          y: elementOffsetTop + rect.height / 2,
          width: rect.width,
          height: rect.height
        }
      }
    })

    setNodePositions(positions)
  }, [])

  useEffect(() => {
    updateNodePositions()
  }, [showDependencyGraph, branches, updateNodePositions])

  // Listen for resize events in case the layout changes
  useEffect(() => {
    if (!showDependencyGraph) return

    const handleResize = () => {
      updateNodePositions()
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [showDependencyGraph, updateNodePositions])

  // Generate dependency lines
  const dependencyLines = React.useMemo(() => {
    if (!showDependencyGraph) return []

    const lines: { from: string; to: string; fromPos: {x: number; y: number}; toPos: {x: number; y: number} }[] = []

    branches.forEach(branch => {
      branch.nodes.forEach(node => {
        const requires = (node.requires || []) as { node: string }[]
        requires.forEach(req => {
          const fromPos = nodePositions[req.node]
          const toPos = nodePositions[node.id]
          if (fromPos && toPos) {
            lines.push({
              from: req.node,
              to: node.id,
              fromPos,
              toPos
            })
          }
        })
      })
    })

    return lines
  }, [showDependencyGraph, nodePositions, branches])

  // New layout - return the canvas directly
  if (useNewLayout) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <button
            className="tron-button"
            onClick={() => setUseNewLayout(false)}
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            Classic View
          </button>
          <span style={{ color: 'var(--muted)', fontSize: '12px' }}>
            Switch to the classic column layout
          </span>
        </div>

        <div style={{ height: '70vh', minHeight: '500px' }}>
          <TechTreeCanvas />
        </div>
      </div>
    )
  }

  // Original layout - keep existing code
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <button
          className="tron-button"
          onClick={() => setUseNewLayout(true)}
          style={{
            fontSize: '12px',
            padding: '6px 12px',
            marginRight: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L1 21h22L12 2zm-1 8v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
          </svg>
          Network View
          <span style={{
            background: 'var(--warn)',
            color: 'var(--bg)',
            fontSize: '9px',
            fontWeight: 600,
            padding: '1px 4px',
            borderRadius: '3px',
            marginLeft: '4px'
          }}>
            BETA
          </span>
        </button>
        <button
          className="tron-button"
          onClick={toggleDependencyGraph}
          style={{ fontSize: '12px', padding: '6px 12px' }}
        >
          {showDependencyGraph ? 'Hide Dependencies' : 'Show Dependencies'}
        </button>
        <span style={{ color: 'var(--muted)', fontSize: '12px' }}>
          Toggle to see dependency connections between tech nodes
        </span>
      </div>

      <div ref={containerRef} className="techtree" style={{ position: 'relative' }}>
        {branches.map(br => (
          <div key={br.key} className={`branch branch-${br.key}`}>
            <h3>{br.name}</h3>
            {br.nodes.map(n => {
              const isPurchased = !!purchased[n.id]
              const isUnlocked = unlocked.has(n.id)

              const c = costFor(n.id)
              const afford = revenue >= c
              const requires = (n.requires || []) as { node: string }[]
              const lines = effectLines(n)
              const stateClass = isPurchased ? 'is-purchased' : isUnlocked ? 'is-unlocked' : 'is-locked'
              const statusText = isPurchased ? 'Purchased' : isUnlocked ? 'Unlocked' : 'Locked'
              return (
                <div key={n.id} className={`node ${stateClass}`} data-node-id={n.id} style={{ position: 'relative', zIndex: 2 }}>
                  <div className="status-icon-container">
                    {isPurchased ? (
                      <PurchasedIcon size={18} />
                    ) : isUnlocked ? (
                      <UnlockedIcon size={18} />
                    ) : (
                      <LockedIcon size={18} />
                    )}
                  </div>
                  <div className="node-hero">
                    <div className="icon-wrap">
                      <NodeIcon id={n.id} size={56} />
                    </div>
                    <div className="node-head">
                      <div className="node-id">
                        <GarbledText isLocked={!isUnlocked} category={br.key}>
                          {n.id}
                        </GarbledText>
                      </div>
                      <div className="node-name">
                        <GarbledText
                          isLocked={!isUnlocked}
                          category={br.key}
                          revealOnHover={true}
                        >
                          {n.name}
                        </GarbledText>
                      </div>
                    </div>
                  </div>
                  {lines.length > 0 && (
                    <div className="effects">
                      {lines.map((l, i) => (
                        <div key={i} className={`effect ${l.kind}`}>
                          • <GarbledText
                              isLocked={!isUnlocked}
                              category={br.key}
                              animated={false}
                              style="fragmented"
                            >
                              {l.text}
                            </GarbledText>
                        </div>
                      ))}
                    </div>
                  )}
                  {requires.length>0 && (
                    <div className="req">Requires: {requires.map(r=>r.node).join(', ')}</div>
                  )}
                  {isPurchased ? (
                    <div className="purchased-indicator">
                      <span style={{ color: 'var(--accent)', fontWeight: 600 }}>✓ Purchased</span>
                    </div>
                  ) : isUnlocked && !afford ? (
                    <div className="unaffordable-price">
                      ${c.toLocaleString()}
                    </div>
                  ) : (
                    <button
                      className="tron-button"
                      disabled={!isUnlocked || !afford}
                      onClick={(e) => {
                        const buttonRect = e.currentTarget.getBoundingClientRect()
                        const centerX = buttonRect.left + buttonRect.width / 2
                        const centerY = buttonRect.top + buttonRect.height / 2

                        // Trigger animation before purchase
                        animationSystem.triggerTechPurchaseAnimation(
                          n.id,
                          br.key,
                          { x: centerX, y: centerY },
                          n.tier,
                          lines
                        )

                        // Execute purchase
                        buy(n.id)
                      }}
                    >
                      {isUnlocked ? `Buy $${c.toLocaleString()}` : 'Locked'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        ))}

        {/* SVG overlay for dependency lines - positioned inside scrollable container */}
        {showDependencyGraph && (
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 1,
              overflow: 'visible'
            }}
          >
            {dependencyLines.map((line, i) => (
              <g key={`${line.from}-${line.to}-${i}`}>
                <defs>
                  <marker
                    id={`arrowhead-${i}`}
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="var(--accent)"
                      opacity="0.6"
                    />
                  </marker>
                </defs>
                <line
                  x1={line.fromPos.x}
                  y1={line.fromPos.y}
                  x2={line.toPos.x}
                  y2={line.toPos.y}
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeOpacity="0.4"
                  strokeDasharray="5,5"
                  markerEnd={`url(#arrowhead-${i})`}
                  className="dependency-line"
                />
              </g>
            ))}
          </svg>
        )}
      </div>
    </div>
  )
}
