import Button from '@/components/ui/Button'

interface FilterGroupProps<T extends string> {
  label: string
  items: readonly T[]
  selected: T[]
  onToggle: (item: T) => void
  getLabel?: (item: T) => string
}

export default function FilterGroup<T extends string>({
  label,
  items,
  selected,
  onToggle,
  getLabel,
}: FilterGroupProps<T>) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">{label}</span>
      <div className="flex gap-1">
        {items.map((item) => (
          <Button
            key={item}
            active={selected.includes(item)}
            onClick={() => onToggle(item)}
            aria-pressed={selected.includes(item)}
          >
            {getLabel ? getLabel(item) : item}
          </Button>
        ))}
      </div>
    </div>
  )
}
