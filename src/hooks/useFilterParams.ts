import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import type { DateRange, Platform, Status } from '@/types'
import { PLATFORMS, STATUSES } from '@/constants'

function getDefaultDateRange(): DateRange {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const lastDay = new Date(year, month + 1, 0).getDate()
  const pad = (n: number) => String(n).padStart(2, '0')

  return {
    start: `${year}-${pad(month + 1)}-01`,
    end: `${year}-${pad(month + 1)}-${pad(lastDay)}`,
  }
}

const DEFAULT_DATE = getDefaultDateRange()

export const useFilterParams = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // 2. Parsing: URL -> State
  const filters = useMemo(() => {
    const s = searchParams.get('start') || DEFAULT_DATE.start
    const e = searchParams.get('end') || DEFAULT_DATE.end
    const p = searchParams.get('platforms')
    const st = searchParams.get('statuses')

    return {
      dateRange: { start: s, end: e },
      // URL에 없으면 '전체 선택' 상태인 ALL_ 상수를 반환
      platforms: p ? (p.split(',') as Platform[]) : PLATFORMS,
      statuses: st ? (st.split(',') as Status[]) : STATUSES,
    }
  }, [searchParams])

  // 3. Serialization: State -> URL (전체 선택 시 생략 로직)
  const setParams = useCallback(
    (newParams: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(newParams).forEach(([key, value]) => {
        // 날짜가 기본값인가?
        const isDefaultDate =
          (key === 'start' && value === DEFAULT_DATE.start) ||
          (key === 'end' && value === DEFAULT_DATE.end)

        // 플랫폼/상태가 '전체 선택'인가? (배열 길이가 전체 옵션 길이와 같으면 전체 선택)
        const isAllPlatforms =
          key === 'platforms' && Array.isArray(value) && value.length === PLATFORMS.length
        const isAllStatuses =
          key === 'statuses' && Array.isArray(value) && value.length === STATUSES.length

        // 빈 배열이거나 null인가?
        const isEmptyOrNull = value === null || (Array.isArray(value) && value.length === 0)

        // '전체' 상태라면 URL에서 삭제, 아니면 업데이트
        if (isDefaultDate || isAllPlatforms || isAllStatuses || isEmptyOrNull) {
          params.delete(key)
        } else {
          params.set(key, Array.isArray(value) ? value.join(',') : value)
        }
      })

      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  // 4. Actions (기존 로직 유지하되 setParams가 '전체'를 판단함)
  const setDateRange = (range: DateRange) => {
    setParams({ start: range.start, end: range.end })
  }

  const togglePlatform = (platform: Platform) => {
    const current = filters.platforms
    const isSelected = current.includes(platform)
    // 마지막 항목은 해제 불가
    if (isSelected && current.length === 1) return
    const next = isSelected ? current.filter((p) => p !== platform) : [...current, platform]
    setParams({ platforms: next })
  }

  const toggleStatus = (status: Status) => {
    const current = filters.statuses
    const isSelected = current.includes(status)
    // 마지막 항목은 해제 불가
    if (isSelected && current.length === 1) return
    const next = isSelected ? current.filter((s) => s !== status) : [...current, status]
    setParams({ statuses: next })
  }

  const reset = () => {
    router.push(pathname, { scroll: false })
  }

  return {
    ...filters,
    setDateRange,
    togglePlatform,
    toggleStatus,
    reset,
  }
}
