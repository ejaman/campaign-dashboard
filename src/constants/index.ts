import type { ChartMetric, Platform, Status } from '@/types'

// API
export const API_BASE_URL = 'http://localhost:3001'

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

// 차트 메트릭
export const METRIC_LABELS: Record<ChartMetric, string> = {
  impressions: '노출수',
  clicks: '클릭수',
  cost: '비용',
  conversions: '전환수',
}

export const METRIC_COLORS: Record<ChartMetric, string> = {
  impressions: '#0081cf',
  clicks: '#008f7a',
  cost: '#776cc9',
  conversions: '#897456',
}
