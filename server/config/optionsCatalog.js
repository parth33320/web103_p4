export const BASE_PRICE = 30000

export const OPTIONS_CATALOG = {
  exteriorColor: [
    { id: 'flame_red', name: 'Flame Red', price: 500, visualValue: '#DC2626' },
    { id: 'electric_blue', name: 'Electric Blue', price: 600, visualValue: '#2563EB' },
    { id: 'midnight_black', name: 'Midnight Black', price: 0, visualValue: '#111827' },
    { id: 'pearl_white', name: 'Pearl White', price: 400, visualValue: '#F9FAFB' },
    { id: 'viper_green', name: 'Viper Green', price: 750, visualValue: '#16A34A' }
  ],
  wheels: [
    { id: 'sport_18', name: '18" Sport Alloys', price: 800, visualValue: 'sport' },
    { id: 'turbines_20', name: '20" Chrome Turbines', price: 1500, visualValue: 'turbines' },
    { id: 'offroad_terrain', name: 'Off-Road All-Terrain', price: 1200, visualValue: 'offroad' },
    { id: 'track_slick', name: 'Track Slick Performance', price: 2000, visualValue: 'slick' }
  ],
  roof: [
    { id: 'hardtop', name: 'Standard Hardtop', price: 0, visualValue: 'hardtop' },
    { id: 'panoramic', name: 'Panoramic Glass Roof', price: 1500, visualValue: 'panoramic' },
    { id: 'convertible', name: 'Convertible Soft Top', price: 2500, visualValue: 'convertible' },
    { id: 'carbon', name: 'Carbon Fiber Roof', price: 1800, visualValue: 'carbon' }
  ],
  interior: [
    { id: 'leather_black', name: 'Black Nappa Leather', price: 1200, visualValue: '#1F2937' },
    { id: 'suede_tan', name: 'Tan Alcantara Suede', price: 1400, visualValue: '#D97706' },
    { id: 'sport_carbon', name: 'Sport Carbon Red Trim', price: 1600, visualValue: '#991B1B' },
    { id: 'eco_cloth', name: 'Eco-Friendly Slate Cloth', price: 0, visualValue: '#4B5563' }
  ],
  powertrain: [
    { id: 'turbo_20', name: '2.0L Turbocharged Inline-4 (250 HP)', price: 0, visualValue: 'gas' },
    { id: 'v8_50', name: '5.0L V8 Naturally Aspirated (480 HP)', price: 4500, visualValue: 'gas' },
    { id: 'electric', name: 'Eco Dual-Electric Motor (450 HP)', price: 6000, visualValue: 'electric' }
  ],
  accessories: [
    { id: 'none', name: 'No Accessories', price: 0, visualValue: 'none' },
    { id: 'roof_rack', name: 'Roof Cargo Rack', price: 650, visualValue: 'roof_rack' },
    { id: 'exhaust', name: 'Dual Chrome Exhaust Pipes', price: 850, visualValue: 'exhaust' },
    { id: 'spoiler', name: 'Aero Rear Wing Spoiler', price: 700, visualValue: 'spoiler' }
  ]
}

// Incompatible feature combinations rules
export const IMPOSSIBLE_COMBOS = [
  {
    featureA: { category: 'roof', optionId: 'convertible' },
    featureB: { category: 'accessories', optionId: 'roof_rack' },
    message: 'Convertible Soft Top cannot be combined with Roof Cargo Rack.'
  },
  {
    featureA: { category: 'wheels', optionId: 'track_slick' },
    featureB: { category: 'wheels', optionId: 'offroad_terrain' },
    message: 'Cannot select both Track Slick and Off-Road wheels.'
  },
  {
    featureA: { category: 'powertrain', optionId: 'electric' },
    featureB: { category: 'accessories', optionId: 'exhaust' },
    message: 'Eco Dual-Electric Motor cannot be combined with Dual Chrome Exhaust Pipes.'
  }
]

export const checkServerIncompatibility = (carData) => {
  const { roof, accessories, wheels, powertrain } = carData

  if (roof === 'convertible' && accessories === 'roof_rack') {
    return 'Convertible Soft Top cannot be combined with Roof Cargo Rack.'
  }

  if (powertrain === 'electric' && accessories === 'exhaust') {
    return 'Eco Dual-Electric Motor cannot be combined with Dual Chrome Exhaust Pipes.'
  }

  return null
}

export const calculateServerTotalPrice = (carData) => {
  let total = BASE_PRICE

  for (const [category, selectedId] of Object.entries(carData)) {
    if (OPTIONS_CATALOG[category]) {
      const match = OPTIONS_CATALOG[category].find((opt) => opt.id === selectedId)
      if (match) {
        total += match.price
      }
    }
  }

  return total
}
