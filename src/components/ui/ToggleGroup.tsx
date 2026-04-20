import Button from './Button'

interface ToggleItem<T extends string> {
  value: T
  label: string
}

interface ToggleGroupProps<T extends string> {
  items: ToggleItem<T>[]
  selected: T[]
  onToggle: (value: T) => void
  groupLabel?: string
  'aria-label'?: string
  minSelected?: number
}

export default function ToggleGroup<T extends string>({
  items,
  selected,
  onToggle,
  groupLabel,
  'aria-label': ariaLabel,
  minSelected = 0,
}: ToggleGroupProps<T>) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label={ariaLabel ?? groupLabel}>
      {groupLabel && (
        <span className="text-sm text-muted-foreground whitespace-nowrap">{groupLabel}</span>
      )}
      <div className="flex gap-1">
        {items.map(({ value, label }) => {
          const isActive = selected.includes(value)
          const isDisabled = isActive && selected.length <= minSelected
          return (
            <span key={value} className="relative group">
              <Button
                active={isActive}
                disabled={isDisabled}
                aria-pressed={isActive}
                onClick={() => onToggle(value)}
              >
                {label}
              </Button>
              {isDisabled && (
                <span
                  role="tooltip"
                  className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  최소 {minSelected}개 이상 선택해야 합니다
                </span>
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}
