'use client'

import { useState } from 'react'
import { Search, Loader2, X } from 'lucide-react'

interface SearchInputProps {
  onSearch?: (value: string) => void
  isPending?: boolean
  placeholder?: string
  className?: string
  'aria-label'?: string
}

export default function SearchInput({
  onSearch,
  isPending = false,
  placeholder,
  className = '',
  'aria-label': ariaLabel,
}: SearchInputProps) {
  const [value, setValue] = useState('')

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') onSearch?.(value)
  }

  function handleClear() {
    setValue('')
    onSearch?.('')
  }

  return (
    <div className="relative flex items-center">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          onSearch?.(e.target.value)
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={`w-full rounded-lg border border-border py-1.5 pl-3 pr-8 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
      />
      {value ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="검색어 초기화"
        >
          <X size={14} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onSearch?.(value)}
          className="absolute right-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="검색"
          tabIndex={-1}
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
        </button>
      )}
    </div>
  )
}
