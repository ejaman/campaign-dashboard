// ============================================================
// Primitives
// ============================================================

export type Platform = 'Google' | 'Meta' | 'Naver'
export type Status = 'active' | 'paused' | 'ended'

// ============================================================
// Raw API 타입 — db.json 응답 그대로 (정규화 전)
// ============================================================

export interface RawCampaign {
  id: string
  name: string | null
  status: string // 정규화 후 → Status
  platform: string // 정규화 후 → Platform
  budget: number | string | null // 정규화 후 → number
  startDate: string | null // 정규화 후 → string
  endDate: string | null
}

export interface RawDailyStat {
  id: string
  campaignId: string
  date: string
  impressions: number | null // 정규화 후 → number
  clicks: number | null // 정규화 후 → number
  conversions: number | null // 정규화 후 → number
  cost: number | null // 정규화 후 → number
  conversionsValue: number | null
}

// ============================================================
// 정규화된 타입 — Raw 타입 기반으로 변환된 필드만 오버라이드
// Raw에 필드를 추가하면 정규화 타입에도 자동 상속됨
// ============================================================

// 정규화로 타입이 바뀌는 필드만 Omit 후 재정의
export type Campaign = Omit<
  RawCampaign,
  'name' | 'platform' | 'status' | 'budget' | 'startDate'
> & {
  name: string
  platform: Platform
  status: Status
  budget: number
  startDate: string // YYYY-MM-DD
}

// null → 0으로 정규화되는 필드만 Omit 후 재정의 (conversionsValue는 null 유지)
export type DailyStat = Omit<RawDailyStat, 'impressions' | 'clicks' | 'conversions' | 'cost'> & {
  impressions: number
  clicks: number
  conversions: number
  cost: number
}

// ============================================================
// 파생 지표 — metrics.ts 계산 결과
// ============================================================

export interface CampaignMetrics {
  ctr: number | null // (clicks / impressions) * 100, 단위: %
  cpc: number | null // cost / clicks, 단위: 원
  roas: number | null // (conversionsValue / cost) * 100, 단위: %
}

// 캠페인 + 집계 stats + 파생 지표를 합친 테이블 행 타입
export interface CampaignRow extends Campaign, CampaignMetrics {
  totalCost: number
  totalImpressions: number
  totalClicks: number
  totalConversions: number
  totalConversionsValue: number
}

// ============================================================
// 필터 — filterStore.ts
// ============================================================

export interface DateRange {
  start: string // YYYY-MM-DD
  end: string // YYYY-MM-DD
}

export interface FilterState {
  dateRange: DateRange
  platforms: Platform[] // 빈 배열 = 전체
  statuses: Status[] // 빈 배열 = 전체
}
