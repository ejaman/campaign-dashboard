'use client'

import { memo } from 'react'
import {
  PLATFORM_COLORS,
  RANKING_METRICS,
  RANKING_ASCENDING,
  type RankingMetric,
} from '@/constants'
import type { RankingEntry } from '@/hooks/useRankingChartData'

function formatValue(value: number, metric: RankingMetric): string {
  if (metric === 'cpc') return `${Math.round(value).toLocaleString()}원`
  if (metric === 'ctr') return `${value.toFixed(2)}%`
  return `${value.toFixed(1)}%`
}

interface RankingChartProps {
  data: RankingEntry[]
  activeMetric: RankingMetric
}

const RANK_LABELS = ['🥇', '🥈', '🥉']

function RankingChart({ data, activeMetric }: RankingChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
        데이터가 없습니다
      </div>
    )
  }

  const isAscending = RANKING_ASCENDING.includes(activeMetric)
  const sortHint = isAscending ? '낮을수록 상위' : '높을수록 상위'
  const metricLabel = RANKING_METRICS.find((m) => m.key === activeMetric)?.label ?? ''
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted-foreground text-right">
        {metricLabel} · {sortHint}
      </p>

      {data.map((entry, i) => {
        const pct = maxValue > 0 ? (entry.value / maxValue) * 100 : 0
        const color = PLATFORM_COLORS[entry.platform]

        return (
          <div key={entry.campaignId} className="flex flex-col gap-1.5">
            {/* 이름 행 */}
            <div className="flex items-center gap-1.5">
              <span className="text-base shrink-0">{RANK_LABELS[i]}</span>
              <span className="text-sm text-foreground">{entry.name}</span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full shrink-0"
                style={{ backgroundColor: `${color}20`, color }}
              >
                {entry.platform}
              </span>
            </div>

            {/* 바 + 수치 행 */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-4 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
              <span className="text-sm tabular-nums text-muted-foreground w-20 text-right shrink-0">
                {formatValue(entry.value, activeMetric)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default memo(RankingChart)
