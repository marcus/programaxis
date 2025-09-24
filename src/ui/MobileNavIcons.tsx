interface IconProps {
  className?: string
}

export const StatsIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    {/* Futuristic data visualization bars */}
    <rect x="3" y="16" width="3" height="5" rx="0.5" />
    <rect x="7" y="12" width="3" height="9" rx="0.5" />
    <rect x="11" y="8" width="3" height="13" rx="0.5" />
    <rect x="15" y="4" width="3" height="17" rx="0.5" />
    <rect x="19" y="10" width="3" height="11" rx="0.5" />

    {/* Circuit-like connections */}
    <path d="M4.5 15.5V13a1 1 0 011-1h2a1 1 0 011 1v-1a1 1 0 011-1h2a1 1 0 011 1v-4a1 1 0 011-1h2a1 1 0 011 1v4.5"
          strokeWidth="1"
          opacity="0.6" />

    {/* Glowing data points */}
    <circle cx="4.5" cy="3" r="1" fill="currentColor" opacity="0.8" />
    <circle cx="8.5" cy="2.5" r="0.8" fill="currentColor" opacity="0.6" />
    <circle cx="12.5" cy="2" r="0.6" fill="currentColor" opacity="0.4" />
  </svg>
)

export const TechTreeIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    {/* Central hub */}
    <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.3" />
    <circle cx="12" cy="12" r="2.5" strokeWidth="2" />

    {/* Primary nodes */}
    <circle cx="6" cy="6" r="1.5" />
    <circle cx="18" cy="6" r="1.5" />
    <circle cx="6" cy="18" r="1.5" />
    <circle cx="18" cy="18" r="1.5" />

    {/* Secondary nodes */}
    <circle cx="3" cy="12" r="1" />
    <circle cx="21" cy="12" r="1" />
    <circle cx="12" cy="3" r="1" />
    <circle cx="12" cy="21" r="1" />

    {/* Connections - tech tree branches */}
    <path d="M9.5 9.5L6 6" strokeWidth="1" opacity="0.7" />
    <path d="M14.5 9.5L18 6" strokeWidth="1" opacity="0.7" />
    <path d="M9.5 14.5L6 18" strokeWidth="1" opacity="0.7" />
    <path d="M14.5 14.5L18 18" strokeWidth="1" opacity="0.7" />

    <path d="M9.5 12L3 12" strokeWidth="1" opacity="0.5" />
    <path d="M14.5 12L21 12" strokeWidth="1" opacity="0.5" />
    <path d="M12 9.5L12 3" strokeWidth="1" opacity="0.5" />
    <path d="M12 14.5L12 21" strokeWidth="1" opacity="0.5" />

    {/* Glowing energy lines */}
    <path d="M10 10L14 14" strokeWidth="0.8" opacity="0.4" strokeDasharray="2 2" />
    <path d="M14 10L10 14" strokeWidth="0.8" opacity="0.4" strokeDasharray="2 2" />
  </svg>
)