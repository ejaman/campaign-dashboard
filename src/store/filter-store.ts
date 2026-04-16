import { create } from 'zustand'
import type { DateRange, FilterState, Platform, Status } from '@/types'

// 당월 1일~말일을 YYYY-MM-DD 형식으로 반환
function getDefaultDateRange(): DateRange {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() // 0-indexed
  const lastDay = new Date(year, month + 1, 0).getDate()
  const pad = (n: number) => String(n).padStart(2, '0')

  return {
    start: `${year}-${pad(month + 1)}-01`,
    end: `${year}-${pad(month + 1)}-${pad(lastDay)}`,
  }
}

interface FilterActions {
  setDateRange: (dateRange: DateRange) => void
  togglePlatform: (platform: Platform) => void
  toggleStatus: (status: Status) => void
  reset: () => void
}

const defaultState: FilterState = {
  dateRange: getDefaultDateRange(),
  platforms: [], // 빈 배열 = 전체
  statuses: [], // 빈 배열 = 전체
}

export const useFilterStore = create<FilterState & FilterActions>((set) => ({
  ...defaultState,

  setDateRange: (dateRange) => set({ dateRange }),

  togglePlatform: (platform) =>
    set((state) => ({
      platforms: state.platforms.includes(platform)
        ? state.platforms.filter((p) => p !== platform)
        : [...state.platforms, platform],
    })),

  toggleStatus: (status) =>
    set((state) => ({
      statuses: state.statuses.includes(status)
        ? state.statuses.filter((s) => s !== status)
        : [...state.statuses, status],
    })),

  reset: () => set({ ...defaultState, dateRange: getDefaultDateRange() }),
}))
