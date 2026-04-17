/** YYYY-MM-DD → MM/DD */
export function formatChartDate(dateStr: string): string {
  return dateStr.slice(5).replace('-', '/')
}

/** YYYY-MM-DD → YYYY.MM.DD */
export function formatDate(dateStr: string): string {
  return dateStr.replace(/-/g, '.')
}

/** 숫자 → 만 단위 축약 (차트 Y축·툴팁용) */
export function formatNumber(value: number): string {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}만`
  return value.toLocaleString()
}

/** 금액 포맷 — null이면 "-" */
export function formatCurrency(value: number | null): string {
  if (value === null) return '-'
  return `${Math.round(value).toLocaleString()}원`
}

/** 퍼센트 포맷 (소수점 1자리) — null이면 "-" */
export function formatPercent(value: number | null): string {
  if (value === null) return '-'
  return `${value.toFixed(1)}%`
}
