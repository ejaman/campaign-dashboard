'use client'

import { useMemo, useState, useTransition } from 'react'
import { useCampaignRegisterModal } from '@/hooks/useCampaignRegisterModal'
import Button from '@/components/ui/Button'
import SearchInput from '@/components/ui/SearchInput'
import CampaignTableMeta from './CampaignTableMeta'
import CampaignTableContent from './CampaignTableContent'
import type { SortState } from '@/hooks/useCampaignTable'
import AsyncBoundary from '../shared/AsyncBoundary'
import FilterSummary from '../filter/FilterSummary'
import { useFilterParams } from '@/hooks/useFilterParams'

export default function CampaignTableSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sort, setSort] = useState<SortState | null>(null)
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()
  const { open: openRegisterModal } = useCampaignRegisterModal()

  const {
    dateRange: { start, end },
    statuses,
    platforms,
  } = useFilterParams()

  const filterKey = useMemo(() => {
    return `${start}|${end}|${[...platforms].join()}|${[...statuses].join()}`
  }, [end, platforms, start, statuses])

  const [prevFilterKey, setPrevFilterKey] = useState(filterKey)
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey)
    setPage(1)
    setSelectedIds(new Set())
  }

  const handleSearch = (value: string) => {
    startTransition(() => {
      setSearchQuery(value)
      setPage(1)
    })
  }

  return (
    <section className="rounded-xl border border-border bg-white p-4 sm:p-6">
      {/* 섹션 헤더: 제목 + 검색 + 등록 버튼 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">캠페인 목록</h2>
          <FilterSummary />
        </div>
        <div className="flex items-center gap-2">
          <SearchInput
            onSearch={handleSearch}
            isPending={isPending}
            placeholder="캠페인명 검색"
            aria-label="캠페인명 검색"
            className="sm:w-56"
          />
          <Button variant="solid" size="sm" onClick={openRegisterModal}>
            + 캠페인 등록
          </Button>
        </div>
      </div>

      <AsyncBoundary>
        <>
          <CampaignTableMeta
            searchQuery={searchQuery}
            sort={sort}
            page={page}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
          <CampaignTableContent
            searchQuery={searchQuery}
            sort={sort}
            page={page}
            selectedIds={selectedIds}
            onSortChange={setSort}
            onPageChange={setPage}
            onSelectionChange={setSelectedIds}
          />
        </>
      </AsyncBoundary>
    </section>
  )
}
