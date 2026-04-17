import { ReactNode, Suspense } from 'react'
import LoadingFallback from '../ui/LoadingFallback'
import ErrorBoundary from '../ui/ErrorBoundary'

interface AsyncBoundaryProps {
  fallback?: ReactNode
  children: ReactNode
}
export default function AsyncBoundary({ fallback, children }: AsyncBoundaryProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={fallback || <LoadingFallback />}>
        <div className="overflow-x-auto">
          <div className="min-w-120">{children}</div>
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}
