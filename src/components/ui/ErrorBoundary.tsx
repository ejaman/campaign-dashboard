'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm" role="alert">
              데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
            </p>
          </div>
        )
      )
    }
    return this.props.children
  }
}
