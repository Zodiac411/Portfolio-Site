import type { ReactNode } from 'react'

type FragmentVariant = 1 | 2 | 3 | 4 | 5 | 6

interface PanelFragmentProps {
  children: ReactNode
  variant?: FragmentVariant
  className?: string
}

export function PanelFragment({
  children,
  variant = 1,
  className = '',
}: PanelFragmentProps) {
  return (
    <div
      className={`panel-fragment panel-fragment--${variant} ${className}`.trim()}
    >
      <div className="panel-fragment__surface">{children}</div>
    </div>
  )
}
