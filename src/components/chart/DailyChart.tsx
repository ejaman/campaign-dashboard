'use client'

import { memo, useMemo } from 'react'
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
import { CHART_METRICS, type ChartMetric } from '@/constants'
import { formatChartDate, formatNumber } from '@/lib/format'
import type { DailyChartData } from '@/hooks/useChartData'

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
  const chartData = useMemo(
    () => data.map((d) => ({ ...d, date: formatChartDate(d.date) })),
    [data]
  )

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
        {CHART_METRICS.filter((m) => ['impressions', 'clicks'].includes(m.key)).map(
          ({ key, label, color }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={label}
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              animationDuration={700}
              hide={!activeMetrics.includes(key)}
            />
          )
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default memo(DailyChart)
