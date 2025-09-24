import { useStore } from '../state/store'

export const UpgradeIndicator = () => {
  const nodeById = useStore(s => s.nodeById)
  const canBuy = useStore(s => s.canBuy)

  const availableUpgrades = Object.keys(nodeById).filter(nodeId => canBuy(nodeId)).length

  if (availableUpgrades === 0) {
    return null
  }

  return (
    <div className="upgrade-indicator">
      <span className="upgrade-count">{availableUpgrades}</span>
      <span className="upgrade-label">upgrade{availableUpgrades !== 1 ? 's' : ''} available</span>
    </div>
  )
}