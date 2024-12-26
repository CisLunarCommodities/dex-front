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
  const [buyAmount, setBuyAmount] = useState('0')
  const [selectedSellToken, setSelectedSellToken] = useState(spaceTokens[0])
  const [selectedBuyToken, setSelectedBuyToken] = useState(spaceTokens[1])
  const [showSellTokens, setShowSellTokens] = useState(false)
  const [showBuyTokens, setShowBuyTokens] = useState(false)

  const TokenSelector = ({ 
    tokens, 
    show, 
    onClose, 
    onSelect, 
    selected 
  }: { 
    tokens: typeof spaceTokens, 
    show: boolean, 
    onClose: () => void, 
    onSelect: (token: typeof spaceTokens[0]) => void,
    selected: typeof spaceTokens[0]
  }) => {
    if (!show) return null;

    return (
      <div className="absolute mt-2 w-64 bg-base-300 rounded-lg shadow-xl z-50">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Select Token</h3>
            <button onClick={onClose} className="btn btn-ghost btn-sm">×</button>
          </div>
          <div className="space-y-2">
            {tokens.filter(t => t.symbol !== selected.symbol).map((token) => (
              <button
                key={token.symbol}
                onClick={() => {
                  onSelect(token);
                  onClose();
                }}
                className="w-full flex items-center p-2 hover:bg-base-200 rounded-lg"
              >
                <span className="text-2xl mr-2">{token.icon}</span>
                <div className="text-left">
                  <div className="font-bold">{token.symbol}</div>
                  <div className="text-sm text-gray-400">{token.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-lg mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-base-200 rounded-lg p-6 space-y-6">
        {/* Navigation */}
        <div className="flex space-x-4 justify-center mb-6">
          <button className="btn btn-ghost btn-active">Swap</button>
          <button className="btn btn-ghost">Limit</button>
          <button className="btn btn-ghost">Send</button>
          <button className="btn btn-ghost">Buy</button>
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
              className="bg-transparent text-2xl outline-none w-full"
            />
            <button 
              className="btn btn-primary"
              onClick={() => setShowSellTokens(!showSellTokens)}
            >
              <span className="mr-2">{selectedSellToken.icon}</span>
              {selectedSellToken.symbol} ▼
            </button>
          </div>
          <div className="text-sm text-gray-400 mt-2">$0</div>
          <TokenSelector
            tokens={spaceTokens}
            show={showSellTokens}
            onClose={() => setShowSellTokens(false)}
            onSelect={setSelectedSellToken}
            selected={selectedBuyToken}
          />
        </div>

        {/* Swap Icon */}
        <div className="flex justify-center">
          <button 
            className="btn btn-circle btn-sm"
            onClick={() => {
              const temp = selectedSellToken;
              setSelectedSellToken(selectedBuyToken);
              setSelectedBuyToken(temp);
            }}
          >
            ↓
          </button>
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
              className="bg-transparent text-2xl outline-none w-full"
            />
            <button 
              className="btn btn-secondary"
              onClick={() => setShowBuyTokens(!showBuyTokens)}
            >
              {selectedBuyToken ? (
                <>
                  <span className="mr-2">{selectedBuyToken.icon}</span>
                  {selectedBuyToken.symbol} ▼
                </>
              ) : (
                'Select token ▼'
              )}
            </button>
          </div>
          <TokenSelector
            tokens={spaceTokens}
            show={showBuyTokens}
            onClose={() => setShowBuyTokens(false)}
            onSelect={setSelectedBuyToken}
            selected={selectedSellToken}
          />
        </div>

        {/* Connect Wallet Button */}
        <WalletButton className="btn btn-primary w-full" />

        {/* Cross-chain Banner */}
        <div className="bg-base-300 p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              🚀
            </div>
            <div>
              <div className="font-semibold">Space Commodities Exchange <span className="badge badge-primary">New</span></div>
              <div className="text-sm text-gray-400">Trade essential space resources across the solar system.</div>
            </div>
          </div>
          <button className="btn btn-sm btn-ghost">×</button>
        </div>
      </div>
    </div>
  )
}
