import { type InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

const inputClass =
  'w-full rounded-lg border border-border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground'

const Input = ({ className, ...props }: InputProps) => (
  <input className={`${inputClass} ${className ?? ''}`} {...props} />
)

export default Input
