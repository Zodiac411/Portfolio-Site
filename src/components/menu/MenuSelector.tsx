import { forwardRef } from 'react'

interface MenuSelectorProps {
  ready: boolean
}

export const MenuSelector = forwardRef<HTMLDivElement, MenuSelectorProps>(
  function MenuSelector({ ready }, ref) {
    const classes = ['menu-selector', ready && 'menu-selector--ready']
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={ref} className={classes} aria-hidden>
        <div className="menu-selector__pink" />
        <div className="menu-selector__white" />
      </div>
    )
  }
)
