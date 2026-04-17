import Badge from '@/components/ui/Badge'
import { formatCurrency, formatPercent, formatDate } from '@/lib/format'
import type { CampaignRow } from '@/types'

interface CampaignTableRowProps {
  row: CampaignRow
  isSelected: boolean
  onToggle: (id: string) => void
}

const tdClass = 'px-4 py-3'

export default function CampaignTableRow({ row, isSelected, onToggle }: CampaignTableRowProps) {
  return (
    <tr className="border-b border-border hover:bg-secondary/40 transition-colors">
      <td className={tdClass}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(row.id)}
          aria-label={`${row.name} 선택`}
          className="cursor-pointer"
        />
      </td>
      <td className={`${tdClass} font-medium text-foreground truncate`}>{row.name}</td>
      <td className={tdClass}>
        <Badge status={row.status} />
      </td>
      <td className={`${tdClass} text-muted-foreground`}>{row.platform}</td>
      <td className={`${tdClass} text-muted-foreground truncate`}>
        {row.startDate ? formatDate(row.startDate) : '-'}
        {row.endDate ? ` ~ ${formatDate(row.endDate)}` : ''}
      </td>
      <td className={`${tdClass} text-right break-keep`}>{formatCurrency(row.totalCost)}</td>
      <td className={`${tdClass} text-right break-keep`}>{formatPercent(row.ctr)}</td>
      <td className={`${tdClass} text-right break-keep`}>{formatCurrency(row.cpc)}</td>
      <td className={`${tdClass} text-right break-keep`}>{formatPercent(row.roas)}</td>
    </tr>
  )
}
