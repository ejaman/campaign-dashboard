import { normalizeCampaigns, normalizeDailyStats } from '@/lib/normalize'
import type { Campaign, DailyStat, RawCampaign, RawDailyStat } from '@/types'

function getBaseUrl(): string {
  if (typeof window !== 'undefined') return ''
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

async function fetcher<T>(url: string, errorMessage: string): Promise<T> {
  const res = await fetch(`${getBaseUrl()}${url}`)
  if (!res.ok) throw new Error(errorMessage)
  return res.json() as Promise<T>
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  const data = await fetcher<RawCampaign[]>(
    '/api/campaigns',
    '캠페인 데이터를 불러오지 못했습니다.'
  )
  return normalizeCampaigns(data)
}

export async function fetchDailyStats(): Promise<DailyStat[]> {
  const data = await fetcher<RawDailyStat[]>(
    '/api/daily_stats',
    '일별 통계 데이터를 불러오지 못했습니다.'
  )
  return normalizeDailyStats(data)
}
