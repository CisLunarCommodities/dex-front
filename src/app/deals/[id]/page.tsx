'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { IconRocket, IconAlertTriangle } from '@tabler/icons-react'
import { PriceChart } from '@/components/ui/ui-price-chart'
import { fetchNeoAsteroids, generateDealFromAsteroid, type SpaceDeal } from '@/lib/nasa'
import clsx from 'clsx'
import { usePriceFeed, setupPriceWebsocket } from '@/lib/price-feed'
import Image from 'next/image'

export default function DealPage() {
  const params = useParams()
  const [deal, setDeal] = useState<SpaceDeal | null>(null)
  const [loading, setLoading] = useState(true)
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const { prices, currentPrice, isLoading, error, fetchPrices } = usePriceFeed()

  const presetAmounts = [
    { label: 'reset', value: '' },
    { label: '0.1 SOL', value: '0.1' },
    { label: '0.5 SOL', value: '0.5' },
    { label: '1 SOL', value: '1' },
  ]

  useEffect(() => {
    async function loadDeal() {
      try {
        const asteroids = await fetchNeoAsteroids()
        if (!params || !params.id) {
          console.error('Invalid parameters:', params)
          setDeal(null)
          setLoading(false)
          return
        }
        const searchId = params.id.toString().replace(/^(mock|asteroid-)/i, '')
        const asteroid = asteroids.find(a => 
          a.neo_reference_id === searchId || 
          a.neo_reference_id === `mock${searchId}` ||
          a.id === searchId
        )
        if (!asteroid) {
          console.error('Asteroid not found:', params?.id)
          setDeal(null)
          setLoading(false)
          return
        }

        const dealData = generateDealFromAsteroid(asteroid)
        const enhancedDeal = {
          ...dealData,
          longDescription: `This groundbreaking mission targets ${asteroid.name}, a ${
            ((asteroid.estimated_diameter.kilometers.estimated_diameter_min + 
              asteroid.estimated_diameter.kilometers.estimated_diameter_max) / 2).toFixed(2)
          }km diameter near-Earth asteroid. Using innovative mining technology, we plan to extract and process valuable resources for use in space-based operations. The mission will demonstrate the viability of asteroid mining and establish crucial infrastructure for future space resource utilization.`,
          highlights: [
            `Optimal delta-v of ${asteroid.close_approach_data[0]?.relative_velocity.kilometers_per_second.slice(0, 5)} km/s`,
            'Advanced autonomous mining systems',
            'Pre-arranged processing facilities',
            `${asteroid.is_potentially_hazardous_asteroid ? 'High-risk, high-reward opportunity' : 'Stable orbital characteristics'}`
          ],
          risks: [
            'Technical challenges in zero-gravity mining',
            'Launch window dependencies',
            'Market price fluctuations for space resources',
            asteroid.is_potentially_hazardous_asteroid ? 
              'Complex orbital dynamics requiring precise navigation' : 
              'Standard operational risks'
          ],
          timeline_details: [
            {
              phase: 'Planning & Design',
              date: '2024 Q4',
              description: 'Mission architecture and systems design'
            },
            {
              phase: 'Construction',
              date: '2025 Q2',
              description: 'Mining equipment and spacecraft assembly'
            },
            {
              phase: 'Launch Window',
              date: dealData.timeline,
              description: 'Mission launch and transit phase'
            },
            {
              phase: 'Operations',
              date: `${parseInt(dealData.timeline.split(' ')[0]) + 1} Q1`,
              description: 'Resource extraction and processing begins'
            }
          ]
        }
        
        setDeal(enhancedDeal)
        setLoading(false)
      } catch (error) {
        console.error('Error loading deal:', error)
        setDeal(null)
        setLoading(false)
      }
    }
    loadDeal()
  }, [params, fetchPrices])

  useEffect(() => {
    if (deal?.id) {
      // Initial price fetch
      fetchPrices(deal.id)
      // Setup websocket for real-time updates
      const ws = setupPriceWebsocket(deal.id)

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.method === 'priceUpdate') {
          // Update price in store
          usePriceFeed.setState((state) => ({
            currentPrice: data.params.price,
            prices: [...state.prices, {
              time: new Date().toISOString().split('T')[0],
              open: state.currentPrice,
              high: Math.max(state.currentPrice, data.params.price),
              low: Math.min(state.currentPrice, data.params.price),
              close: data.params.price
            }]
          }))
        }
      }

      return () => ws.close()
    }
  }, [deal?.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  if (!deal) return null

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 h-screen">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 flex flex-col h-screen">
          {/* Header */}
          <div className="flex justify-between items-start p-4">
            <h1 className="text-2xl font-bold">{deal?.name}</h1>
            <div className="text-xl font-bold text-primary">
              ${(deal?.fundingGoal / 1e6).toFixed(1)}M
            </div>
          </div>
            
          {/* Chart takes maximum space */}
          <div className="flex-1 min-h-0">
            <PriceChart 
              data={[
                { time: '2024-01-01', open: 1.00, high: 1.05, low: 0.98, close: 1.02 },
                { time: '2024-02-01', open: 1.02, high: 1.20, low: 1.01, close: 1.15 },
                { time: '2024-03-01', open: 1.15, high: 1.18, low: 1.05, close: 1.08 },
                { time: '2024-04-01', open: 1.08, high: 1.35, low: 1.07, close: 1.32 },
                { time: '2024-05-01', open: 1.32, high: 1.48, low: 1.30, close: 1.45 },
                { time: '2024-06-01', open: 1.45, high: 1.46, low: 1.39, close: 1.41 },
                { time: '2024-07-01', open: 1.41, high: 1.70, low: 1.40, close: 1.68 },
              ]}
              containerClassName="w-full h-full"
            />
          </div>

          {/* Stats at bottom */}
          <div className="grid grid-cols-2 gap-4 p-4">
            <div className="bg-[#1a1b1e] p-4 rounded-lg">
              <div className="text-2xl font-bold mb-1">{deal?.roi}%</div>
              <div className="text-sm text-gray-400">Target ROI</div>
            </div>
            <div className="bg-[#1a1b1e] p-4 rounded-lg">
              <div className="text-2xl font-bold mb-1">{deal?.risk}</div>
              <div className="text-sm text-gray-400">Risk Level</div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-1 bg-[#1a1b1e] overflow-auto">
          <div className="p-8 space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{Math.round((deal?.currentFunding / deal?.fundingGoal) * 100)}%</span>
              </div>
              <progress 
                className="progress progress-primary w-full" 
                value={deal?.currentFunding} 
                max={deal?.fundingGoal}
              />
            </div>

            {/* Trade Panel */}
            <div className="rounded-lg bg-[#1f2937] p-4">
              {/* Buy/Sell Toggle */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  className={clsx(
                    'py-3 px-6 rounded-lg text-lg font-medium transition-colors',
                    tradeType === 'buy' 
                      ? 'bg-green-500 text-black' 
                      : 'bg-[#2d3748] text-gray-400'
                  )}
                  onClick={() => setTradeType('buy')}
                >
                  buy
                </button>
                <button
                  className={clsx(
                    'py-3 px-6 rounded-lg text-lg font-medium transition-colors',
                    tradeType === 'sell' 
                      ? 'bg-red-500 text-black' 
                      : 'bg-[#2d3748] text-gray-400'
                  )}
                  onClick={() => setTradeType('sell')}
                >
                  sell
                </button>
              </div>

              {/* Advanced Options */}
              <div className="flex gap-3 mb-4">
                <button className="px-4 py-2 rounded-lg bg-[#2d3748] text-gray-400 text-sm">
                  switch to WIP
                </button>
                <button className="px-4 py-2 rounded-lg bg-[#2d3748] text-gray-400 text-sm">
                  set max slippage
                </button>
              </div>

              {/* Amount Input */}
              <div className="mb-4">
                <label className="text-gray-400 mb-2 block">
                  amount (SOL)
                </label>
                <div className="flex items-center bg-[#2d3748] rounded-lg p-3">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-transparent flex-1 text-2xl outline-none"
                    placeholder="0.00"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xl">SOL</span>
                    <Image 
                      src="/solana-logo.svg" 
                      alt="SOL" 
                      className="w-6 h-6"
                      width={24}
                      height={24}
                    />
                  </div>
                </div>
              </div>

              {/* Preset Amounts */}
              <div className="flex gap-2 mb-4">
                {presetAmounts.map(({ label, value }) => (
                  <button
                    key={label}
                    onClick={() => setAmount(value)}
                    className="px-4 py-2 rounded-lg bg-[#2d3748] text-gray-400 text-sm hover:bg-[#374151]"
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Place Trade Button */}
              <button 
                className={clsx(
                  'w-full py-4 rounded-lg text-lg font-medium transition-colors',
                  tradeType === 'buy' 
                    ? 'bg-green-500 hover:bg-green-600 text-black' 
                    : 'bg-red-500 hover:bg-red-600 text-black'
                )}
              >
                place trade
              </button>
            </div>

            {/* Team Info */}
            <div className="text-center text-sm text-gray-400">
              {deal?.team.members} team members • {deal?.team.experience}
            </div>
          </div>
        </div>
      </div>

      {/* Mission Details Section */}
      <div className="bg-[#1a1b1e]">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Mission Overview */}
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="text-2xl font-bold mb-6">Mission Overview</h2>
                <p className="text-gray-300 leading-relaxed">
                  {deal?.description}
                </p>
              </section>

              {/* Mission Timeline */}
              <section>
                <h2 className="text-2xl font-bold mb-6">Mission Timeline</h2>
                <div className="space-y-8">
                  {deal?.timeline_details.map((phase: { date: string; phase: string }, index: number) => (
                    <div key={index} className="relative pl-8 border-l-2 border-primary">
                      <div className="absolute left-0 top-0 w-3 h-3 rounded-full bg-primary -translate-x-[7px]" />
                      <div className="font-mono text-primary mb-2">{phase.date}</div>
                      <div className="font-semibold text-xl mb-2">{phase.phase}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Technical Details */}
              <section>
                <h2 className="text-2xl font-bold mb-6">Technical Details</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-black/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Orbital Parameters</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Delta-v</span>
                        <span>{deal?.highlights[0]?.split(' ')[3]} km/s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Launch Window</span>
                        <span>{deal?.timeline_details[2]?.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Mission Duration</span>
                        <span>18 months</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Resource Targets</h3>
                    <div className="space-y-3">
                      {deal?.resources.map((resource, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-gray-400">{resource}</span>
                          <span>Estimated: High</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Team & Partners */}
              <section>
                <h2 className="text-2xl font-bold mb-6">Team & Partners</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-black/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Core Team</h3>
                    <div className="text-gray-300">
                      <p className="mb-2">{deal?.team.members} team members</p>
                      <p>{deal?.team.experience}</p>
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Key Partners</h3>
                    <ul className="list-disc list-inside text-gray-300">
                      <li>Launch Services Provider</li>
                      <li>Mining Equipment Manufacturer</li>
                      <li>Resource Processing Facility</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>

            {/* Risk & Investment Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                <section className="bg-black/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Investment Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Funding Goal</span>
                      <span>${(deal?.fundingGoal / 1e6).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Target ROI</span>
                      <span>{deal?.roi}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Risk Level</span>
                      <span>{deal?.risk}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Token Price</span>
                      <span>1.68 USDC</span>
                    </div>
                  </div>
                </section>

                <section className="bg-black/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
                  <div className="space-y-3">
                    {typeof deal?.risk === 'string' ? (
                      <div className="flex items-start gap-3 text-gray-300">
                        <IconAlertTriangle className="text-warning mt-1" size={16} />
                        <span>{deal.risk}</span>
                      </div>
                    ) : null}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 