'use client'

import { useState } from 'react'
import ChartShell from '@/components/ui/ChartShell'
import MetricToggle from './MetricToggle'
import DailyChartContent from './DailyChartContent'
import type { ChartMetric } from '@/constants'

export default function DailyChartSection() {
  const [activeMetrics, setActiveMetrics] = useState<ChartMetric[]>(['impressions', 'clicks'])

  return (
    <ChartShell
      title="일별 추이"
      header={<MetricToggle activeMetrics={activeMetrics} onChange={setActiveMetrics} />}
    >
      <DailyChartContent activeMetrics={activeMetrics} />
    </ChartShell>
  )
}
