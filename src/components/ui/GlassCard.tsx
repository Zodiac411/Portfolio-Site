import { Children, isValidElement, type ReactElement, type ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  variant?: 'paper' | 'ink'
  /** Split content into offset floating shards (default on). */
  fragmented?: boolean
  /** Transparent fragment surfaces on the blue grid (default when fragmented). */
  open?: boolean
}

function isSrOnlyElement(child: ReactNode): boolean {
  if (!isValidElement(child)) return false
  const el = child as ReactElement<{ className?: string }>
  const cn = el.props?.className
  return typeof cn === 'string' && cn.split(/\s+/).includes('sr-only')
}

export function GlassCard({
  children,
  className = '',
  variant = 'paper',
  fragmented = true,
  open = true,
}: GlassCardProps) {
  const variantClass = variant === 'ink' ? 'panel-slab--ink' : ''
  const openClass = fragmented && open !== false ? 'panel-slab--open' : ''
  const base = `panel-slab ${variantClass} ${fragmented ? 'panel-slab--fragmented' : ''} ${openClass} ${className}`.trim()

  if (!fragmented) {
    return <div className={base}>{children}</div>
  }

  let shard = 0
  return (
    <div className={base}>
      {Children.map(children, (child) => {
        if (child == null || isSrOnlyElement(child)) return child
        shard += 1
        const mod = ((shard - 1) % 6) + 1
        return (
          <div key={shard} className={`panel-fragment panel-fragment--${mod}`}>
            <div className="panel-fragment__surface">{child}</div>
          </div>
        )
      })}
    </div>
  )
}
