'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 5분간 캐시를 fresh로 유지 — 필터 변경 시 불필요한 재fetch 방지
            staleTime: 1000 * 60 * 5,
            // unmount 후 10분간 캐시 보존 — 단일 페이지라 메모리 부담 없음
            gcTime: 1000 * 60 * 10,
            // 실패 시 1회 재시도
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
