'use client'

import { memo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { METRIC_COLORS, METRIC_LABELS } from '@/constants'
import { formatChartDate, formatNumber } from '@/lib/format'
import type { DailyChartData } from '@/hooks/useChartData'
import type { ChartMetric } from '@/types'

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2 shadow-md text-sm">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

interface DailyChartProps {
  data: DailyChartData[]
  activeMetrics: ChartMetric[]
}

function DailyChart({ data, activeMetrics }: DailyChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    date: formatChartDate(d.date),
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          tickLine={false}
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <YAxis
          tickFormatter={formatNumber}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          tickLine={false}
          axisLine={false}
          width={48}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(value) => <span className="text-sm text-foreground">{value}</span>} />
        {activeMetrics.includes('impressions') && (
          <Line
            type="monotone"
            dataKey="impressions"
            name={METRIC_LABELS.impressions}
            stroke={METRIC_COLORS.impressions}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            animationDuration={700}
          />
        )}
        {activeMetrics.includes('clicks') && (
          <Line
            type="monotone"
            dataKey="clicks"
            name={METRIC_LABELS.clicks}
            stroke={METRIC_COLORS.clicks}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            animationDuration={700}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default memo(DailyChart)
