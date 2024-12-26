'use client'

import { useEffect, useState } from 'react'
import { fetchAsterankData } from '@/lib/asterank'

interface AsteroidMarket {
  symbol: string
  price: number
  supply: number
  source: string
  miningDifficulty?: number
  composition?: {
    water?: number
    iron?: number
    platinum?: number
  }
  orbit?: {
    delta_v: number
    semi_major_axis: number
    eccentricity: number
  }
}

export default function MarketPage() {
  const [marketData, setMarketData] = useState<AsteroidMarket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMarketData() {
      const data = await fetchAsterankData()
      setMarketData(data)
      setLoading(false)
    }
    loadMarketData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Space Resources Market</h1>
        <div className="flex gap-2">
          <select className="select select-bordered">
            <option>All Resources</option>
            <option>Water Ice</option>
            <option>Precious Metals</option>
            <option>Rare Earth</option>
          </select>
          <select className="select select-bordered">
            <option>Sort by Value</option>
            <option>Sort by Accessibility</option>
            <option>Sort by Supply</option>
          </select>
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="stat bg-base-200 rounded-lg p-4">
          <div className="stat-title">Total Market Cap</div>
          <div className="stat-value text-2xl">
            ${(marketData.reduce((sum, item) => sum + item.price, 0) / 1e9).toFixed(1)}B
          </div>
          <div className="stat-desc">All minable resources</div>
        </div>
        <div className="stat bg-base-200 rounded-lg p-4">
          <div className="stat-title">Active Mining Sites</div>
          <div className="stat-value text-2xl">{marketData.length}</div>
          <div className="stat-desc">Across the solar system</div>
        </div>
        <div className="stat bg-base-200 rounded-lg p-4">
          <div className="stat-title">Average Delta-v</div>
          <div className="stat-value text-2xl">
            {(marketData.reduce((sum, item) => sum + (item.orbit?.delta_v || 0), 0) / marketData.length).toFixed(1)} km/s
          </div>
          <div className="stat-desc">Mining accessibility</div>
        </div>
        <div className="stat bg-base-200 rounded-lg p-4">
          <div className="stat-title">Resource Types</div>
          <div className="stat-value text-2xl">
            {new Set(marketData.map(item => item.symbol)).size}
          </div>
          <div className="stat-desc">Unique commodities</div>
        </div>
      </div>

      {/* Resource Table */}
      <div className="bg-base-200 rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Source</th>
                <th>Resource</th>
                <th>Composition</th>
                <th>Mining Difficulty</th>
                <th>Est. Value</th>
                <th>Delta-v</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {marketData.map((item, index) => (
                <tr key={index} className="hover:bg-base-300">
                  <td className="font-mono">{item.source}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      {getResourceIcon(item.symbol)}
                      <div>
                        <div className="font-bold">{item.symbol}</div>
                        <div className="text-sm opacity-60">{getResourceIcon(item.symbol)}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {item.composition && (
                      <div className="flex gap-1">
                        {item.composition.water && (
                          <span className="badge badge-info">H2O {(item.composition.water * 100).toFixed(1)}%</span>
                        )}
                        {item.composition.iron && (
                          <span className="badge badge-error">Fe {(item.composition.iron * 100).toFixed(1)}%</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <progress 
                        className="progress progress-primary w-20" 
                        value={item.miningDifficulty || 50} 
                        max="100"
                      />
                      <span className="text-sm">{item.miningDifficulty || 50}%</span>
                    </div>
                  </td>
                  <td>${item.price.toFixed(2)}B</td>
                  <td>{item.orbit?.delta_v.toFixed(1)} km/s</td>
                  <td>
                    <span className="badge badge-success">Minable</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-base-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Resource Distribution</h2>
          <div className="space-y-4">
            {Object.entries(groupBySymbol(marketData)).map(([symbol, resources]) => (
              <div key={symbol} className="flex items-center gap-4">
                <div className="w-24">{symbol}</div>
                <div className="flex-1 bg-base-300 rounded-full h-4">
                  <div 
                    className="bg-primary rounded-full h-4" 
                    style={{ 
                      width: `${(resources.length / marketData.length * 100)}%` 
                    }}
                  />
                </div>
                <div className="w-16 text-right">{resources.length}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-base-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Value Distribution</h2>
          <div className="space-y-4">
            {Object.entries(groupBySymbol(marketData)).map(([symbol, resources]) => {
              const totalValue = resources.reduce((sum, item) => sum + item.price, 0)
              const marketShare = totalValue / marketData.reduce((sum, item) => sum + item.price, 0) * 100
              return (
                <div key={symbol} className="flex items-center gap-4">
                  <div className="w-24">{symbol}</div>
                  <div className="flex-1 bg-base-300 rounded-full h-4">
                    <div 
                      className="bg-secondary rounded-full h-4" 
                      style={{ width: `${marketShare}%` }}
                    />
                  </div>
                  <div className="w-16 text-right">{marketShare.toFixed(1)}%</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function getResourceIcon(symbol: string): string {
  const icons: Record<string, string> = {
    'LOX': '🌬️',
    'H2O': '💧',
    'IRON': '⛏��',
    'H3': '⚛️',
  }
  return icons[symbol] || '🪨'
}

function groupBySymbol(data: AsteroidMarket[]): Record<string, AsteroidMarket[]> {
  return data.reduce((groups, item) => {
    const group = groups[item.symbol] || []
    group.push(item)
    groups[item.symbol] = group
    return groups
  }, {} as Record<string, AsteroidMarket[]>)
} 