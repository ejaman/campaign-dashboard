'use client'

import { useState } from 'react'
import ChartShell from '@/components/chart/ChartShell'
import RankingChartContent from './RankingChartContent'
import ToggleGroup from '@/components/ui/ToggleGroup'
import { RANKING_METRICS, type RankingMetric } from '@/constants'

const METRIC_ITEMS = RANKING_METRICS.map(({ key, label }) => ({ value: key, label }))

export default function RankingChartSection() {
  const [activeMetric, setActiveMetric] = useState<RankingMetric>('roas')

  return (
    <ChartShell
      title="캠페인 랭킹 Top 3"
      header={
        <ToggleGroup
          items={METRIC_ITEMS}
          selected={[activeMetric]}
          onToggle={setActiveMetric}
          minSelected={1}
        />
      }
    >
      <RankingChartContent activeMetric={activeMetric} />
    </ChartShell>
  )
}
