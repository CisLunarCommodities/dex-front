'use client'

import { ReactNode } from 'react'

interface TokenInputProps {
  label: string
  amount: string
  setAmount: (value: string) => void
  tokenSymbol: string
  tokenIcon: ReactNode
  onTokenSelect: () => void
  showUsdAmount?: boolean
  balance?: number
}

export function TokenInput({
  label,
  amount,
  setAmount,
  tokenSymbol,
  tokenIcon,
  onTokenSelect,
  showUsdAmount = true,
  balance = 0,
}: TokenInputProps) {
  return (
    <div className="bg-base-300 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-400">{label}</div>
        {balance !== undefined && (
          <div className="text-sm text-gray-400">
            Balance: {balance.toLocaleString()} {tokenSymbol}
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <input
          type="number"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-transparent text-3xl outline-none w-full"
        />
        <button 
          onClick={onTokenSelect}
          className="bg-primary/20 hover:bg-primary/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <span>{tokenIcon}</span>
          <span>{tokenSymbol}</span>
          <span>▼</span>
        </button>
      </div>
      {showUsdAmount && <div className="text-sm text-gray-400 mt-2">$0</div>}
    </div>
  )
} 