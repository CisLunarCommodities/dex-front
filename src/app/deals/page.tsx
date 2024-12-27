'use client'

import { useEffect, useState } from 'react'
import { useMarketData } from '@/lib/market-data'
import { IconRocket, IconPick, IconChartBar, IconUsers } from '@tabler/icons-react'
import Link from 'next/link'
import { fetchNeoAsteroids, generateDealFromAsteroid } from '@/lib/nasa'

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
  mintAddress: string  // Solana token mint address
  tokenSupply: number
}

export default function DealsPage() {
  const { resources } = useMarketData()
  const [deals, setDeals] = useState<SpaceDeal[]>([])
  const [filter, setFilter] = useState('all')
  const [roiRange, setRoiRange] = useState([0, 500])
  const [selectedRisk, setSelectedRisk] = useState<'All' | 'Low' | 'Medium' | 'High'>('All')
  const [selectedResources, setSelectedResources] = useState<string[]>([])

  useEffect(() => {
    async function loadDeals() {
      try {
        const asteroids = await fetchNeoAsteroids()
        const newDeals = asteroids
          .filter(asteroid => asteroid.estimated_diameter.kilometers.estimated_diameter_max > 0.1)
          .map(generateDealFromAsteroid)
        setDeals(newDeals as unknown as SpaceDeal[])
      } catch (error) {
        console.error('Failed to load asteroid deals:', error)
        // Fallback to sample data
        setDeals([
          {
            id: 'mission-1',
            name: 'Asteroid X-227 Mining Operation',
            type: 'MISSION',
            description: 'First commercial water extraction mission to near-Earth asteroid',
            target: 'X-227',
            resources: ['H2O', 'IRON'],
            fundingGoal: 50000000,
            currentFunding: 35000000,
            roi: 280,
            timeline: '2025 Q3',
            risk: 'Medium',
            status: 'Active',
            team: {
              members: 24,
              experience: '15+ years in aerospace'
            },
            highlights: [],
            risks: [],
            timeline_details: [],
            mintAddress: '7KVexUFAtCgJ1sHUGQgn9N4aHJbkxuqQhExvAtQRpd2s', // Added
            tokenSupply: 1000000 // Added
          }
        ])
      }
    }
    loadDeals()
  }, [])

  const filteredDeals = deals.filter(deal => {
    // Type filter
    if (filter !== 'all' && deal.type.toLowerCase() !== filter) return false
    
    // ROI filter
    if (deal.roi < roiRange[0] || deal.roi > roiRange[1]) return false
    
    // Risk filter
    if (selectedRisk !== 'All' && deal.risk !== selectedRisk) return false
    
    // Resources filter
    if (selectedResources.length > 0 && 
        !selectedResources.some(r => deal.resources.includes(r))) return false
    
    return true
  })

  // Calculate stats for the headlines
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

  return (
    <div className="min-h-screen bg-black">
      <div className="p-8">
        {/* Stats Section */}
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

        {/* Type Filters */}
        <div className="flex gap-4 mb-8">
          {['All Deals', 'Missions', 'Companies'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab === 'All Deals' ? 'all' : tab.toLowerCase())}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                filter === (tab === 'All Deals' ? 'all' : tab.toLowerCase())
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-[#1a1b1e] p-6 rounded-lg">
          {/* ROI Range Slider */}
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

          {/* Risk Filter */}
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

          {/* Resources Filter */}
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

        {/* Deals Grid - using filtered deals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => (
            <div key={deal.id} className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h2 className="card-title">{deal.name}</h2>
                  <span className={`badge ${
                    deal.status === 'Active' ? 'badge-success' : 
                    deal.status === 'Upcoming' ? 'badge-warning' : 
                    'badge-secondary'
                  }`}>
                    {deal.status}
                  </span>
                </div>
                
                <p className="text-gray-400 mt-2">{deal.description}</p>
                
                <div className="flex gap-2 mt-4">
                  {deal.resources.map(resource => (
                    <span key={resource} className="badge badge-primary">{resource}</span>
                  ))}
                  <Link href={`/deals/${deal.id}`} className="btn btn-primary btn-sm ml-auto">
                    View Details
                  </Link>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.round((deal.currentFunding / deal.fundingGoal) * 100)}%</span>
                  </div>
                  <progress 
                    className="progress progress-primary w-full" 
                    value={deal.currentFunding} 
                    max={deal.fundingGoal}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-base-300 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Target ROI</div>
                    <div className="font-bold">{deal.roi}%</div>
                  </div>
                  <div className="bg-base-300 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Risk Level</div>
                    <div className="font-bold">{deal.risk}</div>
                  </div>
                </div>

                <div className="card-actions justify-end mt-6">
                  <button className="btn btn-primary">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 