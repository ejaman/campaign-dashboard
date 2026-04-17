import { ChevronUp, ChevronDown } from 'lucide-react'
import type { SortColumn, SortState } from '@/hooks/useCampaignTable'

interface SortableHeaderProps {
  column: SortColumn
  label: string
  sort: SortState | null
  onSort: (column: SortColumn) => void
  className?: string
}

export default function SortableHeader({
  column,
  label,
  sort,
  onSort,
  className = '',
}: SortableHeaderProps) {
  const isActive = sort?.column === column
  const direction = isActive ? sort!.direction : null

  return (
    <th
      className={`px-4 py-3 text-left text-xs font-medium text-muted-foreground cursor-pointer select-none whitespace-nowrap hover:text-foreground transition-colors ${className}`}
      onClick={() => onSort(column)}
      aria-sort={isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className="inline-flex flex-col -gap-1">
          <ChevronUp
            size={10}
            className={
              isActive && direction === 'asc' ? 'text-primary' : 'text-muted-foreground/40'
            }
          />
          <ChevronDown
            size={10}
            className={
              isActive && direction === 'desc' ? 'text-primary' : 'text-muted-foreground/40'
            }
          />
        </span>
      </span>
    </th>
  )
}
