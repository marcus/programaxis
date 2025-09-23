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
      d="M8 12.5l3 3 5-6"
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
  >
    <rect
      x="6"
      y="11"
      width="12"
      height="8"
      rx="2"
      fill="currentColor"
      fillOpacity="0.1"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M16 11V7a4 4 0 0 0-8 0"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle
      cx="12"
      cy="15"
      r="1.5"
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
  >
    <rect
      x="6"
      y="11"
      width="12"
      height="8"
      rx="2"
      fill="currentColor"
      fillOpacity="0.1"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M16 11V7a4 4 0 0 0-8 0v4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle
      cx="12"
      cy="15"
      r="1.5"
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
      d="M12 6v2m0 8v2m-4-8h8M8 14h8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)