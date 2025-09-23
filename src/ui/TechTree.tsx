import React from 'react'
import { useStore } from '../state/store'
import techTree from '../../context/tech-tree.json'
import { NodeIcon } from './Icons'

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
    } else if (s === 'ship_fraction') {
      if (ef.type === 'mul') lines.push({ text: `Ship fraction ${formatPct(ef.value)}`, kind: 'ship' })
      else if (ef.type === 'add') lines.push({ text: `Ship fraction +${Math.round(ef.value * 100)}%`, kind: 'ship' })
    } else if (s === 'ship_automation') {
      if ((ef.type === 'add' && ef.value > 0) || (ef.type === 'toggle' && !!ef.value)) {
        lines.push({ text: 'Auto-ship enabled', kind: 'ship' })
      }
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

  return (
    <div className="techtree">
      {branches.map(br => (
        <div key={br.key} className="branch">
          <h3>{br.name}</h3>
          {br.nodes.map(n => {
            const isPurchased = !!purchased[n.id]
            const isUnlocked = unlocked.has(n.id)
            const c = costFor(n.id)
            const afford = revenue >= c
            const requires = (n.requires || []) as { node: string }[]
            const lines = effectLines(n)
            return (
              <div key={n.id} className="node">
                <div className="title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <NodeIcon id={n.id} />
                  <span>{n.id} · {n.name}</span>
                </div>
                <div className="cost">Cost: ${c.toLocaleString()}</div>
                {lines.length > 0 && (
                  <div className="effects">
                    {lines.map((l, i) => (
                      <div key={i} className={`effect ${l.kind}`}>• {l.text}</div>
                    ))}
                  </div>
                )}
                {requires.length>0 && (
                  <div className="req">Requires: {requires.map(r=>r.node).join(', ')}</div>
                )}
                {isPurchased ? (
                  <div className="purchased">Purchased</div>
                ) : (
                  <button disabled={!isUnlocked || !afford} onClick={() => buy(n.id)}>
                    {isUnlocked ? (afford ? 'Buy' : 'Need $') : 'Locked'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
