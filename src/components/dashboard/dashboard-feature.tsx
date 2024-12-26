'use client'

import { useState } from 'react'
import { WalletButton } from '../solana/solana-provider'

// Define space commodities and tokens
const spaceTokens = [
  { symbol: 'LOX', name: 'Liquid Oxygen', icon: '🌬️' },
  { symbol: 'H3', name: 'Helium-3', icon: '⚛️' },
  { symbol: 'H2O', name: 'Water', icon: '💧' },
  { symbol: 'IRON', name: 'Space Iron', icon: '⛏️' },
  { symbol: 'TITAN', name: 'Titanium', icon: '🛠️' },
  { symbol: 'RGTH', name: 'Regolith', icon: '🌑' },
  { symbol: 'DMND', name: 'Space Diamonds', icon: '💎' },
]

export default function DashboardFeature() {
  const [sellAmount, setSellAmount] = useState('')
  const [buyAmount, setBuyAmount] = useState('')
  const [showSellTokens, setShowSellTokens] = useState(false)
  const [showBuyTokens, setShowBuyTokens] = useState(false)
  const [selectedSellToken, setSelectedSellToken] = useState({ symbol: 'LOX', icon: '🚀' })
  const [selectedBuyToken, setSelectedBuyToken] = useState({ symbol: 'H3', icon: '⚛️' })

  return (
    <div className="max-w-lg mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-base-200 rounded-lg p-6 space-y-6">
        {/* Navigation */}
        <div className="flex space-x-4 justify-center">
          <button className="text-white px-4 py-2 rounded-lg bg-base-100">Swap</button>
          <button className="text-gray-400 px-4 py-2 rounded-lg hover:bg-base-100">Limit</button>
          <button className="text-gray-400 px-4 py-2 rounded-lg hover:bg-base-100">Send</button>
          <button className="text-gray-400 px-4 py-2 rounded-lg hover:bg-base-100">Buy</button>
        </div>

        {/* Sell Input */}
        <div className="bg-base-300 p-4 rounded-lg relative">
          <div className="text-sm text-gray-400 mb-2">Sell</div>
          <div className="flex justify-between items-center">
            <input
              type="number"
              placeholder="0"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              className="bg-transparent text-3xl outline-none w-full"
            />
            <button 
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              onClick={() => setShowSellTokens(!showSellTokens)}
            >
              <span>{selectedSellToken.icon}</span>
              <span>{selectedSellToken.symbol}</span>
              <span>▼</span>
            </button>
          </div>
          <div className="text-sm text-gray-400 mt-2">$0</div>
        </div>

        {/* Swap Icon */}
        <div className="flex justify-center">
          <button className="text-gray-400">↓</button>
        </div>

        {/* Buy Input */}
        <div className="bg-base-300 p-4 rounded-lg relative">
          <div className="text-sm text-gray-400 mb-2">Buy</div>
          <div className="flex justify-between items-center">
            <input
              type="number"
              placeholder="0"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              className="bg-transparent text-3xl outline-none w-full"
            />
            <button 
              className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              onClick={() => setShowBuyTokens(!showBuyTokens)}
            >
              <span>{selectedBuyToken.icon}</span>
              <span>{selectedBuyToken.symbol}</span>
              <span>▼</span>
            </button>
          </div>
        </div>

        {/* Wallet Address */}
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg flex items-center justify-center">
          <span className="font-mono">8oZ7..YTBR</span>
        </div>

        {/* Banner */}
        <div className="bg-base-300 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/20 p-2 rounded-full">🚀</div>
            <div>
              <div className="font-semibold flex items-center space-x-2">
                <span>Space Commodities Exchange</span>
                <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">New</span>
              </div>
              <div className="text-sm text-gray-400">Trade essential space resources across the solar system.</div>
            </div>
          </div>
          <button className="text-gray-400">×</button>
        </div>
      </div>
    </div>
  )
}
