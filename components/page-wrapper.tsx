import type React from "react"
interface PageWrapperProps {
  children: React.ReactNode
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="mx-auto max-w-[1400px] border-x border-border min-h-[calc(100vh-4rem)]">
      <div className="px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  )
}

