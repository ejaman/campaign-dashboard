'use client'

import { useState } from 'react'

import type { ChartMetric } from '@/constants'
import ChartShell from '../ChartShell'
import MetricToggle from '../MetricToggle'
import DailyChartContent from './DailyChartContent'

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
