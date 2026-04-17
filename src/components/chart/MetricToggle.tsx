import Button from '@/components/ui/Button'
import { METRIC_LABELS } from '@/constants'
import type { ChartMetric } from '@/types'

const DEFAULT_OPTIONS: ChartMetric[] = ['impressions', 'clicks']

interface MetricToggleProps {
  activeMetrics: ChartMetric[]
  onChange: (metrics: ChartMetric[]) => void
  options?: ChartMetric[]
}

export default function MetricToggle({
  activeMetrics,
  onChange,
  options = DEFAULT_OPTIONS,
}: MetricToggleProps) {
  function handleToggle(metric: ChartMetric) {
    const isActive = activeMetrics.includes(metric)
    // 마지막 1개 선택 시 비활성화 방지
    if (isActive && activeMetrics.length === 1) return

    const next = isActive ? activeMetrics.filter((m) => m !== metric) : [...activeMetrics, metric]
    onChange(next)
  }

  return (
    <div className="flex gap-2" role="group" aria-label="지표 선택">
      {options.map((metric) => {
        const isActive = activeMetrics.includes(metric)
        const isDisabled = isActive && activeMetrics.length === 1
        return (
          <span key={metric} className="relative group">
            <Button
              variant="default"
              size="sm"
              active={isActive}
              disabled={isDisabled}
              aria-pressed={isActive}
              aria-label={`${METRIC_LABELS[metric]} ${isActive ? '선택됨' : '선택 안됨'}`}
              onClick={() => handleToggle(metric)}
            >
              {METRIC_LABELS[metric]}
            </Button>
            {isDisabled && (
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                최소 1개 이상 선택해야 합니다
              </span>
            )}
          </span>
        )
      })}
    </div>
  )
}
