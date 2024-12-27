'use client'

import { useEffect, useState } from 'react'
import { useMarketData } from '@/lib/market-data'
import { IconRocket, IconPick, IconChartBar, IconUsers, IconBuilding } from '@tabler/icons-react'
import Link from 'next/link'
import { fetchNeoAsteroids, generateDealFromAsteroid } from '@/lib/nasa'
import { MissionCreator } from '@/components/mission/mission-creator'
import { CompanyCreator } from '@/components/company/company-creator'

type DealType = 'MISSION' | 'COMPANY'

interface SpaceDeal {
  id: string
  name: string
  type: DealType
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
  const { resources } = useMarketData()
  const [deals, setDeals] = useState<SpaceDeal[]>([])
  const [filter, setFilter] = useState('all')
  const [roiRange, setRoiRange] = useState([0, 500])
  const [selectedRisk, setSelectedRisk] = useState<'All' | 'Low' | 'Medium' | 'High'>('All')
  const [selectedResources, setSelectedResources] = useState<string[]>([])
  const [dealTypeFilter, setDealTypeFilter] = useState<'all' | DealType>('all')
  const [showMissionCreator, setShowMissionCreator] = useState(false)
  const [showCompanyCreator, setShowCompanyCreator] = useState(false)

  useEffect(() => {
    async function loadDeals() {
      const asteroids = await fetchNeoAsteroids()
      const generatedDeals = asteroids.map(generateDealFromAsteroid)
      // Randomly assign MISSION or COMPANY type to each deal
      const dealsWithTypes = generatedDeals.map(deal => ({
        ...deal,
        type: Math.random() > 0.5 ? 'MISSION' : 'COMPANY' as DealType
      }))
      setDeals(dealsWithTypes)
    }
    loadDeals()
  }, [])

  const stats = deals.reduce((acc, deal) => {
    return {
      totalValue: acc.totalValue + deal.fundingGoal,
      activeDeals: acc.activeDeals + (deal.status === 'Active' ? 1 : 0),
      avgRoi: [...acc.avgRoi, deal.roi],
      successRate: acc.successRate + (deal.risk === 'Low' ? 1 : 0)
    }
  }, {
    totalValue: 0,
    activeDeals: 0,
    avgRoi: [] as number[],
    successRate: 0
  })

  const averageRoi = stats.avgRoi.length 
    ? stats.avgRoi.reduce((a, b) => a + b, 0) / stats.avgRoi.length 
    : 0

  const filteredDeals = deals.filter(deal => {
    const matchesType = dealTypeFilter === 'all' || deal.type === dealTypeFilter
    const matchesRisk = selectedRisk === 'All' || deal.risk === selectedRisk
    const matchesRoi = deal.roi >= roiRange[0] && deal.roi <= roiRange[1]
    const matchesResources = selectedResources.length === 0 || 
      deal.resources.some(resource => selectedResources.includes(resource))
    
    return matchesType && matchesRisk && matchesRoi && matchesResources
  })

  return (
    <div className="min-h-screen bg-black">
      <div className="p-8">
        <div className="mb-12 flex justify-center gap-4">
          <button
            onClick={() => setShowMissionCreator(true)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 transition-colors rounded-lg font-medium text-lg"
          >
            Begin a New Mission
          </button>
          <button
            onClick={() => setShowCompanyCreator(true)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 transition-colors rounded-lg font-medium text-lg"
          >
            Fund My Company
          </button>
        </div>

        <MissionCreator 
          show={showMissionCreator} 
          onClose={() => setShowMissionCreator(false)} 
        />
        <CompanyCreator 
          show={showCompanyCreator} 
          onClose={() => setShowCompanyCreator(false)} 
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-[#1a1b1e] rounded-lg p-6">
            <div className="flex items-center gap-4 mb-2">
              <IconChartBar className="text-purple-500" size={24} />
              <div className="text-gray-400">Total Value Locked</div>
            </div>
            <div className="text-2xl font-bold">
              ${(stats.totalValue / 1e9).toFixed(2)}B
            </div>
            <div className="text-sm text-gray-500">In active missions</div>
          </div>

          <div className="bg-[#1a1b1e] rounded-lg p-6">
            <div className="flex items-center gap-4 mb-2">
              <IconRocket className="text-purple-500" size={24} />
              <div className="text-gray-400">Active Deals</div>
            </div>
            <div className="text-2xl font-bold">{stats.activeDeals}</div>
            <div className="text-sm text-gray-500">Across all categories</div>
          </div>

          <div className="bg-[#1a1b1e] rounded-lg p-6">
            <div className="flex items-center gap-4 mb-2">
              <IconPick className="text-purple-500" size={24} />
              <div className="text-gray-400">Average ROI</div>
            </div>
            <div className="text-2xl font-bold">{Math.round(averageRoi)}%</div>
            <div className="text-sm text-gray-500">Historical returns</div>
          </div>

          <div className="bg-[#1a1b1e] rounded-lg p-6">
            <div className="flex items-center gap-4 mb-2">
              <IconUsers className="text-purple-500" size={24} />
              <div className="text-gray-400">Success Rate</div>
            </div>
            <div className="text-2xl font-bold">
              {Math.round((stats.successRate / deals.length) * 100)}%
            </div>
            <div className="text-sm text-gray-500">Completed missions</div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setDealTypeFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                dealTypeFilter === 'all' 
                  ? 'bg-purple-600' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              All Deals
            </button>
            <button
              onClick={() => setDealTypeFilter('MISSION')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                dealTypeFilter === 'MISSION' 
                  ? 'bg-purple-600' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <IconRocket size={20} />
              Missions
            </button>
            <button
              onClick={() => setDealTypeFilter('COMPANY')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                dealTypeFilter === 'COMPANY' 
                  ? 'bg-purple-600' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <IconBuilding size={20} />
              Companies
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-[#1a1b1e] p-6 rounded-lg">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Target ROI</label>
              <input
                type="range"
                min="0"
                max="500"
                value={roiRange[1]}
                onChange={(e) => setRoiRange([roiRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
              <div className="flex justify-between text-sm mt-1">
                <span>{roiRange[0]}%</span>
                <span>{roiRange[1]}%</span>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Risk Level</label>
              <div className="flex gap-2">
                {['All', 'Low', 'Medium', 'High'].map((risk) => (
                  <button
                    key={risk}
                    onClick={() => setSelectedRisk(risk as typeof selectedRisk)}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      selectedRisk === risk
                        ? 'bg-purple-600 text-white'
                        : 'bg-black/30 text-gray-400 hover:text-white'
                    }`}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Resources</label>
              <div className="flex flex-wrap gap-2">
                {['LOX', 'H3', 'IRON', 'H2O'].map((resource) => (
                  <button
                    key={resource}
                    onClick={() => setSelectedResources(prev => 
                      prev.includes(resource)
                        ? prev.filter(r => r !== resource)
                        : [...prev, resource]
                    )}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      selectedResources.includes(resource)
                        ? 'bg-purple-600 text-white'
                        : 'bg-black/30 text-gray-400 hover:text-white'
                    }`}
                  >
                    {resource}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => (
            <div 
              key={deal.id}
              className="bg-[#1a1b1e] rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {deal.type === 'MISSION' ? (
                        <IconRocket className="text-purple-400" size={20} />
                      ) : (
                        <IconBuilding className="text-purple-400" size={20} />
                      )}
                      <span className="text-sm text-purple-400">
                        {deal.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {deal.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {deal.description}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full text-sm">
                    {deal.status}
                  </span>
                </div>

                <div className="flex gap-2 mb-6">
                  {deal.resources.map((resource) => (
                    <span
                      key={resource}
                      className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm"
                    >
                      {resource}
                    </span>
                  ))}
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">
                      {Math.round((deal.currentFunding / deal.fundingGoal) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-600 rounded-full"
                      style={{ 
                        width: `${(deal.currentFunding / deal.fundingGoal) * 100}%` 
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {deal.roi}%
                    </div>
                    <div className="text-sm text-gray-400">
                      Target ROI
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {deal.risk}
                    </div>
                    <div className="text-sm text-gray-400">
                      Risk Level
                    </div>
                  </div>
                </div>

                <Link 
                  href={`/deal/${deal.id}`}
                  className="block w-full text-center py-3 bg-purple-600 hover:bg-purple-700 transition-colors rounded-lg font-medium"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
