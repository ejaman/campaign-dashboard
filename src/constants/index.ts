import type { Platform, Status } from '@/types'

// API
// 플랫폼 색상
export const PLATFORM_COLORS: Record<string, string> = {
  Google: '#4285F4',
  Meta: '#E91E8C',
  Naver: '#03C75A',
}

// 필터 옵션
export const PLATFORMS: Platform[] = ['Google', 'Meta', 'Naver']

export const STATUSES: Status[] = ['active', 'paused', 'ended']

export const STATUS_LABEL: Record<Status, string> = {
  active: '진행중',
  paused: '일시중지',
  ended: '종료',
}

// 테이블
export const PAGE_SIZE = 10

// 차트 메트릭 — 단일 배열에서 타입·레이블·색상을 모두 관리
// 새 지표 추가 시 이 배열에만 항목을 추가하면 됨
export const CHART_METRICS = [
  { key: 'impressions', label: '노출수', color: '#0081cf' },
  { key: 'clicks', label: '클릭수', color: '#008f7a' },
  { key: 'cost', label: '비용', color: '#776cc9' },
  { key: 'conversions', label: '전환수', color: '#897456' },
] as const

export type ChartMetric = (typeof CHART_METRICS)[number]['key']

// 랭킹 차트 메트릭
export const RANKING_METRICS = [
  { key: 'ctr', label: 'CTR' },
  { key: 'cpc', label: 'CPC' },
  { key: 'roas', label: 'ROAS' },
] as const

export type RankingMetric = (typeof RANKING_METRICS)[number]['key']

// CPC는 낮을수록 좋음 (오름차순 정렬)
export const RANKING_ASCENDING: RankingMetric[] = ['cpc']
