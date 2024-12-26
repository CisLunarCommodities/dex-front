'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { SpaceResource, fetchAsterankData } from './asterank'

interface MarketDataContextType {
  resources: SpaceResource[]
  loading: boolean
  refresh: () => Promise<void>
}

const MarketDataContext = createContext<MarketDataContextType>({
  resources: [],
  loading: true,
  refresh: async () => {},
})

export function MarketDataProvider({ children }: { children: React.ReactNode }) {
  const [resources, setResources] = useState<SpaceResource[]>([])
  const [loading, setLoading] = useState(true)

  async function refresh() {
    setLoading(true)
    const data = await fetchAsterankData()
    setResources(data)
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <MarketDataContext.Provider value={{ resources, loading, refresh }}>
      {children}
    </MarketDataContext.Provider>
  )
}

export function useMarketData() {
  return useContext(MarketDataContext)
} 