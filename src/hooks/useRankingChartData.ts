'use client'

import { useMemo } from 'react'
import { useCampaignsSuspense } from '@/hooks/useCampaigns'
import { useDailyStatsSuspense } from '@/hooks/useDailyStats'
import { useFilterParams } from '@/hooks/useFilterParams'
import { calcCTR, calcCPC, calcROAS } from '@/lib/metrics'
import { RANKING_ASCENDING, type RankingMetric } from '@/constants'
import type { Platform } from '@/types'

export interface RankingEntry {
  campaignId: string
  name: string
  platform: Platform
  value: number
}

export function useRankingChartData(activeMetric: RankingMetric): RankingEntry[] {
  const { data: campaigns } = useCampaignsSuspense()
  const { data: dailyStats } = useDailyStatsSuspense()
  const { dateRange, platforms, statuses } = useFilterParams()

  return useMemo(() => {
    const filtered = campaigns.filter((c) => {
      const platformMatch = platforms.length === 0 || platforms.includes(c.platform)
      const statusMatch = statuses.length === 0 || statuses.includes(c.status)
      return platformMatch && statusMatch
    })

    const statsMap = new Map<
      string,
      {
        totalImpressions: number
        totalClicks: number
        totalCost: number
        totalConversionsValue: number | null
      }
    >()

    for (const stat of dailyStats) {
      if (stat.date < dateRange.start || stat.date > dateRange.end) continue
      const existing = statsMap.get(stat.campaignId)
      if (existing) {
        existing.totalImpressions += stat.impressions
        existing.totalClicks += stat.clicks
        existing.totalCost += stat.cost
        if (stat.conversionsValue !== null) {
          existing.totalConversionsValue =
            (existing.totalConversionsValue ?? 0) + stat.conversionsValue
        }
      } else {
        statsMap.set(stat.campaignId, {
          totalImpressions: stat.impressions,
          totalClicks: stat.clicks,
          totalCost: stat.cost,
          totalConversionsValue: stat.conversionsValue,
        })
      }
    }

    const entries: RankingEntry[] = []

    for (const c of filtered) {
      const agg = statsMap.get(c.id)
      if (!agg) continue

      let value: number | null = null
      if (activeMetric === 'roas') value = calcROAS(agg.totalConversionsValue, agg.totalCost)
      else if (activeMetric === 'ctr') value = calcCTR(agg.totalImpressions, agg.totalClicks)
      else if (activeMetric === 'cpc') value = calcCPC(agg.totalCost, agg.totalClicks)

      if (value === null) continue
      entries.push({ campaignId: c.id, name: c.name, platform: c.platform, value })
    }

    const isAscending = RANKING_ASCENDING.includes(activeMetric)
    return entries.sort((a, b) => (isAscending ? a.value - b.value : b.value - a.value)).slice(0, 3)
  }, [campaigns, dailyStats, dateRange, platforms, statuses, activeMetric])
}
