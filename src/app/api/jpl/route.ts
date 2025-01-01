import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const response = await fetch(
      `https://ssd-api.jpl.nasa.gov/sbdb_query.api?fields=id,full_name,orbit_class,epoch,e,a,i,om,w,ma,n,tp,per,per_y&sb-kind=a&limit=100`,
      { next: { revalidate: 3600 } }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch JPL data')
    }

    const data = await response.json()
    
    if (!data || !data.data) {
      return NextResponse.json({ objects: [] })
    }

    return NextResponse.json({ 
      objects: data.data.map((item: any[]) => ({
        id: item[0],
        name: item[1],
        orbitClass: item[2],
        epoch: item[3],
        eccentricity: item[4],
        semiMajorAxis: item[5],
        inclination: item[6],
        longitudeNode: item[7],
        argumentPerihelion: item[8],
        meanAnomaly: item[9],
        meanMotion: item[10],
        timePerihelion: item[11],
        period: item[12],
        periodYears: item[13]
      }))
    })
  } catch (error) {
    console.error('Error fetching JPL data:', error)
    return NextResponse.json({ objects: [] }, { status: 200 })
  }
} 