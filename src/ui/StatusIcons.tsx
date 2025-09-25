import React from 'react'

interface StatusIconProps {
  size?: number
  className?: string
}

// Checkmark icon for purchased items
export const PurchasedIcon: React.FC<StatusIconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={`status-icon purchased-icon ${className}`}
    style={{ display: 'block', margin: 0, padding: 0, verticalAlign: 'middle' }}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      fill="currentColor"
      fillOpacity="0.1"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M8.5 12.5l2.5 2.5 4.5-5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

// Unlock icon for unlocked items
export const UnlockedIcon: React.FC<StatusIconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={`status-icon unlocked-icon ${className}`}
    style={{ display: 'block', margin: 0, padding: 0, verticalAlign: 'middle' }}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      fill="currentColor"
      fillOpacity="0.1"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect
      x="7"
      y="11"
      width="10"
      height="6"
      rx="1.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M15 11V8a3 3 0 0 0-6 0"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle
      cx="12"
      cy="14"
      r="1.2"
      fill="currentColor"
    />
  </svg>
)

// Lock icon for locked items
export const LockedIcon: React.FC<StatusIconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={`status-icon locked-icon ${className}`}
    style={{ display: 'block', margin: 0, padding: 0, verticalAlign: 'middle' }}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      fill="currentColor"
      fillOpacity="0.1"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect
      x="7"
      y="11"
      width="10"
      height="6"
      rx="1.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M15 11V8a3 3 0 0 0-6 0v3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle
      cx="12"
      cy="14"
      r="1.2"
      fill="currentColor"
    />
  </svg>
)

// Money icon for unaffordable items
export const UnaffordableIcon: React.FC<StatusIconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={`status-icon unaffordable-icon ${className}`}
    style={{ display: 'block', margin: 0, padding: 0, verticalAlign: 'middle' }}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      fill="currentColor"
      fillOpacity="0.1"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M12 6v2m0 8v2"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M9.5 10h5M9.5 14h5"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
)
