import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './Button'

interface PaginationProps {
  page: number
  pageCount: number
  onChange: (page: number) => void
}

export default function Pagination({ page, pageCount, onChange }: PaginationProps) {
  const effectivePageCount = Math.max(1, pageCount)

  return (
    <nav className="flex items-center justify-center gap-1 mt-4" aria-label="페이지 내비게이션">
      <Button
        variant="icon"
        size="sm"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="이전 페이지"
      >
        <ChevronLeft size={16} />
      </Button>

      {Array.from({ length: effectivePageCount }, (_, i) => i + 1).map((p) => (
        <Button
          key={p}
          variant="default"
          size="sm"
          active={p === page}
          onClick={() => onChange(p)}
          aria-label={`${p}페이지`}
          aria-current={p === page ? 'page' : undefined}
          className="min-w-8"
        >
          {p}
        </Button>
      ))}

      <Button
        variant="icon"
        size="sm"
        onClick={() => onChange(page + 1)}
        disabled={page === effectivePageCount}
        aria-label="다음 페이지"
      >
        <ChevronRight size={16} />
      </Button>
    </nav>
  )
}
