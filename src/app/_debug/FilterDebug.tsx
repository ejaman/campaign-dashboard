'use client'

import { useEffect } from 'react'
import { useFilterStore } from '@/store/filter-store'

export default function FilterDebug() {
  const filterState = useFilterStore()

  useEffect(() => {
    console.log('[FilterStore]', {
      dateRange: filterState.dateRange,
      platforms: filterState.platforms,
      statuses: filterState.statuses,
    })
  }, [filterState.dateRange, filterState.platforms, filterState.statuses])

  return null
}
