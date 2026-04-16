import { type ButtonHTMLAttributes } from 'react'

type Variant = 'default' | 'icon' | 'solid'
type Size = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  active?: boolean
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
}

function getVariantClasses(variant: Variant, active?: boolean): string {
  switch (variant) {
    case 'default':
      return active
        ? 'border border-primary bg-primary text-primary-foreground'
        : 'border border-border bg-white text-foreground hover:border-primary hover:text-primary'
    case 'icon':
      return 'text-muted-foreground hover:text-foreground'
    case 'solid':
      return 'bg-primary text-primary-foreground hover:bg-primary/90'
  }
}

export default function Button({
  children,
  type = 'button',
  variant = 'default',
  size = 'sm',
  active,
  className = '',
  ...props
}: ButtonProps) {
  const classes = [
    'inline-flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg break-keep',
    sizeClasses[size],
    getVariantClasses(variant, active),
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}
