'use client'

import { useEffect, useState } from 'react'
import { useAffiliate } from '@/lib/affiliate'
import { IconCopy, IconShare2 } from '@tabler/icons-react'
import toast from 'react-hot-toast'

export default function AffiliatePage() {
  const { affiliate, setAffiliate } = useAffiliate()
  const [loading, setLoading] = useState(!affiliate)

  useEffect(() => {
    if (!affiliate) {
      fetch('/api/affiliate', {
        method: 'POST',
        body: JSON.stringify({
          referrer: window.location.origin
        })
      })
        .then(res => res.json())
        .then(data => {
          setAffiliate(data)
          setLoading(false)
        })
    }
  }, [affiliate, setAffiliate])

  const copyAffiliateLink = async () => {
    const baseUrl = window.location.origin
    const link = `${baseUrl}/market?ref=${affiliate?.code}`
    await navigator.clipboard.writeText(link)
    toast.success('Affiliate link copied!')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Affiliate Dashboard</h1>
      
      {/* Affiliate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat bg-base-200 rounded-lg p-6">
          <div className="stat-title">Total Shares</div>
          <div className="stat-value">
            {affiliate?.shares ? Object.values(affiliate.shares).reduce((a, b) => a + b, 0) : 0}
          </div>
          <div className="stat-desc">Resource shares</div>
        </div>
        <div className="stat bg-base-200 rounded-lg p-6">
          <div className="stat-title">Commission Rate</div>
          <div className="stat-value">{(affiliate?.commission || 0) * 100}%</div>
          <div className="stat-desc">Per successful referral</div>
        </div>
        <div className="stat bg-base-200 rounded-lg p-6">
          <div className="stat-title">Potential Earnings</div>
          <div className="stat-value">$0.00</div>
          <div className="stat-desc">Updates after trades</div>
        </div>
      </div>

      {/* Affiliate Link */}
      <div className="bg-base-200 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Affiliate Link</h2>
        <div className="flex gap-4 items-center">
          <code className="flex-1 p-4 bg-base-300 rounded-lg">
            {window.location.origin}/market?ref={affiliate?.code}
          </code>
          <button 
            onClick={copyAffiliateLink}
            className="btn btn-primary gap-2"
          >
            <IconCopy size={16} />
            Copy
          </button>
          <button 
            onClick={() => {
              navigator.share({
                title: 'Join Cislunar Exchange',
                text: 'Check out this space mining marketplace!',
                url: `${window.location.origin}/market?ref=${affiliate?.code}`
              })
            }}
            className="btn btn-primary gap-2"
          >
            <IconShare2 size={16} />
            Share
          </button>
        </div>
      </div>

      {/* Resource Shares */}
      <div className="bg-base-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Resource Shares</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Resource</th>
                <th>Shares</th>
                <th>Potential Commission</th>
              </tr>
            </thead>
            <tbody>
              {affiliate?.shares && Object.entries(affiliate.shares).map(([resource, shares]) => (
                <tr key={resource}>
                  <td>{resource}</td>
                  <td>{shares}</td>
                  <td>$0.00</td>
                </tr>
              ))}
              {(!affiliate?.shares || Object.keys(affiliate.shares).length === 0) && (
                <tr>
                  <td colSpan={3} className="text-center">No shares yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 