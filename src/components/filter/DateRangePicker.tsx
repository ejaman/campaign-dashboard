'use client'

import DateInput from '@/components/ui/DateInput'
import { useFilterStore } from '@/store/filter-store'

export default function DateRangePicker() {
  const { dateRange, setDateRange } = useFilterStore()

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-sm text-muted-foreground whitespace-nowrap sm:inline">
        집행기간
      </span>
      <DateInput
        value={dateRange.start}
        max={dateRange.end}
        onChange={(start) => setDateRange({ ...dateRange, start })}
        aria-label="시작일"
      />
      <span className="text-muted-foreground">~</span>
      <DateInput
        value={dateRange.end}
        min={dateRange.start}
        onChange={(end) => setDateRange({ ...dateRange, end })}
        aria-label="종료일"
      />
    </div>
  )
}
