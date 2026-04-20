'use client'

import { STATUSES, STATUS_LABEL } from '@/constants'
import { useFilterParams } from '@/hooks/useFilterParams'
import ToggleGroup from '@/components/ui/ToggleGroup'

const STATUS_ITEMS = STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] }))

export default function StatusFilter() {
  const { statuses, toggleStatus } = useFilterParams()

  return (
    <ToggleGroup
      groupLabel="상태"
      aria-label="상태 선택"
      items={STATUS_ITEMS}
      selected={statuses}
      onToggle={toggleStatus}
      minSelected={1}
    />
  )
}
