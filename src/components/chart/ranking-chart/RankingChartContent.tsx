'use client'

import { useRankingChartData } from '@/hooks/useRankingChartData'
import RankingChart from './RankingChart'
import type { RankingMetric } from '@/constants'

interface RankingChartContentProps {
  activeMetric: RankingMetric
}

export default function RankingChartContent({ activeMetric }: RankingChartContentProps) {
  const data = useRankingChartData(activeMetric)
  return <RankingChart data={data} activeMetric={activeMetric} />
}
