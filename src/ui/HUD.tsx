import React from 'react'
import { useStore } from '../state/store'
import { Milestones } from './Milestones'

function fmt(n: number, digits = 2) {
  if (!isFinite(n)) return '0'
  if (Math.abs(n) >= 1_000_000_000_000) return (n/1_000_000_000_000).toFixed(digits)+'T'
  if (Math.abs(n) >= 1_000_000_000) return (n/1_000_000_000).toFixed(digits)+'B'
  if (Math.abs(n) >= 1_000_000) return (n/1_000_000).toFixed(digits)+'M'
  if (Math.abs(n) >= 1_000) return (n/1_000).toFixed(digits)+'K'
  return n.toFixed(digits)
}

export const HUD: React.FC = () => {
  const loc = useStore(s => s.resources.loc)
  const revenue = useStore(s => s.resources.revenue)
  const uiLocPerSec = useStore(s => s.resources.uiLocPerSec)
  const uiRevPerSec = useStore(s => s.resources.uiRevPerSec)
  const bufferedLoc = useStore(s => s.systems.shipping.bufferedLoc)
  const autoShip = useStore(s => s.systems.shipping.auto)
  const shipAutomation = useStore(s => s.stats.ship_automation)
  const onClick = useStore(s => s.click)
  const onShip = useStore(s => s.shipNow)
  const caps = useStore(s => s.caps)

  return (
    <div>
      <div className="hud-grid">
        <div className="stat">
          <div className="label">LoC</div>
          <div className="value">{fmt(loc)}</div>
          <div className="label">LoC/s {fmt(uiLocPerSec)}</div>
        </div>
        <div className="stat">
          <div className="label">Revenue</div>
          <div className="value">${fmt(revenue)}</div>
          <div className="label">Rev/s ${fmt(uiRevPerSec)}</div>
        </div>
        <div className="stat">
          <div className="label">Buffered LoC</div>
          <div className="value">{fmt(bufferedLoc)}</div>
          <div className="label">Ship {((useStore.getState().stats.ship_fraction||0)*100).toFixed(0)}% per action</div>
        </div>
        <div className="stat">
          <div className="label">Caps</div>
          <div className="value">Agents: {caps.agentConcurrencyCap} • Jobs: {caps.parallelismCap}</div>
        </div>
      </div>

      <div className="actions">
        <button onClick={onClick}>Write Code (+LoC)</button>
        <button onClick={onShip} disabled={autoShip || shipAutomation > 0}>{autoShip || shipAutomation>0 ? 'Ship (Auto)' : 'Ship Build'}</button>
      </div>

      <Milestones compact />
    </div>
  )
}
