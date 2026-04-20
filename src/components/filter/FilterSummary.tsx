'use client'

import { useFilterStore } from '@/store/filter-store'
import { formatDate } from '@/lib/format'
import { STATUS_LABEL } from '@/constants'

export default function FilterSummary() {
  const { start, end } = useFilterStore((s) => s.dateRange)
  const platforms = useFilterStore((s) => s.platforms)
  const statuses = useFilterStore((s) => s.statuses)

  const parts = [
    `${formatDate(start)} ~ ${formatDate(end)}`,
    platforms.length > 0 && platforms.join(' · '),
    statuses.length > 0 && statuses.map((s) => STATUS_LABEL[s]).join(' · '),
  ].filter(Boolean)

  return <p className="mt-0.5 text-xs text-muted-foreground">{parts.join(' | ')}</p>
}
