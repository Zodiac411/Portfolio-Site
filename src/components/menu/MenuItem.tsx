import type { CSSProperties } from 'react'
import type { MenuItemData } from '../../types'

interface MenuItemProps {
  item: MenuItemData
  isPreview: boolean
  isRouteActive: boolean
  isRouteOnlyHighlight?: boolean
  currentRoute: boolean
  onSelect: () => void
  onActivate: () => void
  itemRef?: (el: HTMLButtonElement | null) => void
}

export function MenuItem({
  item,
  isPreview,
  isRouteActive,
  isRouteOnlyHighlight = false,
  currentRoute,
  onSelect,
  onActivate,
  itemRef,
}: MenuItemProps) {
  const classes = [
    'menu-item',
    isPreview && 'menu-item--preview',
    isRouteActive && 'menu-item--route-active',
    isRouteOnlyHighlight && 'menu-item--route-only',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      ref={itemRef}
      className={classes}
      onClick={onSelect}
      onFocus={onActivate}
      onMouseEnter={onActivate}
      aria-current={currentRoute ? 'page' : undefined}
      aria-label={item.label}
      style={
        {
          '--item-offset-x': `${item.offsetX}px`,
          '--item-offset-y': `${item.offsetY}px`,
          '--item-rotate': `${item.rotate}deg`,
        } as CSSProperties
      }
    >
      <span className="menu-item__bar" aria-hidden />
      <span className={`menu-item__label menu-item__label--cyan-${item.cyan}`}>
        {item.label}
      </span>
    </button>
  )
}
