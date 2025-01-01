'use client'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { getBalancesByOwner, getTokenMetadata, getTokenPrice } from './helius'

interface TokenAsset {
  id: string
  content?: {
    metadata?: {
      symbol?: string
    }
  }
  token_info?: {
    balance: string
    decimals: number
  }
}

export const SPACE_TOKENS = {
  LOX: new PublicKey(process.env.NEXT_PUBLIC_LOX_TOKEN_MINT!),
  H3: new PublicKey(process.env.NEXT_PUBLIC_H3_TOKEN_MINT!),
} as const

export function useAllTokenBalances() {
  const { publicKey } = useWallet()
  const { connection } = useConnection()

  return useQuery({
    queryKey: ['all-token-balances', publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey) return []

      try {
        // Get all assets owned by the wallet
        const assets = await getBalancesByOwner(publicKey.toString())
        
        // Filter for our space tokens and map to the format we need
        const spaceTokens = assets
          .filter((asset: TokenAsset) => 
            Object.values(SPACE_TOKENS)
              .map(pk => pk.toString())
              .includes(asset.id)
          )
          .map((asset: TokenAsset) => ({
            mint: asset.id,
            symbol: asset.content?.metadata?.symbol || 'Unknown',
            balance: asset.token_info ? 
              Number(asset.token_info.balance) / Math.pow(10, asset.token_info.decimals || 0) : 
              0,
            decimals: asset.token_info?.decimals || 0,
          }))

        return spaceTokens
      } catch (error) {
        console.error('Error fetching token balances:', error)
        throw error
      }
    },
    enabled: !!publicKey,
    refetchInterval: 30000,
  })
}

export function useTokenMetadata(mintAddress: string) {
  return useQuery({
    queryKey: ['token-metadata', mintAddress],
    queryFn: async () => {
      const metadata = await getTokenMetadata([mintAddress])
      return metadata[0]
    },
  })
}

export function useTokenPrice(mintAddress: string) {
  return useQuery({
    queryKey: ['token-price', mintAddress],
    queryFn: () => getTokenPrice(mintAddress),
    refetchInterval: 60000, // Refetch every minute
  })
}

// Hook to get complete token info including balance, metadata, and price
export function useTokenInfo(mintAddress: string) {
  const { data: metadata } = useTokenMetadata(mintAddress)
  const { data: price } = useTokenPrice(mintAddress)
  const { data: balances } = useAllTokenBalances()

  const tokenBalance = balances?.find((b: { mint: string }) => b.mint === mintAddress)

  return {
    metadata,
    price,
    balance: tokenBalance?.balance || 0,
    decimals: tokenBalance?.decimals || 0,
    isLoading: !metadata || !balances,
  }
} 