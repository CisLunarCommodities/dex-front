'use client'

import { useEffect, useState } from 'react'
import { useMarketData } from '@/lib/market-data'
import { IconRocket, IconPick, IconChartBar, IconUsers, IconBuilding, IconPlus } from '@tabler/icons-react'
import { fetchNeoAsteroids, generateDealFromAsteroid } from '@/lib/nasa'
import { MissionCreator } from '@/components/mission/mission-creator'
import { CompanyCreator } from '@/components/company/company-creator'
import { TokenCharts } from '@/components/charts/token-charts'
import Image from 'next/image'

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
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#1a1b1e] to-black py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="flex justify-center mb-8">
              <Image 
                src="/cce.png" 
                alt="CCE Logo" 
                width={240} 
                height={240}
                className="mb-6"
              />
            </div>
            <h1 className="text-5xl font-bold mb-6">CisLunar Commodities Exchange</h1>
            <p className="text-xl text-gray-400 mb-8">
              Facilitating the trade of space resources 
              and investment in space-focused ventures.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-2">Trade Resources</h3>
                <p className="text-gray-400">
                  Access tokenized space resources like Helium-3 and Liquid Oxygen
                </p>
              </div>
              <div className="bg-black/30 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-2">Built on Solana</h3>
                <p className="text-gray-400">
                  Fast and low-cost transactions for space economy participants
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Action Buttons - Now Centered */}
        <div className="flex justify-center gap-4 mb-8">
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

        {/* Charts Section */}
        <TokenCharts />

        {/* Token Action Buttons */}
        <div className="flex justify-center gap-4 mt-8 mb-8">
          <a
            href="https://www.daos.fun/G9d1PgcUULzaoRKpWkJEjJEs5way8YNu8zaaVuBkn86V"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <IconRocket size={20} className="mr-2" />
            BUY $LOX
          </a>
          <a
            href="https://www.daos.fun/G9d1PgcUULzaoRKpWkJEjJEs5way8YNu8zaaVuBkn86V"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <IconPick size={20} className="mr-2" />
            MINE $H3
          </a>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-[#1a1b1e] rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{deal.name}</h3>
                <span className={`px-2 py-1 rounded text-sm ${
                  deal.risk === 'Low' ? 'bg-green-900 text-green-300' :
                  deal.risk === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-red-900 text-red-300'
                }`}>
                  {deal.risk} Risk
                </span>
              </div>
              <p className="text-gray-400 mb-4">{deal.description}</p>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-500">Timeline: {deal.timeline}</div>
                <div className="text-sm text-green-400">ROI: {deal.roi}%</div>
              </div>
              <button
                className="w-full btn btn-disabled bg-gray-800 text-gray-500"
                disabled
              >
                Coming Soon
              </button>
            </div>
          ))}
        </div>

        {/* Mission Creator Modal */}
        <MissionCreator show={showMissionCreator} onClose={() => setShowMissionCreator(false)} />
        
        {/* Company Creator Modal */}
        <CompanyCreator show={showCompanyCreator} onClose={() => setShowCompanyCreator(false)} />
      </div>
    </main>
  )
}
