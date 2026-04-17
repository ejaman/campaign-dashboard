'use client'

import { Suspense, type ReactNode } from 'react'
import { useFilterStore } from '@/store/filter-store'
import ErrorBoundary from './ErrorBoundary'

interface ChartShellProps {
  title: string
  header?: ReactNode
  children: ReactNode
}

function LoadingFallback() {
  return (
    <div className="flex h-[300px] items-center justify-center">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        데이터를 불러오는 중...
      </p>
    </div>
  )
}

function formatDate(dateStr: string): string {
  // YYYY-MM-DD → YYYY.MM.DD
  return dateStr.replace(/-/g, '.')
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

      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <div className="overflow-x-auto">
            <div className="min-w-120">{children}</div>
          </div>
        </Suspense>
      </ErrorBoundary>
    </section>
  )
}
