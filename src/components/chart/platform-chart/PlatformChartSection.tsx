'use client'

import { useState } from 'react'
import ChartShell from '../ChartShell'
import PlatformChartContent from './PlatformChartContent'
import ToggleGroup from '@/components/ui/ToggleGroup'
import { CHART_METRICS, type ChartMetric } from '@/constants'

const METRIC_ITEMS = CHART_METRICS.map(({ key, label }) => ({ value: key, label }))

export default function PlatformChartSection() {
  const [activeMetric, setActiveMetric] = useState<ChartMetric>('cost')

  return (
    <ChartShell
      title="매체별 성과"
      header={
        <ToggleGroup
          items={METRIC_ITEMS}
          selected={[activeMetric]}
          onToggle={setActiveMetric}
          minSelected={1}
        />
      }
    >
      <PlatformChartContent activeMetric={activeMetric} />
    </ChartShell>
  )
}
