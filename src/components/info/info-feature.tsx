'use client'

import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data for charts
const tvlData = Array.from({ length: 365 }, (_, i) => ({
  date: new Date(Date.now() - (365 - i) * 24 * 60 * 60 * 1000),
  value: Math.random() * 5 + 2,
}))

const volumeData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000),
  value: Math.random() * 10,
}))

export default function InfoFeature() {
  const [timeframe, setTimeframe] = useState('D')

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* TVL Section */}
      <div className="card bg-base-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Space DEX TVL</h2>
          <div className="btn-group">
            <button className={`btn btn-sm ${timeframe === 'D' ? 'btn-active' : ''}`} onClick={() => setTimeframe('D')}>D</button>
            <button className={`btn btn-sm ${timeframe === 'W' ? 'btn-active' : ''}`} onClick={() => setTimeframe('W')}>W</button>
            <button className={`btn btn-sm ${timeframe === 'M' ? 'btn-active' : ''}`} onClick={() => setTimeframe('M')}>M</button>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tvlData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Volume Section */}
      <div className="card bg-base-200 p-6">
        <h2 className="text-2xl font-bold mb-4">Trading Volume</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Token Table */}
      <div className="card bg-base-200 p-6">
        <h2 className="text-2xl font-bold mb-4">Top Tokens</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Token</th>
                <th>Price</th>
                <th>24h</th>
                <th>Volume</th>
                <th>TVL</th>
              </tr>
            </thead>
            <tbody>
              {/* Reference existing space tokens */}
              <tr>
                <td>1</td>
                <td>LOX</td>
                <td>$1.23</td>
                <td className="text-success">+5.67%</td>
                <td>$1.2M</td>
                <td>$4.5M</td>
              </tr>
              {/* Add more rows */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 