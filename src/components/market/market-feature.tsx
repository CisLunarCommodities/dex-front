'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

interface Asteroid {
  full_name: string
  price: number
  profit: number
  dv: number // delta-v (difficulty to reach)
  spec: string // spectral type
  id: string
  score: number
}

export default function MarketFeature() {
  const [sortField, setSortField] = useState<keyof Asteroid>('price')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const { data: asteroids, isLoading } = useQuery({
    queryKey: ['asteroids'],
    queryFn: async () => {
      // Query for promising mining candidates: high value, reasonable delta-v
      const query = {
        price: { $gt: 100000 }, // Worth over $100k
        dv: { $lt: 8 }, // Delta-v under 8 km/s
        spec: { $in: ['C', 'S', 'M'] } // Common spectral types
      }
      
      const response = await fetch(
        `https://asterank.com/api/asterank?` + 
        `query=${encodeURIComponent(JSON.stringify(query))}` +
        `&limit=20`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch asteroid data')
      }

      const data = await response.json()
      return data as Asteroid[]
    }
  })

  const sortedAsteroids = asteroids?.sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    return sortDirection === 'asc' ? 
      (aValue > bValue ? 1 : -1) : 
      (aValue < bValue ? 1 : -1)
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-base-200 p-6">
        <h2 className="text-2xl font-bold mb-4">Asteroid Mining Opportunities</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th onClick={() => {
                  if (sortField === 'price') {
                    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
                  } else {
                    setSortField('price')
                    setSortDirection('desc')
                  }
                }} className="cursor-pointer">
                  Value {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => {
                  if (sortField === 'profit') {
                    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
                  } else {
                    setSortField('profit')
                    setSortDirection('desc')
                  }
                }} className="cursor-pointer">
                  Profit {sortField === 'profit' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => {
                  if (sortField === 'dv') {
                    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
                  } else {
                    setSortField('dv')
                    setSortDirection('asc')
                  }
                }} className="cursor-pointer">
                  Difficulty {sortField === 'dv' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center">
                    <div className="loading loading-spinner loading-md mx-auto"></div>
                  </td>
                </tr>
              ) : sortedAsteroids?.map(asteroid => (
                <tr key={asteroid.id}>
                  <td>{asteroid.full_name}</td>
                  <td>${(asteroid.price / 1e9).toFixed(2)}B</td>
                  <td>${(asteroid.profit / 1e9).toFixed(2)}B</td>
                  <td>{asteroid.dv.toFixed(2)} km/s</td>
                  <td>{asteroid.spec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 