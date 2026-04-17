interface LoadingFallbackProps {
  message?: string
  height?: string
}

export default function LoadingFallback({
  message = '데이터를 불러오는 중...',
  height = 'h-[300px]',
}: LoadingFallbackProps) {
  return (
    <div className={`flex ${height} items-center justify-center`}>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {message}
      </p>
    </div>
  )
}
