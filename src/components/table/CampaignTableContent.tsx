'use client'

import { useMemo } from 'react'
import { useCampaignTable, type SortState, type SortColumn } from '@/hooks/useCampaignTable'
import CampaignTableHead from './CampaignTableHead'
import CampaignTableRow from './CampaignTableRow'
import Pagination from '@/components/ui/Pagination'

interface CampaignTableContentProps {
  searchQuery: string
  sort: SortState | null
  page: number
  selectedIds: Set<string>
  onSortChange: (sort: SortState | null) => void
  onPageChange: (page: number) => void
  onSelectionChange: (ids: Set<string>) => void
}

export default function CampaignTableContent({
  searchQuery,
  sort,
  page,
  selectedIds,
  onSortChange,
  onPageChange,
  onSelectionChange,
}: CampaignTableContentProps) {
  const { rows, pageCount } = useCampaignTable({ searchQuery, sort, page })

  const currentPageIds = useMemo(() => new Set(rows.map((r) => r.id)), [rows])
  const allSelected = rows.length > 0 && rows.every((r) => selectedIds.has(r.id))
  const someSelected = rows.some((r) => selectedIds.has(r.id))

  const handleToggleAll = () => {
    const next = new Set(selectedIds)
    if (allSelected) {
      currentPageIds.forEach((id) => next.delete(id))
    } else {
      currentPageIds.forEach((id) => next.add(id))
    }
    onSelectionChange(next)
  }

  const handleToggleOne = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    onSelectionChange(next)
  }

  const handleSort = (column: SortColumn) => {
    if (sort?.column === column) {
      onSortChange(sort.direction === 'asc' ? { column, direction: 'desc' } : null)
    } else {
      onSortChange({ column, direction: 'asc' })
    }
  }

  return (
    <>
      <div className="overflow-x-auto min-h-122.5">
        <table className="w-full min-w-[860px] table-fixed text-sm">
          <CampaignTableHead
            sort={sort}
            allSelected={allSelected}
            someSelected={someSelected}
            onToggleAll={handleToggleAll}
            onSort={handleSort}
          />
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  {searchQuery ? '검색 결과가 없습니다.' : '캠페인이 없습니다.'}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <CampaignTableRow
                  key={row.id}
                  row={row}
                  isSelected={selectedIds.has(row.id)}
                  onToggle={handleToggleOne}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} pageCount={pageCount} onChange={onPageChange} />
    </>
  )
}
