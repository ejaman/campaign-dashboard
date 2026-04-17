/** YYYY-MM-DD → MM/DD */
export function formatChartDate(dateStr: string): string {
  return dateStr.slice(5).replace('-', '/')
}

/** 숫자 → 만 단위 축약 (차트 Y축·툴팁용) */
export function formatNumber(value: number): string {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}만`
  return value.toLocaleString()
}
