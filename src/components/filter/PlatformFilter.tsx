'use client'

import { PLATFORMS } from '@/constants'
import { useFilterParams } from '@/hooks/useFilterParams'
import ToggleGroup from '@/components/ui/ToggleGroup'

const PLATFORM_ITEMS = PLATFORMS.map((p) => ({ value: p, label: p }))

export default function PlatformFilter() {
  const { platforms, togglePlatform } = useFilterParams()

  return (
    <ToggleGroup
      groupLabel="매체"
      aria-label="매체 선택"
      items={PLATFORM_ITEMS}
      selected={platforms}
      onToggle={togglePlatform}
      minSelected={1}
    />
  )
}
