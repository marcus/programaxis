import React from 'react'

export const ShipIcon: React.FC<{ size?: number }> = ({ size=16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 13l9-9 9 9v7a1 1 0 0 1-1 1h-4v-6H8v6H4a1 1 0 0 1-1-1v-7z" stroke="#9bb1c9" strokeWidth="1.5"/>
  </svg>
)
