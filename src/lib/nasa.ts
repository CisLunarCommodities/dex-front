const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY'
let lastApiCall = 0
const API_COOLDOWN = 1000 // 1 second between calls

interface NeoAsteroid {
  id: string
  neo_reference_id: string
  name: string
  nasa_jpl_url: string
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number
      estimated_diameter_max: number
    }
  }
  is_potentially_hazardous_asteroid: boolean
  close_approach_data: Array<{
    close_approach_date: string
    miss_distance: {
      kilometers: string
    }
    relative_velocity: {
      kilometers_per_second: string
    }
  }>
  orbital_data?: {
    orbit_class: {
      orbit_class_type: string
      orbit_class_description: string
    }
  }
}

export interface SpaceDeal {
  id: string
  name: string
  type: 'MISSION' | 'COMPANY'
  description: string
  longDescription?: string
  target?: string
  resources: string[]
  fundingGoal: number
  currentFunding: number
  roi: number
  timeline: string
  risk: 'Low' | 'Medium' | 'High'
  status: 'Active' | 'Upcoming' | 'Funded'
  team: {
    members: number
    experience: string
  }
  highlights: string[]
  risks: string[]
  timeline_details: {
    phase: string
    date: string
    description: string
  }[]
  mintAddress: string
  tokenSupply: number
  tokenPrice?: number
}

export async function fetchNeoAsteroids(): Promise<NeoAsteroid[]> {
  try {
    // Check if we need to wait before making another API call
    const now = Date.now()
    if (now - lastApiCall < API_COOLDOWN) {
      return generateMockAsteroids()
    }
    lastApiCall = now

    const startDate = new Date().toISOString().split('T')[0]
    const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    const response = await fetch(
      `https://api.nasa.gov/neo/rest/v1/feed?` +
      `start_date=${startDate}&` +
      `end_date=${endDate}&` +
      `api_key=${NASA_API_KEY}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    )

    if (response.status === 429) {
      console.warn('NASA API rate limit reached, using mock data')
      return generateMockAsteroids()
    }

    if (!response.ok) {
      throw new Error(`NASA API responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    // Flatten the nested structure of the NASA API response
    const asteroids = Object.values(data.near_earth_objects)
      .flat()
      .slice(0, 10) // Limit to 10 asteroids for demo purposes

    return asteroids as NeoAsteroid[]
  } catch (error) {
    console.error('Error fetching NEO data:', error)
    return generateMockAsteroids()
  }
}

// Add mock data generation for fallback
function generateMockAsteroids(): NeoAsteroid[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: `mock${i + 1}`,
    neo_reference_id: `mock${i + 1}`,
    name: `Mock Asteroid ${i + 1}`,
    nasa_jpl_url: `https://ssd.jpl.nasa.gov/mock/${i + 1}`,
    estimated_diameter: {
      kilometers: {
        estimated_diameter_min: Math.random() * 0.5,
        estimated_diameter_max: Math.random() * 0.5 + 0.5
      }
    },
    is_potentially_hazardous_asteroid: Math.random() > 0.7,
    close_approach_data: [{
      close_approach_date: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      relative_velocity: {
        kilometers_per_second: (Math.random() * 30 + 10).toString()
      },
      miss_distance: {
        kilometers: (Math.random() * 1000000 + 100000).toString()
      }
    }],
    orbital_data: {
      orbit_class: {
        orbit_class_type: 'AMO',
        orbit_class_description: 'Near-Earth asteroid orbits similar to that of 1221 Amor'
      }
    }
  }))
}

export function generateDealFromAsteroid(asteroid: NeoAsteroid): SpaceDeal {
  const avgDiameter = (
    asteroid.estimated_diameter.kilometers.estimated_diameter_min +
    asteroid.estimated_diameter.kilometers.estimated_diameter_max
  ) / 2

  // Base value calculation
  const baseValue = avgDiameter * 1000000000 // $1B per km diameter

  // Risk factors affect both ROI and risk level
  const riskFactors = {
    isPotentiallyHazardous: asteroid.is_potentially_hazardous_asteroid ? 1.5 : 1,
    orbitUncertainty: Math.random() * 0.5 + 0.75, // 0.75-1.25x multiplier
    missionComplexity: avgDiameter > 1 ? 0.8 : 1.2, // Smaller asteroids are easier to mine
  }

  // Calculate mission difficulty based on orbital elements
  const orbitDifficulty = calculateOrbitDifficulty(asteroid)

  // ROI Calculation factors
  const resourceValue = calculateResourceValue(asteroid)
  const missionCost = calculateMissionCost(avgDiameter, orbitDifficulty)
  const timelineImpact = Math.random() * 0.4 + 0.8 // 0.8-1.2x multiplier for timeline efficiency

  // Final ROI calculation
  const totalRiskMultiplier = Object.values(riskFactors).reduce((a, b) => a * b, 1)
  const estimatedValue = baseValue * totalRiskMultiplier * resourceValue
  const projectedROI = Math.round(
    ((estimatedValue - missionCost) / missionCost) * 100 * timelineImpact
  )

  return {
    id: asteroid.neo_reference_id,
    name: `${asteroid.name.replace('(', '').replace(')', '')} Mining Mission`,
    type: 'MISSION',
    description: `Resource extraction mission to ${avgDiameter.toFixed(2)}km diameter asteroid`,
    timeline: getTimeline(2),
    timeline_details: [
      {
        phase: 'Planning & Design',
        date: getTimeline(),
        description: 'Mission architecture and systems design'
      },
      {
        phase: 'Construction',
        date: getTimeline(1),
        description: 'Mining equipment and spacecraft assembly'
      },
      {
        phase: 'Launch Window',
        date: getTimeline(2),
        description: 'Mission launch and transit phase'
      },
      {
        phase: 'Operations',
        date: getTimeline(3),
        description: 'Resource extraction and processing begins'
      }
    ],
    highlights: [
      'State-of-the-art mining equipment',
      'Experienced space mining crew',
      'Advanced resource processing capabilities'
    ],
    target: asteroid.name,
    resources: determineResources(asteroid),
    fundingGoal: missionCost,
    currentFunding: 0,
    roi: projectedROI,
    risk: calculateRisk(asteroid, riskFactors),
    status: 'Active',
    team: {
      members: Math.floor(Math.random() * 20) + 10,
      experience: 'Industry veterans with multiple successful missions'
    },
    risks: [
      'Technical challenges in zero-gravity mining',
      'Launch window dependencies',
      'Market price fluctuations'
    ],
    mintAddress: '', // Will be set when token is created
    tokenSupply: 1000000
  }
}

function determineResources(asteroid: NeoAsteroid): string[] {
  const resources = ['LOX'] // All asteroids contain some oxygen compounds
  
  if (asteroid.is_potentially_hazardous_asteroid) {
    resources.push('IRON') // Metallic composition more likely in PHAs
  }
  
  if (asteroid.estimated_diameter.kilometers.estimated_diameter_max > 1) {
    resources.push('H3') // Larger asteroids more likely to contain rare elements
  }
  
  return resources
}

function calculateOrbitDifficulty(asteroid: NeoAsteroid): number {
  // Higher number = more difficult
  const orbitParams = {
    eccentricity: parseFloat(asteroid.orbital_data?.orbit_class?.orbit_class_type || '0'),
    semiMajorAxis: parseFloat(asteroid.orbital_data?.orbit_class?.orbit_class_type || '0'),
    inclination: parseFloat(asteroid.orbital_data?.orbit_class?.orbit_class_type || '0')
  }

  return (
    (orbitParams.eccentricity * 2) +
    (orbitParams.semiMajorAxis / 3) +
    (orbitParams.inclination / 45)
  ) / 3
}

function calculateResourceValue(asteroid: NeoAsteroid): number {
  // Estimate resource value multiplier based on spectral type
  // This could be enhanced with real spectral type data if available
  const resourceMultipliers = {
    'C': 1.2,  // Carbon-rich, valuable for water and organics
    'S': 1.0,  // Silicaceous, common minerals
    'M': 1.5,  // Metallic, valuable metals
    'P': 0.8,  // Primitive, less processed materials
  }
  // Randomly assign a spectral type if not available
  const spectralType = (asteroid.orbital_data?.orbit_class?.orbit_class_type as 'C'|'S'|'M'|'P') || 
    ['C', 'S', 'M', 'P'][Math.floor(Math.random() * 4)]

  return resourceMultipliers[spectralType] || 1.0
}

function calculateMissionCost(diameter: number, difficulty: number): number {
  const baseCost = 100000000 // $100M base cost
  const sizeCost = diameter * 200000000 // $200M per km diameter
  const difficultyMultiplier = 1 + (difficulty * 0.5) // 1-1.5x based on difficulty

  return Math.round((baseCost + sizeCost) * difficultyMultiplier)
}

function calculateRisk(
  asteroid: NeoAsteroid, 
  riskFactors: { [key: string]: number }
): 'Low' | 'Medium' | 'High' {
  const totalRisk = (
    (asteroid.is_potentially_hazardous_asteroid ? 2 : 1) +
    (riskFactors.orbitUncertainty * 2) +
    (riskFactors.missionComplexity * 1.5)
  ) / 4.5

  if (totalRisk < 0.8) return 'Low'
  if (totalRisk < 1.2) return 'Medium'
  return 'High'
}

function getTimeline(quarterOffset = 0): string {
  const now = new Date()
  const year = now.getFullYear() + Math.floor(quarterOffset / 4)
  const quarter = Math.floor((now.getMonth() + 3 * quarterOffset) / 3) % 4 + 1
  return `${year} Q${quarter}`
}

// Helper functions for deal generation... 