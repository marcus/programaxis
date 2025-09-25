import React from 'react'

const stroke = '#9bb1c9'
const sw = 1.5

export const ShipIcon: React.FC<{ size?: number }> = ({ size=16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 13l9-9 9 9v7a1 1 0 0 1-1 1h-4v-6H8v6H4a1 1 0 0 1-1-1v-7z" stroke={stroke} strokeWidth={sw}/>
  </svg>
)

export const NodeIcon: React.FC<{ id: string, size?: number }> = ({ id, size=20 }) => {
  switch (id) {
    // A — AI Models
    case 'A0': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="10" height="8" rx="1" stroke={stroke} strokeWidth={sw}/>
        <rect x="10" y="10" width="10" height="8" rx="1" stroke={stroke} strokeWidth={sw} opacity="0.8"/>
        <path d="M6 7h6M6 9h4" stroke={stroke} strokeWidth={sw} />
      </svg>
    )
    case 'A1': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6h16M4 12h10" stroke={stroke} strokeWidth={sw}/>
        <path d="M15 5l-2 4h3l-2 4" stroke={stroke} strokeWidth={sw} />
      </svg>
    )
    case 'A2': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="2" stroke={stroke} strokeWidth={sw}/>
        <circle cx="16" cy="8" r="2" stroke={stroke} strokeWidth={sw}/>
        <circle cx="12" cy="16" r="2" stroke={stroke} strokeWidth={sw}/>
        <path d="M10 9.5L12 14M14 9.5L12 14M9.8 8h4.4" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'A3': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 11a4 4 0 1 1 8 0c0 2-2 4-4 6-2-2-4-4-4-6z" stroke={stroke} strokeWidth={sw}/>
        <path d="M12 3v3M21 12h-3M12 21v-3M3 12h3" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'A4': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3l2 4 4 .6-3 3 .7 4.4-3.7-2-3.7 2 .7-4.4-3-3 4-.6 2-4z" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )

    // B — Editor & Tools
    case 'B0': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="5" width="16" height="14" rx="2" stroke={stroke} strokeWidth={sw}/>
        <path d="M7 9h10M7 12h10M7 15h6" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'B1': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="5" width="16" height="14" rx="2" stroke={stroke} strokeWidth={sw}/>
        <path d="M8 13l3 3 5-7" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'B2': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="5" width="16" height="14" rx="2" stroke={stroke} strokeWidth={sw}/>
        <path d="M8 10h8M8 13h5" stroke={stroke} strokeWidth={sw}/>
        <path d="M7 8l2 2-2 2" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'B3': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="10" width="8" height="4" rx="2" stroke={stroke} strokeWidth={sw}/>
        <rect x="13" y="10" width="8" height="4" rx="2" stroke={stroke} strokeWidth={sw}/>
        <path d="M7 14l2 3M17 14l-2 3" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'B4': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 15l7-10 7 10H5z" stroke={stroke} strokeWidth={sw}/>
        <path d="M9 15l3 3 3-3" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )

    // C — Hardware / Compute
    case 'C0': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="6" width="14" height="10" rx="2" stroke={stroke} strokeWidth={sw}/>
        <path d="M9 18h6" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'C1': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="6" width="12" height="12" rx="2" stroke={stroke} strokeWidth={sw}/>
        <path d="M10 6v-2M14 6V4M10 20v-2M14 20v-2M6 10H4M6 14H4M20 10h-2M20 14h-2" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'C2': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="5" stroke={stroke} strokeWidth={sw}/>
        <path d="M12 7v3M12 17v-3M7 12h3M17 12h-3" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'C3': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 10a5 5 0 1 1 10 0v4a5 5 0 1 1-10 0v-4z" stroke={stroke} strokeWidth={sw}/>
        <path d="M8 12h8M12 8v8" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'C4': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="6" stroke={stroke} strokeWidth={sw}/>
        <circle cx="12" cy="12" r="1" fill={stroke}/>
        <path d="M12 6a6 6 0 0 1 5.2 3" stroke={stroke} strokeWidth={sw}/>
        <path d="M6.8 15A6 6 0 0 1 12 6" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )

    // D — Ergonomics
    case 'D0': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="8" width="8" height="6" rx="2" stroke={stroke} strokeWidth={sw}/>
        <path d="M6 14h10M14 14v4" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'D1': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="5" width="7" height="5" rx="1" stroke={stroke} strokeWidth={sw}/>
        <rect x="13" y="5" width="7" height="5" rx="1" stroke={stroke} strokeWidth={sw}/>
        <path d="M8 15h4M10 10v9" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'D2': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="9" width="14" height="3" rx="1.5" stroke={stroke} strokeWidth={sw}/>
        <path d="M8 12v5M16 12v5M12 9V5" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'D3': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 7a3 3 0 0 1 3 3c0 3-3 5-3 5s-3-2-3-5a3 3 0 0 1 3-3z" stroke={stroke} strokeWidth={sw}/>
        <path d="M12 4v2M12 20v-2" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'D4': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 11a4 4 0 1 1 8 0c0 2-2 4-4 6-2-2-4-4-4-6z" stroke={stroke} strokeWidth={sw}/>
        <path d="M6 10h2M16 10h2M12 6v-2M12 20v-2" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )

    // E — Agents
    case 'E0': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="2" stroke={stroke} strokeWidth={sw}/>
        <path d="M8 18a4 4 0 1 1 8 0" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'E1': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="8" r="2" stroke={stroke} strokeWidth={sw}/>
        <circle cx="15" cy="8" r="2" stroke={stroke} strokeWidth={sw}/>
        <path d="M6 18a4 4 0 0 1 6-3.5A4 4 0 0 1 18 18" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'E2': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="7.5" cy="8" r="2" stroke={stroke} strokeWidth={sw}/>
        <circle cx="12" cy="8" r="2" stroke={stroke} strokeWidth={sw}/>
        <circle cx="16.5" cy="8" r="2" stroke={stroke} strokeWidth={sw}/>
        <path d="M5 18a4 4 0 0 1 4-3.5M15 14.5A4 4 0 0 1 20 18" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'E3': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="1.5" stroke={stroke} strokeWidth={sw}/>
        <circle cx="12" cy="8" r="1.5" stroke={stroke} strokeWidth={sw}/>
        <circle cx="16" cy="8" r="1.5" stroke={stroke} strokeWidth={sw}/>
        <circle cx="10" cy="13" r="1.5" stroke={stroke} strokeWidth={sw}/>
        <circle cx="14" cy="13" r="1.5" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'E4': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="6" width="14" height="12" rx="2" stroke={stroke} strokeWidth={sw}/>
        <path d="M8 10h8M8 13h6M8 16h4" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )

    // F — Marketing
    case 'F0': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 8h8l4-2v8l-4-2H6z" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'F1': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 10l8-3v10l-8-3v-4z" stroke={stroke} strokeWidth={sw}/>
        <path d="M17 9v6" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'F2': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 6h14M8 10h8M10 14h4M11 18h2" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'F3': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="2" stroke={stroke} strokeWidth={sw}/>
        <circle cx="5" cy="8" r="1.5" stroke={stroke} strokeWidth={sw}/>
        <circle cx="19" cy="8" r="1.5" stroke={stroke} strokeWidth={sw}/>
        <circle cx="6" cy="17" r="1.5" stroke={stroke} strokeWidth={sw}/>
        <circle cx="18" cy="17" r="1.5" stroke={stroke} strokeWidth={sw}/>
        <path d="M12 10V6M12 14v4M7 8h10M6.5 16.5L12 12m5.5 4.5L12 12" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'F4': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 9l3-3 4 3 4-3 3 3v10H5V9z" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )

    // G — Platforms & Features
    case 'G0': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="6" width="16" height="10" rx="2" stroke={stroke} strokeWidth={sw}/>
        <path d="M9 18h6" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'G1': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="7" y="4" width="10" height="16" rx="2" stroke={stroke} strokeWidth={sw}/>
        <path d="M9 7h6M10 17h4" stroke={stroke} strokeWidth={sw}/>
        <path d="M5 15l2 2 3-4" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'G2': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="7" stroke={stroke} strokeWidth={sw}/>
        <path d="M5 12h14M12 5a10 10 0 0 1 0 14M12 5a10 10 0 0 0 0 14" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'G3': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="10" width="8" height="4" rx="2" stroke={stroke} strokeWidth={sw}/>
        <rect x="13" y="10" width="8" height="4" rx="2" stroke={stroke} strokeWidth={sw}/>
        <path d="M12 6a6 6 0 0 1 6 6M12 18a6 6 0 0 0 6-6" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'G4': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="7" stroke={stroke} strokeWidth={sw}/>
        <path d="M12 5v14M5 12h14M8 8l8 8M8 16l8-8" stroke={stroke} strokeWidth={sw} opacity="0.6"/>
      </svg>
    )

    // H — Graphics & Content Gen
    case 'H0': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 15l4-4 4 4-4 4H5v-4z" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'H1': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="12" r="4" stroke={stroke} strokeWidth={sw}/>
        <circle cx="14.5" cy="10.5" r="1" fill={stroke}/>
        <circle cx="12.5" cy="14.5" r="1" fill={stroke}/>
      </svg>
    )
    case 'H2': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 17l3-7 3 7 2-4 2 4" stroke={stroke} strokeWidth={sw}/>
        <path d="M6 7l2 2M14 6l2 2M10 5l1 2" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'H3': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 8l4-2 4 2v4l-4 2-4-2V8z" stroke={stroke} strokeWidth={sw}/>
        <path d="M6 16l2-1" stroke={stroke} strokeWidth={sw}/>
        <path d="M16 16l2 1" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'H4': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="6" stroke={stroke} strokeWidth={sw}/>
        <path d="M12 6v12M6 12h12M8.5 8.5l7 7M8.5 15.5l7-7" stroke={stroke} strokeWidth={sw} opacity="0.6"/>
      </svg>
    )

    // I — Shipping & CI/CD
    case 'I0': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="10" width="16" height="8" rx="2" stroke={stroke} strokeWidth={sw}/>
        <path d="M8 14h8M10 16h4" stroke={stroke} strokeWidth={sw}/>
        <path d="M12 10V8M12 8l-2 2M12 8l2 2" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'I1': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="12" r="2" stroke={stroke} strokeWidth={sw}/>
        <circle cx="16" cy="12" r="2" stroke={stroke} strokeWidth={sw}/>
        <path d="M10 12h4" stroke={stroke} strokeWidth={sw}/>
        <path d="M8 10V8M8 8l-1 1M8 8l1 1" stroke={stroke} strokeWidth={sw}/>
        <path d="M16 14v2M16 16l-1-1M16 16l1-1" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'I2': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="8" width="6" height="8" rx="1" stroke={stroke} strokeWidth={sw}/>
        <rect x="14" y="8" width="6" height="8" rx="1" stroke={stroke} strokeWidth={sw}/>
        <path d="M10 12h4" stroke={stroke} strokeWidth={sw}/>
        <path d="M11 12l1-2M13 12l-1 2" stroke={stroke} strokeWidth={sw}/>
        <circle cx="7" cy="12" r="1" fill={stroke}/>
        <circle cx="17" cy="12" r="1" fill={stroke}/>
      </svg>
    )
    case 'I3': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 12c0-4 4-8 8-8s8 4 8 8-4 8-8 8-8-4-8-8" stroke={stroke} strokeWidth={sw}/>
        <path d="M8 12h8M12 8v8" stroke={stroke} strokeWidth={sw}/>
        <path d="M12 8l-2 2M12 8l2 2M12 16l-2-2M12 16l2-2" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'I4': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3l2 4 4 .6-3 3 .7 4.4-3.7-2-3.7 2 .7-4.4-3-3 4-.6 2-4z" stroke={stroke} strokeWidth={sw}/>
        <path d="M12 12l4-4M12 12l-4 4M12 12l4 4M12 12l-4-4" stroke={stroke} strokeWidth={sw} opacity="0.4"/>
      </svg>
    )
    case 'I5': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" stroke={stroke} strokeWidth={sw}/>
        <path d="M8 12l2 2 4-4" stroke={stroke} strokeWidth={sw}/>
        <path d="M12 4a8 8 0 0 1 0 16M12 20a8 8 0 0 1 0-16" stroke={stroke} strokeWidth={sw} opacity="0.6"/>
      </svg>
    )
    case 'I6': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth={sw}/>
        <path d="M12 8v8M8 12h8" stroke={stroke} strokeWidth={sw}/>
        <circle cx="12" cy="12" r="3" stroke={stroke} strokeWidth={sw} fill="none"/>
        <path d="M12 3v2M12 19v2M21 12h-2M5 12H3" stroke={stroke} strokeWidth={sw} opacity="0.7"/>
      </svg>
    )

    // Missing high-tier icons for other branches
    case 'A5': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="6" stroke={stroke} strokeWidth={sw}/>
        <path d="M12 6a6 6 0 0 1 0 12M6 12a6 6 0 0 1 12 0" stroke={stroke} strokeWidth={sw}/>
        <circle cx="12" cy="12" r="2" fill={stroke}/>
        <path d="M12 8v8M8 12h8" stroke={stroke} strokeWidth={sw} opacity="0.6"/>
      </svg>
    )
    case 'A6': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7l3-7z" stroke={stroke} strokeWidth={sw} fill="none"/>
        <circle cx="12" cy="12" r="4" stroke={stroke} strokeWidth={sw} opacity="0.6"/>
        <path d="M12 8v8M8 12h8" stroke={stroke} strokeWidth={sw} opacity="0.4"/>
      </svg>
    )
    case 'B5': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="8" width="16" height="8" rx="4" stroke={stroke} strokeWidth={sw}/>
        <circle cx="8" cy="12" r="2" stroke={stroke} strokeWidth={sw}/>
        <circle cx="16" cy="12" r="2" stroke={stroke} strokeWidth={sw}/>
        <path d="M8 4v4M16 4v4M8 16v4M16 16v4" stroke={stroke} strokeWidth={sw} opacity="0.6"/>
      </svg>
    )
    case 'B6': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" stroke={stroke} strokeWidth={sw}/>
        <path d="M8 8l8 8M16 8l-8 8" stroke={stroke} strokeWidth={sw} opacity="0.3"/>
        <circle cx="12" cy="12" r="3" stroke={stroke} strokeWidth={sw}/>
        <path d="M12 9v6M9 12h6" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'C5': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 6h12v12H6V6z" stroke={stroke} strokeWidth={sw}/>
        <path d="M6 6l12 12M18 6L6 18" stroke={stroke} strokeWidth={sw} opacity="0.4"/>
        <circle cx="9" cy="9" r="1" fill={stroke}/>
        <circle cx="15" cy="9" r="1" fill={stroke}/>
        <circle cx="9" cy="15" r="1" fill={stroke}/>
        <circle cx="15" cy="15" r="1" fill={stroke}/>
      </svg>
    )
    case 'C6': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="12,2 15,8 22,8 17,12 19,20 12,16 5,20 7,12 2,8 9,8" stroke={stroke} strokeWidth={sw} fill="none"/>
        <circle cx="12" cy="12" r="6" stroke={stroke} strokeWidth={sw} opacity="0.3"/>
        <path d="M12 6v12M6 12h12" stroke={stroke} strokeWidth={sw} opacity="0.5"/>
      </svg>
    )
    case 'D5': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="14" height="14" rx="2" stroke={stroke} strokeWidth={sw}/>
        <path d="M9 12l2 2 4-4" stroke={stroke} strokeWidth={sw}/>
        <path d="M5 9h14M5 15h14" stroke={stroke} strokeWidth={sw} opacity="0.4"/>
        <circle cx="8" cy="8" r="1" fill={stroke} opacity="0.6"/>
        <circle cx="16" cy="8" r="1" fill={stroke} opacity="0.6"/>
      </svg>
    )
    case 'D6': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth={sw}/>
        <path d="M8 12l2 2 4-4" stroke={stroke} strokeWidth={sw}/>
        <circle cx="12" cy="12" r="5" stroke={stroke} strokeWidth={sw} opacity="0.4"/>
        <circle cx="12" cy="12" r="2" stroke={stroke} strokeWidth={sw}/>
        <path d="M12 3v2M12 19v2M21 12h-2M5 12H3" stroke={stroke} strokeWidth={sw} opacity="0.6"/>
      </svg>
    )
    case 'E5': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="6" width="16" height="12" rx="2" stroke={stroke} strokeWidth={sw}/>
        <circle cx="8" cy="10" r="1" fill={stroke}/>
        <circle cx="12" cy="10" r="1" fill={stroke}/>
        <circle cx="16" cy="10" r="1" fill={stroke}/>
        <circle cx="6" cy="14" r="1" fill={stroke}/>
        <circle cx="10" cy="14" r="1" fill={stroke}/>
        <circle cx="14" cy="14" r="1" fill={stroke}/>
        <circle cx="18" cy="14" r="1" fill={stroke}/>
      </svg>
    )
    case 'E6': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" stroke={stroke} strokeWidth={sw}/>
        <circle cx="9" cy="9" r="1.5" fill={stroke}/>
        <circle cx="15" cy="9" r="1.5" fill={stroke}/>
        <circle cx="6" cy="12" r="1.5" fill={stroke}/>
        <circle cx="12" cy="12" r="1.5" fill={stroke}/>
        <circle cx="18" cy="12" r="1.5" fill={stroke}/>
        <circle cx="9" cy="15" r="1.5" fill={stroke}/>
        <circle cx="15" cy="15" r="1.5" fill={stroke}/>
      </svg>
    )
    case 'F5': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="7" stroke={stroke} strokeWidth={sw}/>
        <path d="M8 8l8 8M16 8l-8 8" stroke={stroke} strokeWidth={sw} opacity="0.3"/>
        <circle cx="6" cy="6" r="2" stroke={stroke} strokeWidth={sw}/>
        <circle cx="18" cy="6" r="2" stroke={stroke} strokeWidth={sw}/>
        <circle cx="6" cy="18" r="2" stroke={stroke} strokeWidth={sw}/>
        <circle cx="18" cy="18" r="2" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'F6': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 12h18M12 3v18" stroke={stroke} strokeWidth={sw}/>
        <circle cx="12" cy="12" r="6" stroke={stroke} strokeWidth={sw}/>
        <path d="M8 8l8 8M16 8l-8 8" stroke={stroke} strokeWidth={sw} opacity="0.4"/>
        <circle cx="12" cy="12" r="2" fill={stroke}/>
      </svg>
    )
    case 'G5': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="4" width="12" height="16" rx="2" stroke={stroke} strokeWidth={sw}/>
        <rect x="4" y="8" width="16" height="8" rx="2" stroke={stroke} strokeWidth={sw} opacity="0.6"/>
        <path d="M10 12h4M12 10v4" stroke={stroke} strokeWidth={sw}/>
      </svg>
    )
    case 'G6': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" stroke={stroke} strokeWidth={sw}/>
        <path d="M12 4a8 8 0 0 0 0 16M12 20a8 8 0 0 0 0-16" stroke={stroke} strokeWidth={sw}/>
        <circle cx="12" cy="12" r="4" stroke={stroke} strokeWidth={sw}/>
        <path d="M8 8l8 8M16 8l-8 8" stroke={stroke} strokeWidth={sw} opacity="0.3"/>
      </svg>
    )
    case 'H5': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3l2 4 4 .6-3 3 .7 4.4-3.7-2-3.7 2 .7-4.4-3-3 4-.6 2-4z" stroke={stroke} strokeWidth={sw}/>
        <circle cx="12" cy="12" r="6" stroke={stroke} strokeWidth={sw} opacity="0.4"/>
        <path d="M8 8l8 8M16 8l-8 8" stroke={stroke} strokeWidth={sw} opacity="0.2"/>
      </svg>
    )
    case 'H6': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth={sw}/>
        <path d="M8 12l2 2 4-4" stroke={stroke} strokeWidth={sw}/>
        <path d="M12 3l2 4 4 .6-3 3 .7 4.4-3.7-2-3.7 2 .7-4.4-3-3 4-.6 2-4z" stroke={stroke} strokeWidth={sw} opacity="0.3"/>
        <circle cx="12" cy="12" r="2" fill={stroke}/>
      </svg>
    )
  }
  // Default generic chip
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="12" height="12" rx="2" stroke={stroke} strokeWidth={sw}/>
    </svg>
  )
}
