import React from 'react'
import { Modal } from './Modal'

interface CodeHealthInfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CodeHealthInfoModal: React.FC<CodeHealthInfoModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Code Health Mechanics">
      <div className="code-health-info">
        <div className="info-section">
          <div className="info-header">
            <div className="info-icon">⚡</div>
            <h3>Quality</h3>
          </div>
          <p>
            <strong>Direct revenue multiplier</strong> that affects how much money you earn per LoC shipped.
          </p>
          <ul>
            <li><strong>Base:</strong> 1.0x (no bonus)</li>
            <li><strong>Color coding:</strong> Red → Orange → Yellow → Green → Cyan</li>
            <li><strong>Tech upgrades:</strong> Programming and Testing branches improve quality</li>
            <li><strong>Impact:</strong> Higher quality = more revenue per shipped line</li>
          </ul>
        </div>

        <div className="info-section">
          <div className="info-header">
            <div className="info-icon">🐛</div>
            <h3>Bug-Free Rate</h3>
          </div>
          <p>
            <strong>Percentage of code that works correctly</strong> - affects your revenue multiplier based on the formula: <code>revenue × (2 - bug_rate)</code>
          </p>
          <ul>
            <li><strong>Base:</strong> Varies by tech tree progression</li>
            <li><strong>Range:</strong> 0% (all buggy) to 100% (bug-free)</li>
            <li><strong>Formula:</strong> At 50% bug-free, you get 1.5x revenue. At 100%, you get 2x revenue</li>
            <li><strong>Upgrades:</strong> Testing and Quality branches reduce bugs</li>
          </ul>
        </div>

        <div className="info-section">
          <div className="info-header">
            <div className="info-icon">🧪</div>
            <h3>Test Coverage</h3>
          </div>
          <p>
            <strong>Determines how much code gets shipped</strong> when you click "Ship Build" or auto-ship triggers.
          </p>
          <ul>
            <li><strong>Base:</strong> Typically starts around 20-30%</li>
            <li><strong>Impact:</strong> Higher coverage = more LoC converted to revenue per ship action</li>
            <li><strong>Synergy:</strong> Works with ship fraction calculations</li>
            <li><strong>Upgrades:</strong> Testing branch nodes directly improve coverage</li>
          </ul>
        </div>

        <div className="info-section danger">
          <div className="info-header">
            <div className="info-icon">⚠️</div>
            <h3>Tech Debt</h3>
          </div>
          <p>
            <strong>Accumulates over time</strong> and reduces your shipping efficiency with a penalty of <code>-(debt/1000)%</code>
          </p>
          <ul>
            <li><strong>Growth:</strong> Accumulates at 0.1/sec × tech_debt_growth multiplier</li>
            <li><strong>Penalty:</strong> At 100 debt = -10% ship efficiency, 500 debt = -50%</li>
            <li><strong>Paydown:</strong> Convert LoC to reduce debt (costs 2 LoC per 1 debt reduced)</li>
            <li><strong>Prevention:</strong> Automation and Infrastructure branches reduce debt growth</li>
            <li><strong>Benefit:</strong> Some nodes can convert debt into refactor bonuses</li>
          </ul>
        </div>

        <div className="info-section strategy">
          <div className="info-header">
            <div className="info-icon">💡</div>
            <h3>Strategic Tips</h3>
          </div>
          <ul>
            <li><strong>Early game:</strong> Focus on basic quality and test coverage improvements</li>
            <li><strong>Mid game:</strong> Balance debt management with revenue optimization</li>
            <li><strong>Late game:</strong> Aim for high quality multipliers and automated debt reduction</li>
            <li><strong>Synergies:</strong> Quality × Bug-Free × Test Coverage = compound revenue gains</li>
            <li><strong>Automation:</strong> Higher tier nodes often provide passive debt management</li>
          </ul>
        </div>

        <div className="info-section formula">
          <div className="info-header">
            <div className="info-icon">📊</div>
            <h3>Revenue Formula</h3>
          </div>
          <div className="formula-box">
            <code>
              Final Revenue = Base LoC × Quality × (2 - Bug Rate) × Features Multiplier × Revenue Multiplier × Price Premium × Market Expansion
            </code>
          </div>
          <p>
            Code health metrics (Quality and Bug-Free Rate) are <strong>multiplicative</strong>, meaning small improvements compound significantly over time.
          </p>
        </div>
      </div>
    </Modal>
  )
}