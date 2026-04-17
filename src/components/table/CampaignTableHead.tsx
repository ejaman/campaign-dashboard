import SortableHeader from './SortableHeader'
import type { SortState, SortColumn } from '@/hooks/useCampaignTable'

interface CampaignTableHeadProps {
  sort: SortState | null
  allSelected: boolean
  someSelected: boolean
  onToggleAll: () => void
  onSort: (column: SortColumn) => void
}

const thClass = 'px-4 py-3 text-left text-xs font-medium text-muted-foreground whitespace-nowrap'

export default function CampaignTableHead({
  sort,
  allSelected,
  someSelected,
  onToggleAll,
  onSort,
}: CampaignTableHeadProps) {
  return (
    <thead>
      <tr className="border-b border-border">
        <th className="px-4 py-3 w-[4%]">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected && !allSelected
            }}
            onChange={onToggleAll}
            aria-label="현재 페이지 전체 선택"
            className="cursor-pointer"
          />
        </th>
        <th className={`${thClass} w-[25%]`}>캠페인명</th>
        <th className={`${thClass} w-[9%]`}>상태</th>
        <th className={`${thClass} w-[9%]`}>매체</th>
        <SortableHeader
          column="startDate"
          label="집행기간"
          sort={sort}
          onSort={onSort}
          className="w-[16%]"
        />
        <SortableHeader
          column="totalCost"
          label="총 집행금액"
          sort={sort}
          onSort={onSort}
          className="w-[12%]"
        />
        <SortableHeader column="ctr" label="CTR" sort={sort} onSort={onSort} className="w-[7%]" />
        <SortableHeader column="cpc" label="CPC" sort={sort} onSort={onSort} className="w-[9%]" />
        <SortableHeader column="roas" label="ROAS" sort={sort} onSort={onSort} className="w-[9%]" />
      </tr>
    </thead>
  )
}
