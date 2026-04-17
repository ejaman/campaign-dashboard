import type { Status } from '@/types'

const statusConfig: Record<Status, { label: string; className: string }> = {
  active: { label: '진행중', className: 'bg-green-100 text-green-700' },
  paused: { label: '일시중지', className: 'bg-yellow-100 text-yellow-700' },
  ended: { label: '종료', className: 'bg-gray-100 text-gray-500' },
}

interface BadgeProps {
  status: Status
}

export default function Badge({ status }: BadgeProps) {
  const { label, className } = statusConfig[status]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium break-keep ${className}`}
    >
      {label}
    </span>
  )
}
