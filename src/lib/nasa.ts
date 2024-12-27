const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY

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

export async function fetchNeoAsteroids(): Promise<NeoAsteroid[]> {
  const startDate = new Date().toISOString().split('T')[0]
  const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  
  const response = await fetch(
    `https://api.nasa.gov/neo/rest/v1/feed?` +
    `start_date=${startDate}&end_date=${endDate}&` +
    `api_key=${NASA_API_KEY}`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch NEO data')
  }

  const data = await response.json()
  return Object.values(data.near_earth_objects).flat() as NeoAsteroid[]
}

export interface SpaceDeal {
  timeline_details: any
  highlights: any
  id: string
  name: string
  type: string
  description: string
  target: string
  resources: string[]
  fundingGoal: number
  currentFunding: number
  roi: number
  timeline: any // TODO: Define timeline type
  risk: 'Low' | 'Medium' | 'High'
  status: string
  team: {
    members: number
    experience: string
  }
}

export function generateDealFromAsteroid(asteroid: NeoAsteroid): SpaceDeal {
  const avgDiameter = (
    asteroid.estimated_diameter.kilometers.estimated_diameter_min +
    asteroid.estimated_diameter.kilometers.estimated_diameter_max
  ) / 2

  const baseValue = avgDiameter * 1000000000 // $1B per km diameter
  const riskMultiplier = asteroid.is_potentially_hazardous_asteroid ? 1.5 : 1
  const estimatedValue = baseValue * riskMultiplier

  return {
    id: asteroid.neo_reference_id,
    name: `${asteroid.name.replace('(', '').replace(')', '')} Mining Mission`,
    type: 'MISSION',
    description: `Resource extraction mission to ${avgDiameter.toFixed(2)}km diameter asteroid`,
    timeline_details: {
      start: getTimeline(),
      duration: '2-3 years',
      phases: ['Planning', 'Launch', 'Transit', 'Mining', 'Return']
    },
    highlights: [
      'State-of-the-art mining equipment',
      'Experienced space mining crew',
      'Advanced resource processing capabilities'
    ],
    target: asteroid.name,
    resources: determineResources(asteroid),
    fundingGoal: estimatedValue * 0.1, // 10% of estimated value
    currentFunding: 0,
    roi: calculateROI(estimatedValue),
    timeline: getTimeline(),
    risk: calculateRisk(asteroid),
    status: 'Upcoming',
    team: {
      members: Math.floor(Math.random() * 20) + 10,
      experience: `${Math.floor(Math.random() * 15) + 5}+ years in aerospace`
    }
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

function calculateROI(estimatedValue: number): number {
  const miningCosts = estimatedValue * 0.3 // 30% operational costs
  const potentialReturn = estimatedValue - miningCosts
  return Math.round((potentialReturn / miningCosts) * 100)
}

function calculateRisk(asteroid: NeoAsteroid): 'Low' | 'Medium' | 'High' {
  if (asteroid.is_potentially_hazardous_asteroid) return 'High'
  
  const velocity = parseFloat(asteroid.close_approach_data[0]?.relative_velocity.kilometers_per_second || '0')
  if (velocity > 30) return 'High'
  if (velocity > 20) return 'Medium'
  return 'Low'
}

function getTimeline(): string {
  const now = new Date()
  const year = now.getFullYear() + 2
  const quarter = Math.floor(Math.random() * 4) + 1
  return `${year} Q${quarter}`
}

// Helper functions for deal generation... 