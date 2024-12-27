'use client'

import { useState } from 'react'
import { useAllTokenBalances, SPACE_TOKENS } from '@/lib/token-data-access'
import { TokenInput } from '@/components/ui/ui-input'
import { TokenSelect } from '@/components/ui/ui-token-select'
import { SwapButton } from '@/components/ui/ui-swap-button'
import { useWallet } from '@solana/wallet-adapter-react'

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
  }
]

export default function SwapsPage() {
  const [amount, setAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState(spaceTokens[0])
  const { publicKey } = useWallet()
  const { data: balances, isLoading: loading } = useAllTokenBalances()

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-xl mx-auto pt-16 px-4">
        <div className="bg-[#1a1b1e] rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-8">Trade Space Resources</h1>
          
          <div className="space-y-6">
            <TokenInput
              label="You Pay"
              amount={amount}
              setAmount={setAmount}
              tokenSymbol="SOL"
              tokenIcon="◎"
              onTokenSelect={() => {}}
              balance={balances?.SOL || 0}
            />

            <TokenInput
              label="You Receive"
              amount={(parseFloat(amount || '0') * 100).toString()}
              setAmount={() => {}}
              tokenSymbol={selectedToken.symbol}
              tokenIcon={selectedToken.icon}
              onTokenSelect={() => {}}
              balance={0}
            />

            <SwapButton
              fromToken={{
                symbol: 'SOL',
                amount: amount
              }}
              toToken={{
                symbol: selectedToken.symbol,
                amount: (parseFloat(amount || '0') * 100).toString()
              }}
              onSwap={async () => {
                // Swap logic here
                console.log('Swapping...')
              }}
              isLoading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 