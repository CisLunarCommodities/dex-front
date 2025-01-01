'use client'

import { PublicKey } from '@solana/web3.js'
import { useGetSignatures } from './account-data-access'
import { useState, useMemo } from 'react'
import { IconRefresh } from '@tabler/icons-react'

export function AccountTransactions({ address }: { address: PublicKey }) {
  const [showAll, setShowAll] = useState(false)
  const query = useGetSignatures({ address })
  const items = useMemo(() => {
    if (showAll) return query.data
    return query.data?.slice(0, 5)
  }, [query.data, showAll])

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Transaction History</h2>
        <div className="space-x-2">
          {query.isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <button className="btn btn-sm btn-outline" onClick={() => query.refetch()}>
              <IconRefresh size={16} />
            </button>
          )}
        </div>
      </div>
      {query.isError && <pre className="alert alert-error">Error: {query.error?.message.toString()}</pre>}
      {query.isSuccess && (
        <div>
          {query.data.length === 0 ? (
            <div>No transactions found.</div>
          ) : (
            <table className="table border-4 rounded-lg border-separate border-base-300">
              <thead>
                <tr>
                  <th>Signature</th>
                  <th>Block Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item) => (
                  <tr key={item.signature}>
                    <td className="font-mono">{item.signature.slice(0, 8)}...</td>
                    <td>{new Date(item.blockTime! * 1000).toLocaleString()}</td>
                    <td>{item.confirmationStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
} 