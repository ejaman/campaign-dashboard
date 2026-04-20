'use client'

import { usePlatformChartData } from '@/hooks/usePlatformChartData'
import { useFilterParams } from '@/hooks/useFilterParams'
import PlatformChart from './PlatformChart'
import type { ChartMetric } from '@/constants'
import type { Platform } from '@/types'

interface PlatformChartContentProps {
  activeMetric: ChartMetric
}

export default function PlatformChartContent({ activeMetric }: PlatformChartContentProps) {
  const data = usePlatformChartData(activeMetric)
  const { platforms, togglePlatform } = useFilterParams()

  return (
    <PlatformChart
      data={data}
      activeMetric={activeMetric}
      activePlatforms={platforms}
      onSegmentClick={(platform: Platform) => togglePlatform(platform)}
    />
  )
}
