import React from 'react'
import { Modal } from './Modal'

interface IntroModalProps {
  isOpen: boolean
  onClose: () => void
}

export const IntroModal: React.FC<IntroModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Welcome to Programaxis"
      className="intro-modal"
    >
      <div className="intro-content">
        {/* Hero Section */}
        <div className="intro-hero">
          <div className="intro-tagline">
            <span className="intro-highlight">Build features, ship, grow revenue.</span>
          </div>
          <p className="intro-description">
            You're about to enter the world of automated software development.
            Start small, scale big, and watch your coding empire grow with stunning visual effects.
          </p>
        </div>

        {/* Quick Start Guide */}
        <div className="intro-guide">
          <h3 className="intro-section-title">
            <span className="intro-step-icon">⚡</span>
            Quick Start Guide
          </h3>

          <div className="intro-steps">
            <div className="intro-step">
              <div className="intro-step-number">1</div>
              <div className="intro-step-content">
                <h4>Click "Write Code"</h4>
                <p>Generate Lines of Code (LoC) - your primary resource. <strong>Keep clicking!</strong> In idle games, every click counts and builds momentum.</p>
              </div>
            </div>

            <div className="intro-step">
              <div className="intro-step-number">2</div>
              <div className="intro-step-content">
                <h4>Click "Ship Build"</h4>
                <p>Convert your LoC into Revenue to fund your growth. Watch those numbers rise with satisfying particle effects!</p>
              </div>
            </div>

            <div className="intro-step">
              <div className="intro-step-number">3</div>
              <div className="intro-step-content">
                <h4>Purchase Tech Upgrades</h4>
                <p>Use Revenue to unlock amazing technologies that automate your workflow. Each purchase triggers epic 3D animations!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="intro-features">
          <h3 className="intro-section-title">
            <span className="intro-step-icon">🚀</span>
            What Makes This Special
          </h3>

          <div className="intro-feature-grid">
            <div className="intro-feature">
              <div className="intro-feature-icon">🎨</div>
              <h4>Epic Animations</h4>
              <p>Three.js particle systems make every action feel incredible</p>
            </div>

            <div className="intro-feature">
              <div className="intro-feature-icon">🔄</div>
              <h4>Idle Progression</h4>
              <p>Keep earning even when you're away - true idle game mechanics</p>
            </div>

            <div className="intro-feature">
              <div className="intro-feature-icon">🌳</div>
              <h4>Deep Tech Tree</h4>
              <p>40+ upgrades across 8 specialized branches of development</p>
            </div>

            <div className="intro-feature">
              <div className="intro-feature-icon">⚖️</div>
              <div>
                <h4>Strategic Balance</h4>
                <p>Manage technical debt vs. feature velocity like a real developer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="intro-cta">
          <div className="intro-cta-text">
            <strong>Ready to begin your coding journey?</strong>
            <br />
            <span className="intro-cta-hint">💡 Pro tip: Start by clicking "Write Code" several times to get a feel for the game!</span>
          </div>

          <button
            className="intro-start-button tron-button"
            onClick={onClose}
          >
            <span className="intro-button-text">Start Building</span>
            <span className="intro-button-icon">→</span>
          </button>
        </div>

        {/* Footer Note */}
        <div className="intro-footer">
          <p>Your progress saves automatically. Welcome to the future of idle gaming! 🎮</p>
        </div>
      </div>
    </Modal>
  )
}