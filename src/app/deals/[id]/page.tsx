'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { IconRocket, IconPick, IconChartBar, IconUsers, IconClock, IconAlertTriangle } from '@tabler/icons-react'

// Reuse the SpaceDeal type from deals page
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
  // Additional details for the full page
  longDescription?: string
  highlights?: string[]
  risks?: string[]
  timeline_details?: {
    phase: string
    date: string
    description: string
  }[]
  gallery?: string[]
}

export default function DealPage() {
  const params = useParams()
  const [deal, setDeal] = useState<SpaceDeal | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState('')

  useEffect(() => {
    // In real app, fetch from API using params.id
    setDeal({
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
      longDescription: `This groundbreaking mission aims to establish the first commercial water extraction operation on a near-Earth asteroid. Using innovative mining technology, we plan to extract and process water ice for use in space-based operations. The mission will demonstrate the viability of asteroid mining and establish crucial infrastructure for future space resource utilization.`,
      highlights: [
        'Proprietary water extraction technology',
        'Partnership with major space launch providers',
        'Pre-signed contracts with orbital fuel depots',
        'Experienced team from NASA and private space sector'
      ],
      risks: [
        'Technical challenges in zero-gravity mining',
        'Launch window dependencies',
        'Market price fluctuations for space resources',
        'Regulatory compliance requirements'
      ],
      timeline_details: [
        { phase: 'Launch Preparation', date: '2024 Q4', description: 'Final assembly and testing of mining equipment' },
        { phase: 'Transit to Asteroid', date: '2025 Q1', description: 'Six-month journey to target asteroid' },
        { phase: 'Mining Operations', date: '2025 Q3', description: 'Begin resource extraction and processing' },
        { phase: 'First Delivery', date: '2026 Q1', description: 'Initial shipment of processed water to orbital customers' }
      ]
    })
  }, [params.id])

  if (!deal) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-base-200 rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-4">{deal.name}</h1>
            <div className="flex gap-2 mb-4">
              {deal.resources.map(resource => (
                <span key={resource} className="badge badge-primary">{resource}</span>
              ))}
            </div>
            <p className="text-lg mb-6">{deal.longDescription}</p>
            
            <h2 className="text-xl font-bold mb-4">Key Highlights</h2>
            <ul className="space-y-2">
              {deal.highlights?.map((highlight, index) => (
                <li key={index} className="flex items-center gap-2">
                  <IconRocket size={20} className="text-primary" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-base-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Mission Timeline</h2>
            <div className="space-y-4">
              {deal.timeline_details?.map((phase, index) => (
                <div key={index} className="flex gap-4">
                  <IconClock size={24} className="text-primary flex-shrink-0" />
                  <div>
                    <div className="font-bold">{phase.phase} - {phase.date}</div>
                    <div className="text-gray-400">{phase.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-base-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Risk Assessment</h2>
            <div className="space-y-4">
              {deal.risks?.map((risk, index) => (
                <div key={index} className="flex gap-4">
                  <IconAlertTriangle size={24} className="text-warning flex-shrink-0" />
                  <div>{risk}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Investment Panel */}
        <div className="space-y-6">
          <div className="bg-base-200 rounded-lg p-6 sticky top-6">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold">${(deal.fundingGoal / 1e6).toFixed(1)}M</div>
              <div className="text-gray-400">Funding Goal</div>
            </div>

            <div className="mb-6">
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

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-base-300 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold">{deal.roi}%</div>
                <div className="text-sm text-gray-400">Target ROI</div>
              </div>
              <div className="bg-base-300 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold">{deal.risk}</div>
                <div className="text-sm text-gray-400">Risk Level</div>
              </div>
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Investment Amount</span>
              </label>
              <div className="input-group">
                <span>$</span>
                <input 
                  type="number" 
                  placeholder="Amount" 
                  className="input input-bordered w-full" 
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                />
              </div>
            </div>

            <button className="btn btn-primary w-full">
              Invest Now
            </button>

            <div className="mt-4 text-center text-sm text-gray-400">
              {deal.team.members} team members • {deal.team.experience}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 