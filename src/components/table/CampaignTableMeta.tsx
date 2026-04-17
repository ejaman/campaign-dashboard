'use client'

import { useCampaignTable, type SortState } from '@/hooks/useCampaignTable'
import { useBulkStatusUpdate } from '@/hooks/useBulkStatusUpdate'
import Select from '@/components/ui/Select'
import { STATUS_LABEL } from '@/constants'
import type { Status } from '@/types'

interface CampaignTableMetaProps {
  searchQuery: string
  sort: SortState | null
  page: number
  selectedIds: Set<string>
  onSelectionChange: (ids: Set<string>) => void
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'active', label: STATUS_LABEL.active },
  { value: 'paused', label: STATUS_LABEL.paused },
  { value: 'ended', label: STATUS_LABEL.ended },
]

export default function CampaignTableMeta({
  searchQuery,
  sort,
  page,
  selectedIds,
  onSelectionChange,
}: CampaignTableMetaProps) {
  const { totalCount, filteredCount } = useCampaignTable({ searchQuery, sort, page })
  const { updateStatus } = useBulkStatusUpdate()

  const handleBulkStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Status
    if (!newStatus) return
    updateStatus(selectedIds, newStatus)
    onSelectionChange(new Set())
    e.target.value = ''
  }

  return (
    <div className="flex items-center gap-3 mb-3 h-8">
      <p className="text-sm text-muted-foreground">
        검색 결과 <span className="font-medium text-foreground">{filteredCount}건</span>
        {' / '}
        <span className="font-medium text-foreground">{totalCount}건</span>
      </p>
      <div
        className={`flex items-center gap-2 ${selectedIds.size === 0 ? 'invisible pointer-events-none' : ''}`}
        aria-hidden={selectedIds.size === 0}
      >
        <span className="text-sm text-muted-foreground">선택한 {selectedIds.size}개</span>
        <Select
          options={STATUS_OPTIONS}
          placeholder="상태 변경"
          onChange={handleBulkStatusChange}
          aria-label="선택한 캠페인 상태 일괄 변경"
        />
      </div>
    </div>
  )
}
