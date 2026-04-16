'use client'

import { STATUSES, STATUS_LABEL } from '@/constants'
import { useFilterStore } from '@/store/filter-store'
import FilterGroup from './FilterGroup'

export default function StatusFilter() {
  const { statuses, toggleStatus } = useFilterStore()

  return (
    <FilterGroup
      label="상태"
      items={STATUSES}
      selected={statuses}
      onToggle={toggleStatus}
      getLabel={(s) => STATUS_LABEL[s]}
    />
  )
}
