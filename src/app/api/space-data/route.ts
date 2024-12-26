import { NextResponse } from 'next/server'

const CACHE_DURATION = 3600 // 1 hour cache
let cachedData: any = null
let lastFetchTime: number = 0

interface JPLQueryParams {
  orbit_class?: string
  diameter?: string
  albedo?: string
  neo?: string
}

async function fetchJPLData(params: JPLQueryParams = {}) {
  // JPL SBDB API endpoint
  const baseUrl = 'https://ssd-api.jpl.nasa.gov/sbdb_query.api'
  
  // Build query parameters
  const query = {
    fields: 'full_name,diameter,albedo,orbit_class,epoch,per,a,e,i,om,w,ma,neo,pha,H,G,M1,M2,diameter_sigma,orbit_id',
    limit: 100,
    ...params
  }

  // Convert all values to strings to satisfy URLSearchParams type requirements
  const stringifiedQuery = Object.fromEntries(
    Object.entries(query).map(([key, value]) => [key, String(value)])
  )

  const queryString = new URLSearchParams(stringifiedQuery).toString()
  
  try {
    const response = await fetch(`${baseUrl}?${queryString}`)
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching JPL data:', error)
    return []
  }
}

async function fetchCombinedData() {
  const now = Date.now()
  
  // Return cached data if available and not expired
  if (cachedData && (now - lastFetchTime) < CACHE_DURATION * 1000) {
    return cachedData
  }

  try {
    // Fetch data from both sources
    const [asterankData, jplData] = await Promise.all([
      fetch('http://www.asterank.com/api/rankings?limit=100').then(res => res.json()),
      fetchJPLData({ neo: 'Y' }) // Focus on Near Earth Objects
    ])

    // Combine and enrich the data
    cachedData = mergeAsteroidData(asterankData, jplData)
    lastFetchTime = now
    
    return cachedData
  } catch (error) {
    console.error('Error fetching combined data:', error)
    return []
  }
}

function mergeAsteroidData(asterankData: any[], jplData: any[]) {
  const jplMap = new Map(jplData.map(obj => [obj.full_name, obj]))
  
  return asterankData.map(asteroid => {
    const jplInfo = jplMap.get(asteroid.full_name) || {}
    
    return {
      id: asteroid.id || jplInfo.orbit_id,
      name: asteroid.full_name,
      type: determineResourceType(asteroid, jplInfo),
      specs: {
        diameter: jplInfo.diameter || asteroid.diameter || 'unknown',
        albedo: jplInfo.albedo || 'unknown',
        orbitClass: jplInfo.orbit_class || asteroid.class,
        neo: jplInfo.neo === 'Y' || asteroid.neo === 'Y',
        pha: jplInfo.pha === 'Y', // Potentially Hazardous Asteroid
      },
      mining: {
        deltaV: asteroid.dv,
        accessibility: calculateAccessibility(asteroid.dv),
        estimatedValue: asteroid.price,
        profitability: asteroid.profit,
        composition: estimateComposition(asteroid, jplInfo)
      },
      orbit: {
        epochJD: jplInfo.epoch,
        period: jplInfo.per,
        semiMajorAxis: jplInfo.a,
        eccentricity: jplInfo.e,
        inclination: jplInfo.i,
        longitudeAscending: jplInfo.om,
        argumentPerihelion: jplInfo.w,
        meanAnomaly: jplInfo.ma
      }
    }
  })
}

function determineResourceType(asterank: any, jpl: any) {
  // Use spectral type and orbital parameters to determine primary resource
  const spec = asterank.spec || ''
  const albedo = jpl.albedo || 0
  
  if (spec.includes('C') || albedo < 0.1) return 'H2O' // Dark, carbon-rich asteroids likely contain water
  if (spec.includes('M') || albedo > 0.3) return 'IRON' // Bright, metallic asteroids
  if (spec.includes('S')) return 'H3' // Stony asteroids could contain helium-3
  return 'LOX' // Default to oxygen extraction
}

function calculateAccessibility(deltaV: number): number {
  // Convert delta-v to a 0-100 accessibility score
  if (!deltaV) return 0
  return Math.max(0, 100 - (deltaV * 10))
}

function estimateComposition(asterank: any, jpl: any) {
  const spec = asterank.spec || ''
  const albedo = jpl.albedo || 0
  
  return {
    water: spec.includes('C') ? 0.2 + Math.random() * 0.3 : 0.05,
    metals: spec.includes('M') ? 0.4 + Math.random() * 0.4 : 0.1,
    rareEarth: spec.includes('S') ? 0.1 + Math.random() * 0.2 : 0.02,
    volatiles: albedo < 0.1 ? 0.15 + Math.random() * 0.25 : 0.05
  }
}

export async function GET(request: Request) {
  const data = await fetchCombinedData()
  return NextResponse.json(data)
} 