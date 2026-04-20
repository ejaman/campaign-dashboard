'use client'

import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import Button from './Button'

// Context

interface ModalContextValue {
  onClose: () => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

const useModalContext = () => {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('Modal 하위 컴포넌트는 <Modal> 안에서 사용해야 합니다.')
  return ctx
}

// Root
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  'aria-label'?: string
}

const Modal = ({ isOpen, onClose, children, 'aria-label': ariaLabel }: ModalProps) => {
  // 외부 스크롤 잠금
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  // ESC 키 닫기
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <ModalContext.Provider value={{ onClose }}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

        {/* Panel */}
        <div className="relative z-10 mx-4 w-full max-w-md rounded-xl bg-white shadow-xl">
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  )
}

// Header

interface ModalHeaderProps {
  title: string
}

const ModalHeader = ({ title }: ModalHeaderProps) => {
  const { onClose } = useModalContext()

  return (
    <div className="flex items-center justify-between border-b border-border px-6 py-4">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <Button variant="icon" size="sm" onClick={onClose} aria-label="닫기">
        <X size={18} />
      </Button>
    </div>
  )
}

// Content

interface ModalContentProps {
  children: ReactNode
  className?: string
}

const ModalContent = ({ children, className = '' }: ModalContentProps) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
)

// Footer

interface ModalFooterProps {
  children: ReactNode
}

const ModalFooter = ({ children }: ModalFooterProps) => (
  <div className="flex justify-end gap-2 border-t border-border px-6 py-4">{children}</div>
)

// Compound export

Modal.Header = ModalHeader
Modal.Content = ModalContent
Modal.Footer = ModalFooter

export default Modal
