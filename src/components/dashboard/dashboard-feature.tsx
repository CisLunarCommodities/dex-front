'use client'

import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, useState } from 'react'
import { useAllTokenBalances, SPACE_TOKENS } from '@/lib/token-data-access'
import { TokenInput } from '../ui/ui-input'
import { TokenSelect } from '../ui/ui-token-select'
import { SwapButton } from '../ui/ui-swap-button'
import { useWallet } from '@solana/wallet-adapter-react'

// Define space tokens in the dashboard
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
  
  const [showBuyTokens, setShowBuyTokens] = useState(false)
  const [showSellTokens, setShowSellTokens] = useState(false)
  
  const [selectedBuyToken, setSelectedBuyToken] = useState(spaceTokens[0])
  const [selectedSellToken, setSelectedSellToken] = useState(spaceTokens[1])
  
  const [buyAmount, setBuyAmount] = useState('')
  const [sellAmount, setSellAmount] = useState('')

  // Debug logging
  console.log('Token balances:', tokenBalances)
  console.log('Loading:', isLoadingBalances)
  console.log('Error:', error)

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      {/* Token Balances */}
      {connected && (
        <div className="mb-8 p-4 bg-base-200 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Your Balances</h2>
          <div className="space-y-2">
            {isLoadingBalances ? (
              <div className="flex justify-center">
                <div className="loading loading-spinner loading-md" />
              </div>
            ) : error ? (
              <div className="text-error">Error loading balances</div>
            ) : tokenBalances && tokenBalances.length > 0 ? (
              tokenBalances.map((token) => (
                <div key={token.mint} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {token.symbol === 'LOX' ? '🌬️' : '⚛️'}
                    </span>
                    <span>{token.symbol}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono">
                      {token.balance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6
                      })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                No tokens found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rest of your swap interface */}
      <div className="space-y-4">
        <TokenInput
          label="You Pay"
          amount={sellAmount}
          setAmount={setSellAmount}
          tokenSymbol={selectedSellToken.symbol}
          tokenIcon={selectedSellToken.icon}
          onTokenSelect={() => setShowSellTokens(true)}
          balance={tokenBalances?.find((t: { mint: string }) => t.mint === selectedSellToken.address)?.balance}
        />

        <TokenInput
          label="You Receive"
          amount={buyAmount}
          setAmount={setBuyAmount}
          tokenSymbol={selectedBuyToken.symbol}
          tokenIcon={selectedBuyToken.icon}
          onTokenSelect={() => setShowBuyTokens(true)}
          balance={tokenBalances?.find((t: { mint: string }) => t.mint === selectedBuyToken.address)?.balance}
        />

        <TokenSelect
          show={showBuyTokens}
          hide={() => setShowBuyTokens(false)}
          tokens={spaceTokens}
          onSelect={(token) => setSelectedBuyToken({
            ...token,
            price: token.price || 0,
            supply: token.supply || 0,
            icon: token.icon as string
          })}
          title="Select Buy Token"
        />

        <TokenSelect
          show={showSellTokens}
          hide={() => setShowSellTokens(false)}
          tokens={spaceTokens}
          onSelect={(token) => setSelectedSellToken({
            ...token,
            price: token.price || 0,
            supply: token.supply || 0,
            icon: token.icon as string
          })}
          title="Select Sell Token"
        />

        <SwapButton
          fromToken={{
            symbol: selectedSellToken.symbol,
            amount: sellAmount
          }}
          toToken={{
            symbol: selectedBuyToken.symbol,
            amount: buyAmount
          }}
          onSwap={async () => {
            // Implement swap logic here
            console.log('Swapping tokens...')
          }}
        />
      </div>
    </div>
  )
}
