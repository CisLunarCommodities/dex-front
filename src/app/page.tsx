'use client'

import { useEffect, useState } from 'react'
import { useMarketData } from '@/lib/market-data'
import { IconRocket, IconPick, IconChartBar, IconUsers, IconBuilding, IconPlus } from '@tabler/icons-react'
import Link from 'next/link'
import { fetchNeoAsteroids, generateDealFromAsteroid } from '@/lib/nasa'
import { MissionCreator } from '@/components/mission/mission-creator'
import { CompanyCreator } from '@/components/company/company-creator'
import { TokenCharts } from '@/components/charts/token-charts'

interface SpaceDeal {
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
}

export default function HomePage() {
  const [deals, setDeals] = useState<SpaceDeal[]>([])
  const marketData = useMarketData()
  const [showMissionCreator, setShowMissionCreator] = useState(false)
  const [showCompanyCreator, setShowCompanyCreator] = useState(false)

  useEffect(() => {
    const loadDeals = async () => {
      try {
        const asteroids = await fetchNeoAsteroids()
        const newDeals = asteroids.map(generateDealFromAsteroid)
        setDeals(newDeals)
      } catch (error) {
        console.error('Error loading deals:', error)
      }
    }

    loadDeals()
  }, [])

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowMissionCreator(true)}
            className="btn btn-primary"
          >
            <IconPlus size={20} className="mr-2" />
            New Mission
          </button>
          <button
            onClick={() => setShowCompanyCreator(true)}
            className="btn btn-secondary"
          >
            <IconPlus size={20} className="mr-2" />
            New Company
          </button>
        </div>

        {/* Token Charts */}
        <section className="mb-12">
          <TokenCharts />
        </section>

        {/* Recent Deals */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Deals</h2>
            <Link href="/deals" className="text-primary hover:text-primary-focus">
              View All Deals
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.slice(0, 3).map((deal) => (
              <Link key={deal.id} href={`/deals/${deal.id}`}>
                <div className="bg-[#1a1b1e] rounded-lg p-6 hover:bg-[#2d2e31] transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    {deal.type === 'MISSION' ? (
                      <IconRocket className="text-purple-500" size={24} />
                    ) : (
                      <IconBuilding className="text-blue-500" size={24} />
                    )}
                    <h3 className="text-xl font-bold">{deal.name}</h3>
                  </div>
                  <p className="text-gray-400 mb-4 line-clamp-2">{deal.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-gray-400">Target ROI:</span>{' '}
                      <span className="text-white font-bold">{deal.roi}%</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Risk:</span>{' '}
                      <span className="text-white font-bold">{deal.risk}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Modals */}
        <MissionCreator
          show={showMissionCreator}
          onClose={() => setShowMissionCreator(false)}
        />
        <CompanyCreator
          show={showCompanyCreator}
          onClose={() => setShowCompanyCreator(false)}
        />
      </div>
    </main>
  )
}
