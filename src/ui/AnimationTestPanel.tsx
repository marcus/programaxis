import React, { useState } from 'react'
import { animationSystem } from '../game/animationSystem'
import { actionAnimationSystem } from '../game/actionAnimationSystem'

export const AnimationTestPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  const testAnimations = [
    {
      id: 'A1',
      branch: 'A',
      name: 'Programming Test',
      effects: [{ text: 'LoC/click +50%', kind: 'loc' as const }]
    },
    {
      id: 'B2',
      branch: 'B',
      name: 'Automation Test',
      effects: [{ text: 'Auto-ship enabled', kind: 'ship' as const }]
    },
    {
      id: 'F3',
      branch: 'F',
      name: 'Revenue Test',
      effects: [{ text: 'Revenue +25%', kind: 'revenue' as const }]
    },
    {
      id: 'H1',
      branch: 'H',
      name: 'Quality Test',
      effects: [{ text: 'Bug reduction -30%', kind: 'global' as const }]
    }
  ]

  const actionTestAnimations = [
    { type: 'write-code' as const, name: 'Write Code', color: '#5ad6a0' },
    { type: 'ship-build' as const, name: 'Ship Build', color: '#ffca5f' },
    { type: 'pay-debt' as const, name: 'Pay Debt', color: '#f45b69' }
  ]

  const triggerTestAnimation = (test: typeof testAnimations[0]) => {
    // Get random position on screen for testing
    const x = Math.random() * (window.innerWidth - 200) + 100
    const y = Math.random() * (window.innerHeight - 200) + 100

    animationSystem.triggerTechPurchaseAnimation(
      test.id,
      test.branch,
      { x, y },
      Math.floor(Math.random() * 5) + 1, // Random tier 1-5
      test.effects
    )
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 9999,
          padding: '8px 12px',
          backgroundColor: '#2a3441',
          color: '#5ad6a0',
          border: '1px solid #5ad6a0',
          borderRadius: '4px',
          fontSize: '12px',
          cursor: 'pointer',
          fontFamily: 'monospace'
        }}
        title="Open animation test panel"
      >
        🎨 Test
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 9999,
      backgroundColor: '#121821',
      border: '1px solid #243044',
      borderRadius: '8px',
      padding: '16px',
      minWidth: '200px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '14px',
          color: '#5ad6a0',
          fontFamily: 'monospace'
        }}>
          🎨 Animation Tests
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#9bb1c9',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '0'
          }}
          title="Close test panel"
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {testAnimations.map(test => (
          <button
            key={test.id}
            onClick={() => triggerTestAnimation(test)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#2a3441',
              color: '#e5eef5',
              border: '1px solid #243044',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3a4451'
              e.currentTarget.style.borderColor = animationSystem.getBranchColor(test.branch)
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2a3441'
              e.currentTarget.style.borderColor = '#243044'
            }}
            title={`Test ${test.name} animation at random position`}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
              {test.branch}: {test.name}
            </div>
            <div style={{ fontSize: '10px', color: '#9bb1c9' }}>
              {test.effects[0].text}
            </div>
          </button>
        ))}

        <div style={{
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid #243044'
        }}>
          <h4 style={{
            margin: '0 0 8px 0',
            fontSize: '12px',
            color: '#ffca5f',
            fontFamily: 'monospace'
          }}>
            🎯 Action Buttons
          </h4>
          {actionTestAnimations.map(action => (
            <button
              key={action.type}
              onClick={() => {
                const x = Math.random() * (window.innerWidth - 200) + 100
                const y = Math.random() * (window.innerHeight - 200) + 100

                switch (action.type) {
                  case 'write-code':
                    actionAnimationSystem.triggerWriteCodeAnimation({ x, y }, Math.random())
                    break
                  case 'ship-build':
                    actionAnimationSystem.triggerShipBuildAnimation({ x, y }, Math.random())
                    break
                  case 'pay-debt':
                    actionAnimationSystem.triggerPayDebtAnimation({ x, y }, Math.random())
                    break
                }
              }}
              style={{
                width: '100%',
                marginBottom: '4px',
                padding: '6px 12px',
                backgroundColor: '#2a3441',
                color: action.color,
                border: `1px solid ${action.color}40`,
                borderRadius: '4px',
                fontSize: '11px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${action.color}15`
                e.currentTarget.style.borderColor = action.color
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2a3441'
                e.currentTarget.style.borderColor = `${action.color}40`
              }}
              title={`Test ${action.name} animation`}
            >
              {action.name} Animation
            </button>
          ))}
        </div>

        <div style={{
          marginTop: '8px',
          padding: '8px',
          backgroundColor: '#0b0f14',
          borderRadius: '4px',
          fontSize: '10px',
          color: '#9bb1c9',
          lineHeight: '1.4'
        }}>
          <strong>Tips:</strong><br/>
          • Tech animations: Random positions, branch-specific<br/>
          • Action animations: Subtle, performance-optimized<br/>
          • Real buttons trigger at actual positions<br/>
          • Check performance with multiple rapid clicks
        </div>
      </div>
    </div>
  )
}