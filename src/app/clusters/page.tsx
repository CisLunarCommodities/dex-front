'use client'

import { useEffect, useState } from 'react'
import { IconRocket } from '@tabler/icons-react'

interface Cluster {
  id: string
  name: string
  description: string
  deals: number
  totalValue: number
  avgRoi: number
}

export default function ClustersPage() {
  const [clusters, setClusters] = useState<Cluster[]>([
    {
      id: '1',
      name: 'Lunar Operations',
      description: 'Near-Earth and Lunar mining operations',
      deals: 12,
      totalValue: 450000000,
      avgRoi: 185
    },
    {
      id: '2',
      name: 'Mars Initiatives',
      description: 'Mars-focused mining and infrastructure',
      deals: 8,
      totalValue: 780000000,
      avgRoi: 230
    },
    {
      id: '3',
      name: 'Asteroid Belt',
      description: 'Deep space resource extraction',
      deals: 15,
      totalValue: 920000000,
      avgRoi: 275
    }
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mission Clusters</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clusters.map(cluster => (
          <div key={cluster.id} className="bg-[#1a1b1e] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <IconRocket className="text-purple-500" size={24} />
              <h2 className="text-xl font-bold">{cluster.name}</h2>
            </div>
            
            <p className="text-gray-400 mb-6">{cluster.description}</p>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500">Deals</div>
                <div className="font-bold">{cluster.deals}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Value</div>
                <div className="font-bold">${(cluster.totalValue / 1e6).toFixed(1)}M</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Avg ROI</div>
                <div className="font-bold">{cluster.avgRoi}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
