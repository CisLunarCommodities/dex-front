import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { nanoid } from 'nanoid'

export async function POST(request: Request) {
  const data = await request.json()
  const affiliateCode = nanoid(10)
  
  // Store affiliate data (would connect to your database)
  const affiliateData = {
    code: affiliateCode,
    referrer: data.referrer,
    commission: 0.05, // 5% commission
    shares: {},
    createdAt: new Date().toISOString()
  }

  // Set affiliate cookie
  cookies().set('affiliate', affiliateCode, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/'
  })

  return NextResponse.json(affiliateData)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  // Retrieve affiliate data (would fetch from your database)
  // For now, returning mock data
  return NextResponse.json({
    code,
    commission: 0.05,
    shares: {},
    earnings: 0
  })
} 