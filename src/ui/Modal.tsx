import React, { useEffect, useRef } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className = '' }) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !contentRef.current?.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div ref={modalRef} className={`modal-overlay ${className}`}>
      <div className="modal-backdrop" />
      <div className="modal-container">
        <div ref={contentRef} className="modal-content">
          {/* Animated border elements */}
          <div className="modal-border-glow" />
          <div className="modal-corner-tl" />
          <div className="modal-corner-tr" />
          <div className="modal-corner-bl" />
          <div className="modal-corner-br" />

          {/* Header */}
          <div className="modal-header">
            <div className="modal-title-container">
              <div className="modal-title-accent" />
              <h2 className="modal-title">{title}</h2>
            </div>
            <button
              className="modal-close-button"
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M15 5L5 15M5 5L15 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}