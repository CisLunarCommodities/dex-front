'use client'

import { useEffect, useState } from 'react'
import { useMarketData } from '@/lib/market-data'
import { IconRocket, IconPick, IconChartBar, IconUsers } from '@tabler/icons-react'

interface SpaceDeal {
  id: string
  name: string
  type: 'MISSION' | 'COMPANY'
  description: string
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
}

export default function DealsPage() {
  const { resources } = useMarketData()
  const [deals, setDeals] = useState<SpaceDeal[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    // In real app, fetch from API
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
        }
      },
      // Add more deals...
    ])
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Space Mining Opportunities</h1>
        <p className="text-xl text-gray-400">
          Join the next generation of space resource missions and companies
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="stat bg-base-200 rounded-lg p-6">
          <div className="stat-title">Total Value Locked</div>
          <div className="stat-value text-2xl">$1.11B</div>
          <div className="stat-desc">In active missions</div>
        </div>
        <div className="stat bg-base-200 rounded-lg p-6">
          <div className="stat-title">Active Deals</div>
          <div className="stat-value text-2xl">218</div>
          <div className="stat-desc">Across all categories</div>
        </div>
        <div className="stat bg-base-200 rounded-lg p-6">
          <div className="stat-title">Average ROI</div>
          <div className="stat-value text-2xl">312%</div>
          <div className="stat-desc">Historical returns</div>
        </div>
        <div className="stat bg-base-200 rounded-lg p-6">
          <div className="stat-title">Success Rate</div>
          <div className="stat-value text-2xl">89%</div>
          <div className="stat-desc">Completed missions</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-8">
        <button 
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setFilter('all')}
        >
          All Deals
        </button>
        <button 
          className={`btn ${filter === 'missions' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setFilter('missions')}
        >
          Missions
        </button>
        <button 
          className={`btn ${filter === 'companies' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setFilter('companies')}
        >
          Companies
        </button>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map(deal => (
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
  )
} 