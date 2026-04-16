import type { Campaign, DailyStat, Platform, RawCampaign, RawDailyStat, Status } from '@/types'

// 필드별 정규화 헬퍼
function normalizePlatform(platform: string): Platform {
  const map: Record<string, Platform> = {
    google: 'Google',
    facebook: 'Meta',
    meta: 'Meta',
    naver: 'Naver',
    네이버: 'Naver',
  }
  return map[platform.toLowerCase()] ?? 'Google'
}

function normalizeStatus(status: string): Status {
  const map: Record<string, Status> = {
    active: 'active',
    running: 'active',
    paused: 'paused',
    ended: 'ended',
    stopped: 'ended',
  }
  return map[status.toLowerCase()] ?? 'ended'
}

function normalizeBudget(budget: number | string | null): number {
  if (budget === null) return 0
  if (typeof budget === 'number') return budget
  // "2000000원" 같은 문자열 → 숫자 파싱
  const parsed = parseInt(budget.replace(/[^0-9]/g, ''), 10)
  return isNaN(parsed) ? 0 : parsed
}

function normalizeDate(date: string | null): string {
  if (!date) return ''
  // "2026/04/12" → "2026-04-12"
  return date.replace(/\//g, '-')
}

function normalizeNumber(value: number | null): number {
  return value ?? 0
}

// 엔티티 정규화
export function normalizeCampaign(raw: RawCampaign): Campaign {
  return {
    ...raw,
    name: raw.name ?? '(이름 없음)',
    platform: normalizePlatform(raw.platform),
    status: normalizeStatus(raw.status),
    budget: normalizeBudget(raw.budget),
    startDate: normalizeDate(raw.startDate),
  }
}

export function normalizeCampaigns(raws: RawCampaign[]): Campaign[] {
  return raws.map(normalizeCampaign)
}

export function normalizeDailyStat(raw: RawDailyStat): DailyStat {
  return {
    ...raw,
    impressions: normalizeNumber(raw.impressions),
    clicks: normalizeNumber(raw.clicks),
    conversions: normalizeNumber(raw.conversions),
    cost: normalizeNumber(raw.cost),
    // conversionsValue는 null 유지 (파생 지표 계산 시 처리)
  }
}

// 중복 제거: 동일 campaignId + date 기준 첫 번째만 사용
export function normalizeDailyStats(raws: RawDailyStat[]): DailyStat[] {
  const seen = new Set<string>()

  return raws.reduce<DailyStat[]>((acc, raw) => {
    const key = `${raw.campaignId}_${raw.date}`
    if (seen.has(key)) return acc
    seen.add(key)
    acc.push(normalizeDailyStat(raw))
    return acc
  }, [])
}
