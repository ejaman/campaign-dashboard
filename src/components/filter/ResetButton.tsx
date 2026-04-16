'use client'

import { RotateCcw } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useFilterStore } from '@/store/filter-store'

interface ResetButtonProps {
  className?: string
}

export default function ResetButton({ className = '' }: ResetButtonProps) {
  const reset = useFilterStore((state) => state.reset)

  return (
    <Button
      onClick={reset}
      variant="icon"
      size="sm"
      className={`gap-1.5 whitespace-nowrap ${className}`.trim()}
      aria-label="필터 초기화"
    >
      <RotateCcw size={14} />
      초기화
    </Button>
  )
}
