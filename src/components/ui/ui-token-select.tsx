'use client'

import { ReactNode } from 'react'
import { AppModal } from './ui-layout'

interface Token {
  symbol: string
  name: string
  icon: ReactNode
  price?: number
  supply?: number
  address: string
}

interface TokenSelectProps {
  show: boolean
  hide: () => void
  tokens: Token[]
  onSelect: (token: Token) => void
  title: string
}

// Define our space tokens
const spaceTokens: Token[] = [
  {
    symbol: 'LOX',
    name: 'Liquid Oxygen',
    icon: '🌬️',
    price: 0,
    supply: 0,
    address: 'G9d1PgcUULzaoRKpWkJEjJEs5way8YNu8zaaVuBkn86V'
  },
  {
    symbol: 'H3',
    name: 'Helium-3',
    icon: '⚛️',
    price: 0,
    supply: 0,
    address: 'FXCSq5MRYdB8DRR7fEBKMoufgdALUP9egb9wDbUxAEnj'
  },
]

export function TokenSelect({ show, hide, onSelect, title }: TokenSelectProps) {
  return (
    <AppModal title={title} show={show} hide={hide}>
      <div className="space-y-2">
        {spaceTokens.map((token) => (
          <button
            key={token.address}
            className="w-full flex items-center justify-between p-4 hover:bg-base-200 rounded-lg transition-colors"
            onClick={() => {
              onSelect(token)
              hide()
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{token.icon}</span>
              <div>
                <div>{token.symbol}</div>
                <span className="text-sm text-gray-400">{token.name}</span>
              </div>
            </div>
            <div className="ml-auto text-right">
              {token.price !== undefined && (
                <div>${token.price.toFixed(2)}</div>
              )}
              {token.supply !== undefined && (
                <div className="text-sm text-gray-400">
                  Supply: {token.supply.toLocaleString()}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </AppModal>
  )
} 