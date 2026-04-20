'use client'

import { useMemo } from 'react'
import { useCampaignsSuspense } from '@/hooks/useCampaigns'
import { useDailyStatsSuspense } from '@/hooks/useDailyStats'
import { useFilterParams } from '@/hooks/useFilterParams'
import { PLATFORMS, PLATFORM_COLORS } from '@/constants'
import type { ChartMetric } from '@/constants'
import type { Platform } from '@/types'

export interface PlatformChartData {
  platform: Platform
  value: number
  percentage: number
  color: string
}

// 플랫폼 필터는 적용하지 않음 — 도넛 차트가 플랫폼 필터를 직접 제어하기 때문
export function usePlatformChartData(activeMetric: ChartMetric): PlatformChartData[] {
  const { data: campaigns } = useCampaignsSuspense()
  const { data: dailyStats } = useDailyStatsSuspense()
  const { dateRange, statuses } = useFilterParams()

  return useMemo(() => {
    const campaignPlatform = new Map<string, Platform>()
    campaigns.forEach((c) => {
      if (statuses.length === 0 || statuses.includes(c.status)) {
        campaignPlatform.set(c.id, c.platform)
      }
    })

    const totals = new Map<Platform, number>(PLATFORMS.map((p) => [p, 0]))

    for (const stat of dailyStats) {
      const platform = campaignPlatform.get(stat.campaignId)
      if (!platform) continue
      if (stat.date < dateRange.start || stat.date > dateRange.end) continue
      totals.set(platform, (totals.get(platform) ?? 0) + stat[activeMetric])
    }

    const total = Array.from(totals.values()).reduce((sum, v) => sum + v, 0)

    return PLATFORMS.map((platform) => {
      const value = totals.get(platform) ?? 0
      return {
        platform,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
        color: PLATFORM_COLORS[platform],
      }
    })
  }, [campaigns, dailyStats, dateRange.start, dateRange.end, statuses, activeMetric])
}
