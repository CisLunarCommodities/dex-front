'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'
import { IconArrowRight } from '@tabler/icons-react'
import toast from 'react-hot-toast'

interface SwapButtonProps {
  fromToken: {
    symbol: string
    amount: string
  }
  toToken: {
    symbol: string
    amount: string
  }
  onSwap: () => Promise<void>
  isLoading?: boolean
}

export function SwapButton({ fromToken, toToken, onSwap, isLoading = false }: SwapButtonProps) {
  const { connected } = useWallet()
  const [isPending, setIsPending] = useState(false)

  const handleSwap = async () => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!fromToken.amount || parseFloat(fromToken.amount) <= 0) {
      toast.error('Please enter an amount to swap')
      return
    }

    try {
      setIsPending(true)
      await onSwap()
      toast.success(`Successfully swapped ${fromToken.amount} ${fromToken.symbol} to ${toToken.amount} ${toToken.symbol}`)
    } catch (error) {
      console.error('Swap failed:', error)
      toast.error('Swap failed. Please try again.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <button
      onClick={handleSwap}
      disabled={!connected || isLoading || isPending || !fromToken.amount || parseFloat(fromToken.amount) <= 0}
      className={`
        w-full py-4 px-6 rounded-lg font-semibold text-lg
        flex items-center justify-center gap-2
        ${connected 
          ? 'bg-primary hover:bg-primary/90 text-primary-content' 
          : 'bg-base-300 text-base-content'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
      `}
    >
      {isPending || isLoading ? (
        <>
          <div className="loading loading-spinner loading-sm" />
          Swapping...
        </>
      ) : !connected ? (
        'Connect Wallet to Swap'
      ) : !fromToken.amount || parseFloat(fromToken.amount) <= 0 ? (
        'Enter an amount'
      ) : (
        <>
          Swap {fromToken.symbol} <IconArrowRight size={20} /> {toToken.symbol}
        </>
      )}
    </button>
  )
} 