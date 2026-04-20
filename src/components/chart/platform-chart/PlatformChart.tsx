'use client'

import { memo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { formatNumber, formatPercent } from '@/lib/format'
import type { PlatformChartData } from '@/hooks/usePlatformChartData'
import type { Platform } from '@/types'
import type { ChartMetric } from '@/constants'

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: PlatformChartData }>
  activeMetric: ChartMetric
}

function CustomTooltip({ active, payload, activeMetric }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const { platform, value, percentage, color } = payload[0].payload
  const unit = activeMetric === 'cost' ? '원' : ''

  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2 shadow-md text-sm">
      <p className="font-medium mb-1" style={{ color }}>
        {platform}
      </p>
      <p className="text-foreground">
        {formatNumber(value)}
        {unit}
      </p>
      <p className="text-muted-foreground">{formatPercent(percentage)}</p>
    </div>
  )
}

interface PlatformChartProps {
  data: PlatformChartData[]
  activeMetric: ChartMetric
  activePlatforms: Platform[]
  onSegmentClick: (platform: Platform) => void
}

function PlatformChart({
  data,
  activeMetric,
  activePlatforms,
  onSegmentClick,
}: PlatformChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const unit = activeMetric === 'cost' ? '원' : ''

  return (
    <div className="flex flex-col gap-4">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={64}
            outerRadius={96}
            dataKey="value"
            onClick={(entry) => onSegmentClick((entry as unknown as PlatformChartData).platform)}
          >
            {data.map((entry) => (
              <Cell
                key={entry.platform}
                fill={entry.color}
                opacity={activePlatforms.includes(entry.platform) ? 1 : 0.25}
                className="cursor-pointer outline-none"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip activeMetric={activeMetric} />} />
        </PieChart>
      </ResponsiveContainer>

      {/* 범례 */}
      <ul className="flex flex-col gap-2 text-sm">
        {data.map(({ platform, value, percentage, color }) => (
          <li
            key={platform}
            className="flex items-center justify-between cursor-pointer"
            onClick={() => onSegmentClick(platform)}
          >
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor: color,
                  opacity: activePlatforms.includes(platform) ? 1 : 0.25,
                }}
              />
              <span
                className="font-medium"
                style={{ color: activePlatforms.includes(platform) ? undefined : '#9ca3af' }}
              >
                {platform}
              </span>
            </span>
            <span className="text-muted-foreground tabular-nums">
              {formatNumber(value)}
              {unit}
              <span className="ml-2 text-xs">({formatPercent(percentage)})</span>
            </span>
          </li>
        ))}
      </ul>

      {/* 합계 */}
      <p className="text-xs text-muted-foreground text-right border-t border-border pt-2">
        합계 {formatNumber(total)}
        {unit}
      </p>
    </div>
  )
}

export default memo(PlatformChart)
