import type { CampaignMetrics, DailyStat } from '@/types'

// 파생 지표 계산 — 분모가 0이면 null 반환, UI에서 "-" 표시

// CTR = (총 클릭 수 / 총 노출 수) * 100, 단위: %
export function calcCTR(impressions: number, clicks: number): number | null {
  if (impressions === 0) return null
  return (clicks / impressions) * 100
}

// CPC = 총 집행 비용 / 총 클릭 수, 단위: 원
export function calcCPC(cost: number, clicks: number): number | null {
  if (clicks === 0) return null
  return cost / clicks
}

// ROAS = (총 전환 가치 / 총 집행 비용) * 100, 단위: %
export function calcROAS(conversionsValue: number | null, cost: number): number | null {
  if (cost === 0 || conversionsValue === null) return null
  return (conversionsValue / cost) * 100
}

// DailyStat 배열 집계 후 파생 지표 반환
export function calcMetrics(stats: DailyStat[]): CampaignMetrics {
  const totalImpressions = stats.reduce((sum, s) => sum + s.impressions, 0)
  const totalClicks = stats.reduce((sum, s) => sum + s.clicks, 0)
  const totalCost = stats.reduce((sum, s) => sum + s.cost, 0)
  const totalConversionsValue = stats.reduce<number | null>((sum, s) => {
    if (s.conversionsValue === null) return sum
    return (sum ?? 0) + s.conversionsValue
  }, null)

  return {
    ctr: calcCTR(totalImpressions, totalClicks),
    cpc: calcCPC(totalCost, totalClicks),
    roas: calcROAS(totalConversionsValue, totalCost),
  }
}
