// Primitives

export type Platform = 'Google' | 'Meta' | 'Naver'
export type Status = 'active' | 'paused' | 'ended' // active: 진행중, paused: 일시중지, ended: 종료

// Raw API 타입 — db.json 응답 그대로 (정규화 전)

export interface RawCampaign {
  id: string // 고유 식별자
  name: string | null // 캠페인 명칭
  platform: string // 광고 매체 - 정규화 후 → Platform
  status: string // 상태 - 정규화 후 → Status
  budget: number | string | null // 총 예산 - 문자열("2000000원")·null 혼재 → 정규화 후 number
  startDate: string | null // 시작일 - 슬래시 포맷("2026/04/12") 혼재 → 정규화 후 YYYY-MM-DD
  endDate: string | null // 종료일
}

export interface RawDailyStat {
  id: string // 고유 식별자
  campaignId: string // 연결된 Campaign.id
  date: string // 성과 발생 날짜 (YYYY-MM-DD)
  impressions: number | null // 노출수 — 광고가 표시된 횟수
  clicks: number | null // 클릭수 — 광고를 클릭한 횟수
  conversions: number | null // 전환수 — 클릭 후 구매·가입 등 목표 행동 횟수
  cost: number | null // 집행 비용
  conversionsValue: number | null // 전환 가치 (매출액/원)
}

// 정규화된 타입 — Raw 타입 기반으로 변환된 필드만 오버라이드
// Raw에 필드를 추가하면 정규화 타입에도 자동 상속됨

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

// 파생 지표 — metrics.ts 계산 결과
// 분모가 0이면 null 반환, UI에서 "-" 표시

export interface CampaignMetrics {
  ctr: number | null // CTR = (clicks / impressions) * 100, 단위: %
  cpc: number | null // CPC = cost / clicks, 단위: 원
  roas: number | null // ROAS = (conversionsValue / cost) * 100, 단위: %
}

// 캠페인 + 필터 기간 내 집계 stats + 파생 지표를 합친 테이블 행 타입
export interface CampaignRow extends Campaign, CampaignMetrics {
  totalCost: number // 기간 내 총 집행 금액
  totalImpressions: number // 기간 내 총 노출수
  totalClicks: number // 기간 내 총 클릭수
  totalConversions: number // 기간 내 총 전환수
  totalConversionsValue: number // 기간 내 총 전환 매출
}

// 필터 — filterStore.ts

export interface DateRange {
  start: string // YYYY-MM-DD
  end: string // YYYY-MM-DD
}

export interface FilterState {
  dateRange: DateRange
  platforms: Platform[] // 빈 배열 = 전체 선택
  statuses: Status[] // 빈 배열 = 전체 선택
}
