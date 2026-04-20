'use client'

import { useId, cloneElement, isValidElement, type ReactNode, type ReactElement } from 'react'

interface FormItemProps {
  label: string
  required?: boolean
  error?: string
  suffix?: string
  children: ReactNode
}

const FormItem = ({ label, required, error, suffix, children }: FormItemProps) => {
  const id = useId()
  const child = children as ReactElement<{ id?: string; className?: string }>
  const clonedChild = isValidElement(child)
    ? cloneElement(child, {
        id,
        className: ['w-full', child.props.className].filter(Boolean).join(' '),
      })
    : children

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <div className={`mt-1 ${suffix ? 'flex items-center gap-1' : ''}`}>
        {clonedChild}
        {suffix && <span className="shrink-0 text-sm text-muted-foreground">{suffix}</span>}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default FormItem
