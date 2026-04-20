import { CHART_METRICS, type ChartMetric } from '@/constants'
import ToggleGroup from '@/components/ui/ToggleGroup'

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
  const items = options.map((key) => ({
    value: key,
    label: CHART_METRICS.find((m) => m.key === key)!.label,
  }))

  const handleToggle = (metric: ChartMetric) => {
    const next = activeMetrics.includes(metric)
      ? activeMetrics.filter((m) => m !== metric)
      : [...activeMetrics, metric]
    onChange(next)
  }

  return (
    <ToggleGroup
      items={items}
      selected={activeMetrics}
      onToggle={handleToggle}
      aria-label="지표 선택"
      minSelected={1}
    />
  )
}
