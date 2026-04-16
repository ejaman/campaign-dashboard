import { Calendar } from 'lucide-react'

interface DateInputProps {
  value: string
  name: string
  min?: string
  max?: string
  onChange: (value: string) => void
  'aria-label': string
}

export default function DateInput({
  value,
  name,
  min,
  max,
  onChange,
  'aria-label': ariaLabel,
}: DateInputProps) {
  // YYYY-MM-DD → YYYY.MM.DD 표시용 포맷
  const displayValue = value ? value.replace(/-/g, '.') : ''

  return (
    <div className="relative w-28 sm:w-36 border border-border rounded-lg focus-within:ring-1 focus-within:ring-primary">
      {/* 포맷된 날짜 표시 레이어 */}
      <span className="absolute inset-0 flex items-center px-3 text-sm pointer-events-none select-none">
        {displayValue}
      </span>
      {/* native input — 투명하게 위에 올려 클릭/picker만 담당 */}
      <input
        type="date"
        name={name}
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="w-full py-1.5 px-3 pr-8 text-sm opacity-0 cursor-pointer"
        aria-label={ariaLabel}
      />
      <Calendar
        size={14}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
    </div>
  )
}
