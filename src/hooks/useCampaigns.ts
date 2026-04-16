import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { fetchCampaigns } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'

export const campaignQueries = {
  all: () => ({
    queryKey: queryKeys.campaigns.all,
    queryFn: fetchCampaigns,
  }),
} as const

export const useCampaigns = () => useQuery(campaignQueries.all())

export const useCampaignsSuspense = () => useSuspenseQuery(campaignQueries.all())
