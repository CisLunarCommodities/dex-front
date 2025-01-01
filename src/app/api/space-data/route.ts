import { fetchNeoAsteroids } from '@/lib/nasa'
import { fetchAsterankData } from '@/lib/asterank'

export async function GET() {
  try {
    const [asteroids, marketData] = await Promise.all([
      fetchNeoAsteroids(),
      fetchAsterankData()
    ])

    // Ensure we have valid data before mapping
    const combinedData = {
      asteroids: asteroids || [],
      marketData: marketData || [],
      timestamp: Date.now()
    }

    return Response.json(combinedData)
  } catch (error) {
    console.error('Error fetching combined data:', error)
    // Return empty arrays instead of null
    return Response.json({
      asteroids: [],
      marketData: [],
      timestamp: Date.now()
    })
  }
} 