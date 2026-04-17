'use client'

import { type ReactNode } from 'react'
import { useFilterStore } from '@/store/filter-store'
import AsyncBoundary from '../shared/AsyncBoundary'
import { formatDate } from '@/lib/format'

interface ChartShellProps {
  title: string
  header?: ReactNode
  children: ReactNode
}

export default function ChartShell({ title, header, children }: ChartShellProps) {
  const { start, end } = useFilterStore((s) => s.dateRange)

  return (
    <section className="rounded-xl border border-border bg-white p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatDate(start)} ~ {formatDate(end)}
          </p>
        </div>
        {header}
      </div>

      <AsyncBoundary>{children}</AsyncBoundary>
    </section>
  )
}
