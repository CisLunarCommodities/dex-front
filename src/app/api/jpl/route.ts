import { NextResponse } from 'next/server'

const CACHE_DURATION = 3600
let cachedData: any = null
let lastFetchTime: number = 0

interface JPLQueryParams {
  orbit_class?: string
  diameter?: string
  neo?: string
}

async function fetchJPLData() {
  const now = Date.now()
  
  if (cachedData && (now - lastFetchTime) < CACHE_DURATION * 1000) {
    return cachedData
  }

  try {
    // JPL SBDB API endpoint
    const baseUrl = 'https://ssd-api.jpl.nasa.gov/sbdb_query.api'
    
    const query = {
      fields: 'full_name,diameter,albedo,orbit_class,epoch,per,a,e,i,om,w,ma,neo,pha,H,G',
      limit: 100,
      neo: 'Y', // Near Earth Objects only
      diameter: '>0.5' // Larger than 500m
    }

    const queryString = new URLSearchParams({
      ...query,
      limit: query.limit.toString()
    }).toString()
    const response = await fetch(`${baseUrl}?${queryString}`)
    const data = await response.json()
    
    // Transform JPL data to match our format
    cachedData = data.data.map((asteroid: any) => ({
      name: asteroid.full_name,
      specs: {
        diameter: asteroid.diameter || 'unknown',
        albedo: asteroid.albedo || 'unknown',
        orbitClass: asteroid.orbit_class,
        neo: asteroid.neo === 'Y',
        pha: asteroid.pha === 'Y',
      },
      orbit: {
        epochJD: asteroid.epoch,
        period: asteroid.per,
        semiMajorAxis: asteroid.a,
        eccentricity: asteroid.e,
        inclination: asteroid.i,
        longitudeAscending: asteroid.om,
        argumentPerihelion: asteroid.w,
        meanAnomaly: asteroid.ma
      }
    }))

    lastFetchTime = now
    return cachedData
  } catch (error) {
    console.error('Error fetching JPL data:', error)
    return []
  }
}

export async function GET() {
  const data = await fetchJPLData()
  return NextResponse.json(data)
} 