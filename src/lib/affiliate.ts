import { atom, useAtom } from 'jotai'

interface AffiliateData {
  code: string
  referrer: string
  commission: number
  shares: {
    [resource: string]: number
  }
}

const affiliateAtom = atom<AffiliateData | null>(null)

export function useAffiliate() {
  const [affiliate, setAffiliate] = useAtom(affiliateAtom)

  const createAffiliateLink = (resource: string) => {
    if (!affiliate) return null
    const baseUrl = window.location.origin
    return `${baseUrl}/market?ref=${affiliate.code}&resource=${resource}`
  }

  const trackShare = (resource: string) => {
    if (!affiliate) return
    setAffiliate(prev => ({
      ...prev!,
      shares: {
        ...prev!.shares,
        [resource]: (prev!.shares[resource] || 0) + 1
      }
    }))
  }

  return {
    affiliate,
    setAffiliate,
    createAffiliateLink,
    trackShare
  }
} 