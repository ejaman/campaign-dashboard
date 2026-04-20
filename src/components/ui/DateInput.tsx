'use client'

import { useRef } from 'react'
import { Calendar } from 'lucide-react'

interface DateInputProps {
  value: string
  name: string
  id?: string
  min?: string
  max?: string
  onChange: (value: string) => void
  'aria-label'?: string
  className?: string
}

export default function DateInput({
  value,
  name,
  id,
  min,
  max,
  onChange,
  'aria-label': ariaLabel,
  className = 'w-28 sm:w-36',
}: DateInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // YYYY-MM-DD → YYYY.MM.DD 표시용 포맷
  const displayValue = value ? value.replace(/-/g, '.') : ''

  return (
    <div
      className={`relative h-8 border border-border rounded-lg focus-within:ring-1 focus-within:ring-primary cursor-pointer ${className}`}
      onClick={() => inputRef.current?.showPicker()}
    >
      {/* 포맷된 날짜 표시 레이어 */}
      <span className="absolute inset-0 flex items-center px-3 text-sm pointer-events-none select-none">
        {displayValue}
      </span>
      {/* native input — 투명, 높이 확보 + onChange 담당 */}
      <input
        ref={inputRef}
        type="date"
        id={id}
        name={name}
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
        aria-label={ariaLabel}
        tabIndex={-1}
      />
      <Calendar
        size={14}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
    </div>
  )
}
