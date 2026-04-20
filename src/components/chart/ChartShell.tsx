import { type ReactNode } from 'react'
import AsyncBoundary from '../shared/AsyncBoundary'
import FilterSummary from '../filter/FilterSummary'

interface ChartShellProps {
  title: string
  header?: ReactNode
  children: ReactNode
}

export default function ChartShell({ title, header, children }: ChartShellProps) {
  return (
    <section className="rounded-xl border border-border bg-white p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <FilterSummary />
        </div>
        {header}
      </div>

      <AsyncBoundary>{children}</AsyncBoundary>
    </section>
  )
}
