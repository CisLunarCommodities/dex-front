'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import '@solana/wallet-adapter-react-ui/styles.css'

export function WalletButton() {
  const { publicKey } = useWallet()

  return (
    <WalletMultiButton 
      className="!bg-purple-600 hover:!bg-purple-700 transition-colors"
    />
  )
} 