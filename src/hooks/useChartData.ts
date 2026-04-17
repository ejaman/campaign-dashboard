'use client'

import { useMemo } from 'react'
import { useCampaignsSuspense } from '@/hooks/useCampaigns'
import { useDailyStatsSuspense } from '@/hooks/useDailyStats'
import { useFilterStore } from '@/store/filter-store'

export interface DailyChartData {
  date: string // YYYY-MM-DD
  impressions: number
  clicks: number
  cost: number
  conversions: number
}

// Suspense 기반 훅 — 로딩/에러는 Suspense + ErrorBoundary가 처리
export function useChartData(): DailyChartData[] {
  const { data: campaigns } = useCampaignsSuspense()
  const { data: dailyStats } = useDailyStatsSuspense()

  const dateRange = useFilterStore((s) => s.dateRange)
  const platforms = useFilterStore((s) => s.platforms)
  const statuses = useFilterStore((s) => s.statuses)

  return useMemo<DailyChartData[]>(() => {
    // 필터 조건에 맞는 campaignId 집합
    const filteredCampaignIds = new Set(
      campaigns
        .filter((c) => {
          const platformMatch = platforms.length === 0 || platforms.includes(c.platform)
          const statusMatch = statuses.length === 0 || statuses.includes(c.status)
          return platformMatch && statusMatch
        })
        .map((c) => c.id)
    )

    // 날짜 범위 + 캠페인 필터 적용 후 날짜별 집계
    const aggregated = new Map<string, Omit<DailyChartData, 'date'>>()

    for (const stat of dailyStats) {
      if (!filteredCampaignIds.has(stat.campaignId)) continue
      if (stat.date < dateRange.start || stat.date > dateRange.end) continue

      const existing = aggregated.get(stat.date)
      if (existing) {
        existing.impressions += stat.impressions
        existing.clicks += stat.clicks
        existing.cost += stat.cost
        existing.conversions += stat.conversions
      } else {
        aggregated.set(stat.date, {
          impressions: stat.impressions,
          clicks: stat.clicks,
          cost: stat.cost,
          conversions: stat.conversions,
        })
      }
    }

    // 날짜 오름차순 정렬
    return Array.from(aggregated.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, values]) => ({ date, ...values }))
  }, [campaigns, dailyStats, dateRange, platforms, statuses])
}
