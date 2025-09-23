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
            return (
              <div key={n.id} className="node">
                <div className="title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <NodeIcon id={n.id} />
                  <span>{n.id} · {n.name}</span>
                </div>
                <div className="cost">Cost: ${c.toLocaleString()}</div>
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
