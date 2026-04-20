'use client'

import { formatDate } from '@/lib/format'
import { STATUS_LABEL } from '@/constants'
import { useFilterParams } from '@/hooks/useFilterParams'

export default function FilterSummary() {
  const {
    dateRange: { start, end },
    platforms,
    statuses,
  } = useFilterParams()

  const parts = [
    `${formatDate(start)} ~ ${formatDate(end)}`,
    platforms.length > 0 && platforms.join(' · '),
    statuses.length > 0 && statuses.map((s) => STATUS_LABEL[s]).join(' · '),
  ].filter(Boolean)

  return <p className="mt-0.5 text-xs text-muted-foreground">{parts.join(' | ')}</p>
}
