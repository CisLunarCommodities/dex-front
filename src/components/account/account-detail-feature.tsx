'use client'

import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import { PublicKey } from '@solana/web3.js'
import { AccountBalance } from './account-ui'
import { AccountTokens } from './account-tokens'
import { AccountTransactions } from './account-transactions'

export default function AccountDetailFeature() {
  const params = useParams()
  const address = useMemo(() => {
    if (!params?.address) {
      return undefined
    }
    try {
      return new PublicKey(params.address as string)
    } catch (e) {
      return undefined
    }
  }, [params])

  if (!address) {
    return <div>Invalid address</div>
  }

  return (
    <div className="space-y-8">
      <AccountBalance address={address} />
      <AccountTokens address={address} />
      <AccountTransactions address={address} />
    </div>
  )
}
