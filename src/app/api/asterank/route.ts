import { NextResponse } from 'next/server'

// Cache the data for 1 hour
const CACHE_DURATION = 3600

let cachedData: any = null
let lastFetchTime: number = 0

async function fetchAsterankData() {
  const now = Date.now()
  
  // Return cached data if available and not expired
  if (cachedData && (now - lastFetchTime) < CACHE_DURATION * 1000) {
    return cachedData
  }

  try {
    const response = await fetch('http://www.asterank.com/api/rankings?limit=100', {
      headers: {
        'Accept': 'application/json',
      },
    })
    
    const data = await response.json()
    
    // Transform and cache the data
    cachedData = data.map((asteroid: any) => ({
      symbol: getResourceSymbol(asteroid.composition),
      price: asteroid.price / 1e6,
      supply: calculateSupply(asteroid.composition),
      source: asteroid.full_name
    })).filter((item: any) => item.price > 0 && item.supply > 0)
    
    lastFetchTime = now
    return cachedData
  } catch (error) {
    console.error('Error fetching Asterank data:', error)
    return []
  }
}

function getResourceSymbol(composition: any) {
  // Map asteroid composition to our tokens
  if (composition.water > 0.3) return 'H2O'
  if (composition.iron > 0.5) return 'IRON'
  return 'LOX'
}

function calculateSupply(composition: Record<string, number>) {
  return Object.values(composition).reduce((a: number, b: number) => a + b, 0) * 1000
}

export async function GET() {
  const data = await fetchAsterankData()
  return NextResponse.json(data)
} 