'use client'

import { ReactNode } from 'react'
import { AppModal } from './ui-layout'

interface Token {
  symbol: string
  name: string
  icon: ReactNode
}

interface TokenSelectProps {
  show: boolean
  hide: () => void
  tokens: Token[]
  onSelect: (token: Token) => void
  title?: string
}

export function TokenSelect({ show, hide, tokens, onSelect, title = 'Select Token' }: TokenSelectProps) {
  return (
    <AppModal title={title} show={show} hide={hide}>
      <div className="space-y-2">
        {tokens.map((token) => (
          <button
            key={token.symbol}
            className="w-full p-3 flex items-center space-x-3 hover:bg-base-300 rounded-lg transition-colors"
            onClick={() => {
              onSelect(token)
              hide()
            }}
          >
            <span className="text-2xl">{token.icon}</span>
            <div className="flex flex-col items-start">
              <span className="font-semibold">{token.symbol}</span>
              <span className="text-sm text-gray-400">{token.name}</span>
            </div>
          </button>
        ))}
      </div>
    </AppModal>
  )
} 