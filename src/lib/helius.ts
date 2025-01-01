import { PublicKey } from '@solana/web3.js'
import { Connection } from '@solana/web3.js'
import { getMint, TOKEN_PROGRAM_ID } from '@solana/spl-token'

const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`
const TOKEN_2022_PROGRAM_ID = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb')

interface AssetResponse {
  interface: string
  id: string
  content: {
    metadata: {
      name: string
      symbol: string
    }
  }
  token_info?: {
    supply: number
    decimals: number
    balance?: string
  }
}

export async function getTokenMetadata(mintAddresses: string[]) {
  const responses = await Promise.all(
    mintAddresses.map(async (id) => {
      const response = await fetch(HELIUS_RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'my-id',
          method: 'getAsset',
          params: {
            id,
            displayOptions: {
              showFungible: true
            }
          },
        }),
      })

      if (!response.ok) {
        console.error('Helius API Error:', await response.text())
        throw new Error(`Failed to fetch token metadata: ${response.statusText}`)
      }

      const { result } = await response.json()
      return result
    })
  )

  return responses
}

export async function getBalancesByOwner(ownerAddress: string) {
  // First, let's log the owner address we're querying
  console.log('Querying balances for address:', ownerAddress)

  const response = await fetch(HELIUS_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'searchAssets',
      params: [{
        ownerAddress,
        page: 1,
        limit: 1000,
        displayOptions: {
          showFungible: true,
          showZeroBalance: false
        }
      }],
    }),
  })

  if (!response.ok) {
    console.error('Helius API Error:', await response.text())
    throw new Error(`Failed to fetch balances: ${response.statusText}`)
  }

  const { result } = await response.json()
  
  // Debug the full response
  console.log('Full Helius API Response:', result)

  // If no assets found, return empty array
  if (!result || !result.items) {
    console.log('No items found in response')
    return []
  }

  // Filter and transform the response
  const balances = result.items
    .filter((asset: any) => {
      // Log each asset for debugging
      console.log('Processing asset:', asset)
      return asset.token_info && Number(asset.token_info.balance) > 0
    })
    .map((asset: any) => ({
      mint: asset.id,
      amount: asset.token_info.balance,
      decimals: asset.token_info.decimals || 0,
      tokenAccount: asset.ownership?.owner || '',
      symbol: asset.content?.metadata?.symbol || 'Unknown'
    }))

  // Log the final processed balances
  console.log('Processed balances:', balances)

  return balances
}

export async function getTokenPrice(mintAddress: string) {
  const response = await fetch(HELIUS_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAsset',
      params: {
        id: mintAddress,
        displayOptions: {
          showFungible: true
        }
      },
    }),
  })

  if (!response.ok) {
    console.error('Helius API Error:', await response.text())
    throw new Error(`Failed to fetch token price: ${response.statusText}`)
  }

  const { result } = await response.json()
  return result.token_info?.price ?? null
}

export async function fetchTokenSupply(mintAddress: string): Promise<number> {
  const connection = new Connection(HELIUS_RPC_URL)
  const mintPublicKey = new PublicKey(mintAddress)
  const mintInfo = await getMint(connection, mintPublicKey, undefined, TOKEN_2022_PROGRAM_ID)
  return Number(mintInfo.supply) / Math.pow(10, mintInfo.decimals)
}