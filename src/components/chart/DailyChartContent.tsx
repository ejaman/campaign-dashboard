'use client'

import { useChartData } from '@/hooks/useChartData'
import DailyChart from './DailyChart'
import type { ChartMetric } from '@/types'

interface DailyChartContentProps {
  activeMetrics: ChartMetric[]
}

export default function DailyChartContent({ activeMetrics }: DailyChartContentProps) {
  const data = useChartData()

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          선택한 필터 조건에 해당하는 데이터가 없습니다.
        </p>
      </div>
    )
  }

  return <DailyChart data={data} activeMetrics={activeMetrics} />
}
