'use client'

interface AsterankResponse {
  full_name: string
  price: number
  profit: number
  dv: number
  spec: string
  class: string
  moid: number
  H: number // Absolute magnitude
  GM: string // Mass parameter
  diameter: string
}

export interface SpaceResource {
  symbol: string
  name: string
  price: number
  supply: number
  source: string
  miningDifficulty: number
  deltaV: number
  resourceClass: string
  composition: {
    water?: number
    metals?: number
    rareEarth?: number
  }
}

function getResourceType(spec: string, class_type: string): { symbol: string; name: string } {
  // Map spectral types to our token system
  if (spec.includes('C') || class_type.includes('COM')) {
    return { symbol: 'H2O', name: 'Water Ice' }
  }
  if (spec.includes('M') || spec.includes('X')) {
    return { symbol: 'IRON', name: 'Space Iron' }
  }
  if (spec.includes('S')) {
    return { symbol: 'H3', name: 'Helium-3' }
  }
  return { symbol: 'LOX', name: 'Liquid Oxygen' }
}

function calculateComposition(spec: string): SpaceResource['composition'] {
  const composition: SpaceResource['composition'] = {}
  
  if (spec.includes('C')) {
    composition.water = 0.2 + Math.random() * 0.3 // 20-50% water content
  }
  if (spec.includes('M') || spec.includes('X')) {
    composition.metals = 0.4 + Math.random() * 0.4 // 40-80% metal content
  }
  if (spec.includes('S')) {
    composition.rareEarth = 0.1 + Math.random() * 0.2 // 10-30% rare earth content
  }
  
  return composition
}

export async function fetchAsterankData(): Promise<SpaceResource[]> {
  try {
    const response = await fetch('/api/space-data')
    const data = await response.json()
    
    return data.map((asteroid: any) => ({
      symbol: asteroid.type,
      name: getResourceType(asteroid.type, asteroid.specs.orbitClass),
      price: asteroid.mining.estimatedValue / 1e6,
      supply: calculateSupply(asteroid.specs.diameter, asteroid.mining.composition),
      source: asteroid.name,
      miningDifficulty: 100 - asteroid.mining.accessibility,
      deltaV: asteroid.mining.deltaV,
      resourceClass: asteroid.specs.orbitClass,
      composition: asteroid.mining.composition
    }))
  } catch (error) {
    console.error('Error fetching space data:', error)
    return []
  }
} 

function calculateSupply(diameter: any, composition: any) {
    throw new Error("Function not implemented.")
}
