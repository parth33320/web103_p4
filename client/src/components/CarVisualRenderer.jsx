import React from 'react'

export const CarVisualRenderer = ({ selectedOptions, optionsCatalog }) => {
  // Resolve paint color hex
  const colorMatch = optionsCatalog?.categories?.exteriorColor?.find(
    (c) => c.id === selectedOptions.exteriorColor
  )
  const bodyColor = colorMatch ? colorMatch.visualValue : '#2563EB'

  // Options styling
  const roofType = selectedOptions.roof || 'hardtop'
  const wheelType = selectedOptions.wheels || 'sport_18'
  const accessoryType = selectedOptions.accessories || 'none'
  const interiorType = selectedOptions.interior || 'leather_black'

  // Interior color
  const interiorMatch = optionsCatalog?.categories?.interior?.find(
    (i) => i.id === interiorType
  )
  const interiorColor = interiorMatch ? interiorMatch.visualValue : '#1F2937'

  return (
    <div className="car-visual-container">
      <div className="car-badge">3D Vector Live Render</div>
      <svg
        viewBox="0 0 600 300"
        className="car-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.6" />
          </linearGradient>

          <linearGradient id="panoramicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
          </linearGradient>

          <pattern id="carbonPattern" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#111827" />
            <polygon points="0,0 3,0 0,3" fill="#374151" />
            <polygon points="3,3 6,3 3,6" fill="#374151" />
          </pattern>
        </defs>

        {/* Shadow */}
        <ellipse cx="300" cy="245" rx="230" ry="20" fill="rgba(0, 0, 0, 0.25)" />

        {/* Accessories Layer: Exhaust Pipes */}
        {accessoryType === 'exhaust' && (
          <g className="accessory-exhaust">
            <rect x="75" y="212" width="25" height="10" rx="3" fill="#9CA3AF" stroke="#374151" strokeWidth="2" />
            <circle cx="82" cy="217" r="3" fill="#1F2937" />
            <circle cx="92" cy="217" r="3" fill="#1F2937" />
          </g>
        )}

        {/* Interior Seating Preview (Visible through windows) */}
        <rect x="220" y="115" width="45" height="40" rx="8" fill={interiorColor} />
        <rect x="300" y="118" width="40" height="37" rx="8" fill={interiorColor} opacity="0.85" />

        {/* Main Car Body Shell */}
        <path
          d="M 90 220
             L 80 160
             C 85 145, 110 135, 150 130
             L 210 95
             C 240 80, 360 80, 390 95
             L 480 130
             C 520 135, 540 160, 535 220
             Z"
          fill={bodyColor}
          stroke="#0F172A"
          strokeWidth="4"
          className="car-body-transition"
        />

        {/* Roof Layer */}
        {roofType === 'hardtop' && (
          <path
            d="M 205 98 C 235 80, 365 80, 395 98 Z"
            fill={bodyColor}
            stroke="#0F172A"
            strokeWidth="3"
          />
        )}

        {roofType === 'panoramic' && (
          <path
            d="M 205 98 C 235 80, 365 80, 395 98 Z"
            fill="url(#panoramicGradient)"
            stroke="#0284C7"
            strokeWidth="3"
          />
        )}

        {roofType === 'carbon' && (
          <path
            d="M 205 98 C 235 80, 365 80, 395 98 Z"
            fill="url(#carbonPattern)"
            stroke="#111827"
            strokeWidth="3"
          />
        )}

        {roofType === 'convertible' && (
          <g className="convertible-open">
            <path d="M 205 102 C 220 108, 240 115, 250 120" stroke="#475569" strokeWidth="4" strokeDasharray="3,3" />
            <text x="270" y="110" fill="#EF4444" fontSize="12" fontWeight="bold">OPEN CONVERTIBLE</text>
          </g>
        )}

        {/* Window Glass Layer */}
        {roofType !== 'convertible' && (
          <path
            d="M 215 102 L 270 102 L 270 135 L 165 135 Z"
            fill="url(#glassGradient)"
            stroke="#1E293B"
            strokeWidth="2"
          />
        )}
        {roofType !== 'convertible' && (
          <path
            d="M 280 102 L 380 102 L 460 135 L 280 135 Z"
            fill="url(#glassGradient)"
            stroke="#1E293B"
            strokeWidth="2"
          />
        )}

        {/* Headlights & Taillights */}
        <path d="M 525 150 Q 535 165 528 185 Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
        <path d="M 85 155 Q 80 170 86 185 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />

        {/* Door Lines and Handles */}
        <path d="M 275 135 L 275 210" stroke="#0F172A" strokeWidth="2" opacity="0.6" />
        <rect x="290" y="148" width="22" height="6" rx="2" fill="#64748B" />

        {/* Accessories Layer: Rear Wing Spoiler */}
        {accessoryType === 'spoiler' && (
          <g className="accessory-spoiler">
            <path d="M 70 145 L 60 125 L 110 125 L 100 145 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            <rect x="75" y="135" width="6" height="15" fill="#334155" />
            <rect x="95" y="135" width="6" height="15" fill="#334155" />
          </g>
        )}

        {/* Accessories Layer: Roof Cargo Rack */}
        {accessoryType === 'roof_rack' && roofType !== 'convertible' && (
          <g className="accessory-roof-rack">
            <line x1="220" y1="78" x2="380" y2="78" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
            <line x1="240" y1="78" x2="240" y2="88" stroke="#1E293B" strokeWidth="4" />
            <line x1="360" y1="78" x2="360" y2="88" stroke="#1E293B" strokeWidth="4" />
            {/* Luggage box on top */}
            <rect x="260" y="60" width="80" height="18" rx="5" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
          </g>
        )}

        {/* Wheels & Rim Rendering */}
        <WheelAssembly cx={165} cy={220} wheelType={wheelType} />
        <WheelAssembly cx={435} cy={220} wheelType={wheelType} />
      </svg>
    </div>
  )
}

const WheelAssembly = ({ cx, cy, wheelType }) => {
  if (wheelType === 'turbines_20') {
    return (
      <g className="wheel-group">
        <circle cx={cx} cy={cy} r="38" fill="#1F2937" stroke="#111827" strokeWidth="6" />
        <circle cx={cx} cy={cy} r="26" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="3" />
        {/* Turbine Spokes */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1={cx}
            y1={cy}
            x2={cx + 22 * Math.cos((angle * Math.PI) / 180)}
            y2={cy + 22 * Math.sin((angle * Math.PI) / 180)}
            stroke="#4B5563"
            strokeWidth="4"
          />
        ))}
        <circle cx={cx} cy={cy} r="8" fill="#2563EB" />
      </g>
    )
  }

  if (wheelType === 'offroad_terrain') {
    return (
      <g className="wheel-group">
        {/* Knobby Off-road Tire */}
        <circle cx={cx} cy={cy} r="42" fill="#111827" stroke="#374151" strokeWidth="8" strokeDasharray="10,6" />
        <circle cx={cx} cy={cy} r="25" fill="#4B5563" stroke="#D1D5DB" strokeWidth="3" />
        <circle cx={cx} cy={cy} r="14" fill="#1F2937" />
      </g>
    )
  }

  if (wheelType === 'track_slick') {
    return (
      <g className="wheel-group">
        {/* Smooth Slick Performance Tire */}
        <circle cx={cx} cy={cy} r="38" fill="#030712" stroke="#DC2626" strokeWidth="4" />
        <circle cx={cx} cy={cy} r="24" fill="#1E293B" stroke="#94A3B8" strokeWidth="3" />
        <polygon
          points={`${cx},${cy - 18} ${cx + 15},${cy + 12} ${cx - 15},${cy + 12}`}
          fill="#DC2626"
        />
        <circle cx={cx} cy={cy} r="6" fill="#F87171" />
      </g>
    )
  }

  // Default 18" Sport Alloys
  return (
    <g className="wheel-group">
      <circle cx={cx} cy={cy} r="36" fill="#111827" stroke="#374151" strokeWidth="5" />
      <circle cx={cx} cy={cy} r="24" fill="#D1D5DB" stroke="#6B7280" strokeWidth="2" />
      {[0, 72, 144, 216, 288].map((angle) => (
        <line
          key={angle}
          x1={cx}
          y1={cy}
          x2={cx + 20 * Math.cos((angle * Math.PI) / 180)}
          y2={cy + 20 * Math.sin((angle * Math.PI) / 180)}
          stroke="#1F2937"
          strokeWidth="3"
        />
      ))}
      <circle cx={cx} cy={cy} r="6" fill="#2563EB" />
    </g>
  )
}
