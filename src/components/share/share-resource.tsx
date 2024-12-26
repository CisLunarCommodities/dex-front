'use client'

import { useAffiliate } from '@/lib/affiliate'
import { SpaceResource } from '@/lib/asterank'
import { IconShare, IconCopy } from '@tabler/icons-react'
import toast from 'react-hot-toast'

export function ShareResource({ resource }: { resource: SpaceResource }) {
  const { createAffiliateLink, trackShare } = useAffiliate()

  const handleShare = async () => {
    const affiliateLink = createAffiliateLink(resource.symbol)
    if (!affiliateLink) {
      toast.error('Please connect wallet to share')
      return
    }

    try {
      await navigator.share({
        title: `Check out ${resource.name} on Cislunar Exchange`,
        text: `I found this amazing space mining opportunity: ${resource.name}`,
        url: affiliateLink
      })
      trackShare(resource.symbol)
      toast.success('Resource shared successfully!')
    } catch (error) {
      await navigator.clipboard.writeText(affiliateLink)
      toast.success('Affiliate link copied to clipboard!')
    }
  }

  return (
    <button 
      onClick={handleShare}
      className="btn btn-ghost btn-sm gap-2"
    >
      <IconShare size={16} />
      Share
    </button>
  )
} 