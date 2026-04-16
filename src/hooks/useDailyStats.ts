import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { fetchDailyStats } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'

export const dailyStatQueries = {
  all: () => ({
    queryKey: queryKeys.dailyStats.all,
    queryFn: fetchDailyStats,
  }),
} as const

export const useDailyStats = () => useQuery(dailyStatQueries.all())

export const useDailyStatsSuspense = () => useSuspenseQuery(dailyStatQueries.all())
