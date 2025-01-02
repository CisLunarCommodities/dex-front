'use client'

import { useState } from 'react'
import { useAllTokenBalances, SPACE_TOKENS } from '@/lib/token-data-access'
import { TokenInput } from '../ui/ui-input'
import { useWallet } from '@solana/wallet-adapter-react'

interface TokenBalance {
  mint: string
  symbol: string
  balance: number
  price: number
  decimals: number
  metadata?: {
    name: string
    symbol: string
    uri: string
  }
}

const spaceTokens = [
  {
    symbol: 'LOX',
    name: 'Liquid Oxygen',
    icon: '🌬️',
    price: 0,
    supply: 0,
    address: SPACE_TOKENS.LOX.toString()
  },
  {
    symbol: 'H3',
    name: 'Helium-3',
    icon: '⚛️',
    price: 0,
    supply: 0,
    address: SPACE_TOKENS.H3.toString()
  },
]

export default function DashboardFeature() {
  const { connected } = useWallet()
  const { data: tokenBalances, isLoading: isLoadingBalances, error } = useAllTokenBalances()

  return (
    <div className="container mx-auto p-4">
      <div className="bg-[#1a1b1e] rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Space Resources Dashboard</h1>
        {/* Add your dashboard content here */}
      </div>
    </div>
  )
}
