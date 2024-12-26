'use client'

import { useState } from 'react'
import { WalletButton } from '../solana/solana-provider'
import { TokenInput } from '../ui/ui-input'
import { TokenSelect } from '../ui/ui-token-select'

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
  const [selectedSellToken, setSelectedSellToken] = useState(spaceTokens[0])
  const [selectedBuyToken, setSelectedBuyToken] = useState(spaceTokens[1])

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

        <TokenInput
          label="Sell"
          amount={sellAmount}
          setAmount={setSellAmount}
          tokenSymbol={selectedSellToken.symbol}
          tokenIcon={selectedSellToken.icon}
          onTokenSelect={() => setShowSellTokens(true)}
        />

        {/* Swap Icon */}
        <div className="flex justify-center">
          <button className="text-gray-400">↓</button>
        </div>

        <TokenInput
          label="Buy"
          amount={buyAmount}
          setAmount={setBuyAmount}
          tokenSymbol={selectedBuyToken.symbol}
          tokenIcon={selectedBuyToken.icon}
          onTokenSelect={() => setShowBuyTokens(true)}
        />

        {/* Wallet Address */}
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg flex items-center justify-center">
          <span className="font-mono">8oZ7..YTBR</span>
        </div>

        <TokenSelect
          show={showSellTokens}
          hide={() => setShowSellTokens(false)}
          tokens={spaceTokens}
          onSelect={(token) => setSelectedSellToken({
            symbol: token.symbol,
            name: token.name,
            icon: String(token.icon)
          })}
          title="Select Sell Token"
        />

        <TokenSelect
          show={showBuyTokens}
          hide={() => setShowBuyTokens(false)}
          tokens={spaceTokens}
          onSelect={(token) => setSelectedBuyToken({
            symbol: token.symbol,
            name: token.name,
            icon: String(token.icon)
          })}
          title="Select Buy Token"
        />

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
