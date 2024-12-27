'use client'

import { create } from 'zustand'
import { getTokenPrice } from './helius'

interface PriceData {
  time: string
  open: number
  high: number
  low: number
  close: number
}

interface PriceFeedStore {
  prices: PriceData[]
  currentPrice: number
  isLoading: boolean
  error: string | null
  fetchPrices: (mintAddress: string) => Promise<void>
}

export const usePriceFeed = create<PriceFeedStore>((set) => ({
  prices: [],
  currentPrice: 0,
  isLoading: false,
  error: null,
  fetchPrices: async (mintAddress: string) => {
    set({ isLoading: true })
    try {
      const price = await getTokenPrice(mintAddress)
      
      // For now, create synthetic OHLC data from the current price
      // This should be replaced with real historical data when available
      const currentDate = new Date()
      const newPrice: PriceData = {
        time: currentDate.toISOString().split('T')[0],
        open: price,
        high: price * 1.02, // Simulate some variation
        low: price * 0.98,
        close: price
      }

      set({ 
        prices: [newPrice],
        currentPrice: price,
        isLoading: false 
      })
    } catch (error) {
      console.error('Price feed error:', error)
      set({ error: 'Failed to fetch price data', isLoading: false })
    }
  }
}))

// Websocket connection for real-time updates
export const setupPriceWebsocket = (mintAddress: string) => {
  const ws = new WebSocket(`wss://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`)

  ws.onopen = () => {
    ws.send(JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'priceSubscribe',
      params: {
        mintAccount: mintAddress
      }
    }))
  }

  return ws
} 