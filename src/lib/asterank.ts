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
    // Query for near-Earth asteroids with mining potential
    const query = {
      "neo": "Y",
      "price": { "$gt": 1e6 },
      "dv": { "$lt": 10 }
    }
    
    const response = await fetch(`/api/asterank?query=${JSON.stringify(query)}&limit=20`)
    const data: AsterankResponse[] = await response.json()
    
    return data.map(asteroid => {
      const { symbol, name } = getResourceType(asteroid.spec, asteroid.class)
      const miningDifficulty = (asteroid.dv / 10) * 100 // Scale 0-10 delta-v to 0-100%
      
      return {
        symbol,
        name,
        price: asteroid.price / 1e6, // Convert to millions
        supply: parseFloat(asteroid.GM || '0') * 1000, // Rough estimate from mass
        source: asteroid.full_name,
        miningDifficulty,
        deltaV: asteroid.dv,
        resourceClass: asteroid.class,
        composition: calculateComposition(asteroid.spec)
      }
    }).filter(resource => resource.price > 0 && resource.deltaV < 10)
  } catch (error) {
    console.error('Error fetching Asterank data:', error)
    return []
  }
} 