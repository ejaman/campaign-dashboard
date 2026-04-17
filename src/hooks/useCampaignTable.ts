'use client'

import { useMemo } from 'react'
import { useCampaignsSuspense } from '@/hooks/useCampaigns'
import { useDailyStatsSuspense } from '@/hooks/useDailyStats'
import { useFilterStore } from '@/store/filter-store'
import { calcCTR, calcCPC, calcROAS } from '@/lib/metrics'
import { PAGE_SIZE } from '@/constants'
import type { CampaignRow } from '@/types'

export type SortColumn = 'startDate' | 'totalCost' | 'ctr' | 'cpc' | 'roas'
export type SortDirection = 'asc' | 'desc'

export interface SortState {
  column: SortColumn
  direction: SortDirection
}

interface UseCampaignTableOptions {
  searchQuery: string
  sort: SortState | null
  page: number
}

export interface UseCampaignTableResult {
  rows: CampaignRow[]
  totalCount: number // 글로벌 필터 후 전체 캠페인 수 (검색 전)
  filteredCount: number // 검색 후 건수
  pageCount: number
}

type AggStats = {
  totalImpressions: number
  totalClicks: number
  totalCost: number
  totalConversions: number
  totalConversionsValue: number | null
}

export function useCampaignTable({
  searchQuery,
  sort,
  page,
}: UseCampaignTableOptions): UseCampaignTableResult {
  const { data: campaigns } = useCampaignsSuspense()
  const { data: dailyStats } = useDailyStatsSuspense()
  const dateRange = useFilterStore((s) => s.dateRange)
  const platforms = useFilterStore((s) => s.platforms)
  const statuses = useFilterStore((s) => s.statuses)

  return useMemo(() => {
    // 1. 글로벌 필터 (플랫폼, 상태) 적용
    const filteredCampaigns = campaigns.filter((c) => {
      const platformMatch = platforms.length === 0 || platforms.includes(c.platform)
      const statusMatch = statuses.length === 0 || statuses.includes(c.status)
      return platformMatch && statusMatch
    })
    const totalCount = filteredCampaigns.length

    // 2. 날짜 범위 내 stats 캠페인별 집계
    const statsMap = new Map<string, AggStats>()

    for (const stat of dailyStats) {
      if (stat.date < dateRange.start || stat.date > dateRange.end) continue

      const existing = statsMap.get(stat.campaignId)
      if (existing) {
        existing.totalImpressions += stat.impressions
        existing.totalClicks += stat.clicks
        existing.totalCost += stat.cost
        existing.totalConversions += stat.conversions
        if (stat.conversionsValue !== null) {
          existing.totalConversionsValue =
            (existing.totalConversionsValue ?? 0) + stat.conversionsValue
        }
      } else {
        statsMap.set(stat.campaignId, {
          totalImpressions: stat.impressions,
          totalClicks: stat.clicks,
          totalCost: stat.cost,
          totalConversions: stat.conversions,
          totalConversionsValue: stat.conversionsValue,
        })
      }
    }

    // 3. CampaignRow 생성
    const allRows: CampaignRow[] = filteredCampaigns.map((c) => {
      const agg = statsMap.get(c.id) ?? {
        totalImpressions: 0,
        totalClicks: 0,
        totalCost: 0,
        totalConversions: 0,
        totalConversionsValue: null,
      }

      return {
        ...c,
        totalImpressions: agg.totalImpressions,
        totalClicks: agg.totalClicks,
        totalCost: agg.totalCost,
        totalConversions: agg.totalConversions,
        totalConversionsValue: agg.totalConversionsValue ?? 0,
        ctr: calcCTR(agg.totalImpressions, agg.totalClicks),
        cpc: calcCPC(agg.totalCost, agg.totalClicks),
        roas: calcROAS(agg.totalConversionsValue, agg.totalCost),
      }
    })

    // 4. 검색 필터링
    const trimmed = searchQuery.trim().toLowerCase()
    const searched = trimmed
      ? allRows.filter((row) => row.name.toLowerCase().includes(trimmed))
      : allRows
    const filteredCount = searched.length

    // 5. 정렬 (null은 항상 마지막)
    const sorted = sort
      ? [...searched].sort((a, b) => {
          const dir = sort.direction === 'asc' ? 1 : -1
          const col = sort.column

          const aVal: string | number | null = col === 'startDate' ? a.startDate : a[col]
          const bVal: string | number | null = col === 'startDate' ? b.startDate : b[col]

          if (aVal === null && bVal === null) return 0
          if (aVal === null) return 1
          if (bVal === null) return -1
          if (aVal < bVal) return -1 * dir
          if (aVal > bVal) return 1 * dir
          return 0
        })
      : searched

    // 6. 페이지네이션
    const pageCount = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE))
    const clampedPage = Math.min(Math.max(1, page), pageCount)
    const start = (clampedPage - 1) * PAGE_SIZE
    const rows = sorted.slice(start, start + PAGE_SIZE)

    return { rows, totalCount, filteredCount, pageCount }
  }, [campaigns, dailyStats, dateRange, platforms, statuses, searchQuery, sort, page])
}
