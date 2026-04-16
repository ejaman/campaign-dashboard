'use client'

import { PLATFORMS } from '@/constants'
import { useFilterStore } from '@/store/filter-store'
import FilterGroup from './FilterGroup'

export default function PlatformFilter() {
  const { platforms, togglePlatform } = useFilterStore()

  return (
    <FilterGroup label="매체" items={PLATFORMS} selected={platforms} onToggle={togglePlatform} />
  )
}
