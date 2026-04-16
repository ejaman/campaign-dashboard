import type { Platform, Status } from '@/types'

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
