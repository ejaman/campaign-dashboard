'use client'

import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import type { Campaign, Status } from '@/types'

export function useBulkStatusUpdate() {
  const queryClient = useQueryClient()

  function updateStatus(selectedIds: Set<string>, newStatus: Status) {
    queryClient.setQueryData<Campaign[]>(
      queryKeys.campaigns.all,
      (prev) => prev?.map((c) => (selectedIds.has(c.id) ? { ...c, status: newStatus } : c)) ?? []
    )
  }

  return { updateStatus }
}
