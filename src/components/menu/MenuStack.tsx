import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useMobileLayout } from '../../hooks/useMobileLayout'
import { useMotionPreference } from '../../hooks/useReducedMotion'
import { MOTION } from '../../lib/motion'
import type { MenuItemData } from '../../types'
import { MenuItem } from './MenuItem'
import { MenuSelector } from './MenuSelector'

const RESIZE_DEBOUNCE_MS = 150

interface MenuStackProps {
  items: MenuItemData[]
  routeIndex: number
  pathname: string
  isPanelOpen: boolean
  onNavigateToIndex: (index: number) => void
  onClosePanel: () => void
  entryReady?: boolean
}

type SelectorMovers = {
  x: gsap.QuickToFunc
  y: gsap.QuickToFunc
  width: gsap.QuickToFunc
  rotation: gsap.QuickToFunc
}

export function MenuStack({
  items,
  routeIndex,
  pathname,
  isPanelOpen,
  onNavigateToIndex,
  onClosePanel,
  entryReady = true,
}: MenuStackProps) {
  const stackRef = useRef<HTMLDivElement>(null)
  const selectorRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const moversRef = useRef<SelectorMovers | null>(null)
  const resizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const routeIndexRef = useRef(routeIndex)
  const canAnimate = useRef(false)
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [selectorReady, setSelectorReady] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(routeIndex)
  const previewIndexRef = useRef(previewIndex)
  const hasPlayedEntry = useRef(false)
  const isMobile = useMobileLayout()
  const { reduced } = useMotionPreference()

  routeIndexRef.current = routeIndex
  previewIndexRef.current = previewIndex

  useLayoutEffect(() => {
    setPreviewIndex(routeIndex)
  }, [routeIndex])

  const setPreviewIndexClamped = useCallback((index: number) => {
    const next = Math.max(0, Math.min(items.length - 1, index))
    setPreviewIndex((prev) => (prev === next ? prev : next))
  }, [items.length])

  const measureTarget = useCallback((index: number) => {
    const el = itemRefs.current[index]
    const stack = stackRef.current
    const sel = selectorRef.current
    if (!el || !stack || !sel) return null

    const stackRect = stack.getBoundingClientRect()
    const itemRect = el.getBoundingClientRect()
    if (itemRect.height < 1 || itemRect.width < 1) return null

    const selHeight = sel.offsetHeight || itemRect.height

    return {
      x: itemRect.left - stackRect.left,
      y: itemRect.top - stackRect.top + (itemRect.height - selHeight) / 2,
      width: itemRect.width,
      rotation: items[index]?.rotate ?? 0,
    }
  }, [items])

  const ensureMovers = useCallback((sel: HTMLDivElement): SelectorMovers => {
    if (moversRef.current) return moversRef.current

    const duration = MOTION.menuSelectorMove
    const ease = MOTION.menuSelectorEase

    moversRef.current = {
      x: gsap.quickTo(sel, 'x', { duration, ease }),
      y: gsap.quickTo(sel, 'y', { duration, ease }),
      width: gsap.quickTo(sel, 'width', { duration, ease }),
      rotation: gsap.quickTo(sel, 'rotation', { duration, ease }),
    }
    return moversRef.current
  }, [])

  const moveSelectorTo = useCallback(
    (index: number, immediate: boolean) => {
      if (isMobile) {
        setSelectorReady(true)
        return
      }

      const sel = selectorRef.current
      const target = measureTarget(index)
      if (!sel || !target) return

      gsap.set(sel, { transformOrigin: 'left center', force3D: true })

      if (immediate || reduced || !canAnimate.current) {
        gsap.set(sel, {
          x: target.x,
          y: target.y,
          width: target.width,
          rotation: target.rotation,
        })
      } else {
        const movers = ensureMovers(sel)
        movers.x(target.x)
        movers.y(target.y)
        movers.width(target.width)
        movers.rotation(target.rotation)
      }

      setSelectorReady(true)
    },
    [measureTarget, reduced, ensureMovers, isMobile]
  )

  const handleActivate = useCallback(
    (index: number) => {
      if (index === previewIndexRef.current) return
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current)
        leaveTimerRef.current = null
      }
      setPreviewIndexClamped(index)
    },
    [setPreviewIndexClamped]
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          setPreviewIndexClamped(previewIndexRef.current - 1)
          break
        case 'ArrowDown':
          e.preventDefault()
          setPreviewIndexClamped(previewIndexRef.current + 1)
          break
        case 'Enter':
          e.preventDefault()
          onNavigateToIndex(previewIndexRef.current)
          break
        case 'Escape':
          e.preventDefault()
          if (isPanelOpen) onClosePanel()
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setPreviewIndexClamped, onNavigateToIndex, onClosePanel, isPanelOpen])

  useLayoutEffect(() => {
    if (!entryReady) return
    moveSelectorTo(previewIndex, !canAnimate.current)
  }, [previewIndex, entryReady, moveSelectorTo])

  useEffect(() => {
    if (!entryReady || isMobile) return

    const onResize = () => {
      if (resizeTimer.current) clearTimeout(resizeTimer.current)
      resizeTimer.current = setTimeout(() => {
        resizeTimer.current = null
        moveSelectorTo(previewIndexRef.current, true)
      }, RESIZE_DEBOUNCE_MS)
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      if (resizeTimer.current) clearTimeout(resizeTimer.current)
    }
  }, [entryReady, moveSelectorTo, isMobile])

  useGSAP(
    () => {
      if (!entryReady || !stackRef.current || hasPlayedEntry.current) return
      const targets = stackRef.current.querySelectorAll('.menu-item')

      const revealSelector = () => {
        canAnimate.current = true
        moveSelectorTo(previewIndexRef.current, true)
      }

      if (reduced) {
        gsap.set(targets, { opacity: 1 })
        hasPlayedEntry.current = true
        revealSelector()
        return
      }

      gsap.fromTo(
        targets,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
          onComplete: () => {
            hasPlayedEntry.current = true
            requestAnimationFrame(() => {
              requestAnimationFrame(revealSelector)
            })
          },
        }
      )
    },
    { dependencies: [entryReady, reduced, moveSelectorTo], scope: stackRef }
  )

  const cancelLeaveReset = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current)
      leaveTimerRef.current = null
    }
  }, [])

  const handlePointerLeave = (e: React.PointerEvent<HTMLElement>) => {
    const next = e.relatedTarget as Node | null
    if (next && stackRef.current?.contains(next)) return

    cancelLeaveReset()
    leaveTimerRef.current = setTimeout(() => {
      leaveTimerRef.current = null
      if (previewIndexRef.current !== routeIndexRef.current) {
        setPreviewIndexClamped(routeIndexRef.current)
      }
    }, 100)
  }

  useEffect(
    () => () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current)
    },
    []
  )

  return (
    <nav
      className="menu-stack"
      ref={stackRef}
      aria-label="Portfolio sections"
      onPointerEnter={cancelLeaveReset}
      onPointerLeave={handlePointerLeave}
    >
      <MenuSelector
        ref={selectorRef}
        ready={entryReady && selectorReady}
      />
      <div className="menu-stack__items">
        {items.map((item, index) => (
          <MenuItem
            key={item.id}
            item={item}
            isPreview={previewIndex === index}
            isRouteActive={pathname === item.route}
            isRouteOnlyHighlight={
              pathname === item.route && previewIndex !== index
            }
            currentRoute={pathname === item.route}
            itemRef={(el) => {
              itemRefs.current[index] = el
            }}
            onSelect={() => {
              setPreviewIndexClamped(index)
              onNavigateToIndex(index)
            }}
            onActivate={() => handleActivate(index)}
          />
        ))}
      </div>
    </nav>
  )
}
