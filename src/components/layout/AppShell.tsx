import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { BackgroundRouteOverlay } from '../background/BackgroundRouteOverlay'
import { CommandBackground } from '../background/CommandBackground'
import { RouteBackdrop } from '../background/RouteBackdrop'
import { useMenuNavigation } from '../../hooks/useMenuNavigation'
import { useCompactShell } from '../../hooks/useMobileLayout'
import { useMotionPreference } from '../../hooks/useReducedMotion'
import { useRouteBackgroundTransition } from '../../hooks/useRouteBackgroundTransition'
import { backdropWordForPath } from '../../lib/routeBackdrop'
import { SideGlyph } from './SideGlyph'
import { ShellTopbar } from './ShellTopbar'
import { MenuStack } from '../menu/MenuStack'
import { SubPanelHost } from './SubPanelHost'

export function AppShell() {
  const shellRef = useRef<HTMLDivElement>(null)
  const glyphRef = useRef<HTMLElement>(null)
  const [entryReady, setEntryReady] = useState(false)
  const { reduced } = useMotionPreference()
  const showSideRail = !useCompactShell()
  const location = useLocation()
  const backdropWord = backdropWordForPath(location.pathname)
  const bgTransition = useRouteBackgroundTransition(location.pathname, reduced)
  const isHome = location.pathname === '/'
  const {
    items,
    routeIndex,
    pathname,
    navigateToIndex,
    closePanel,
    isPanelOpen,
  } = useMenuNavigation()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: reduce)', () => {
        setEntryReady(true)
      })
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (reduced) {
          setEntryReady(true)
          return
        }
        const tl = gsap.timeline({
          onComplete: () => setEntryReady(true),
        })
        if (showSideRail && glyphRef.current) {
          tl.fromTo(
            glyphRef.current,
            { x: -48, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
          )
        }
      })
      return () => mm.revert()
    },
    { dependencies: [reduced, showSideRail], scope: shellRef }
  )

  const backgroundLayers = (
    <>
      <CommandBackground pathname={location.pathname} transition={bgTransition} />
      <BackgroundRouteOverlay pathname={location.pathname} />
      <RouteBackdrop
        word={backdropWord}
        pathname={location.pathname}
        transition={bgTransition}
      />
    </>
  )

  return (
    <>
      {createPortal(backgroundLayers, document.body)}
      <div
        ref={shellRef}
        className={`app-shell ${isHome ? 'app-shell--home' : 'app-shell--section'}`.trim()}
      >
        <ShellTopbar />
        <div className="app-shell__cluster">
          {showSideRail && <SideGlyph ref={glyphRef} />}
          <div className="menu-zone">
            <MenuStack
              items={items}
              routeIndex={routeIndex}
              pathname={pathname}
              isPanelOpen={isPanelOpen}
              onNavigateToIndex={navigateToIndex}
              onClosePanel={closePanel}
              entryReady={entryReady}
            />
          </div>
          <SubPanelHost />
        </div>
      </div>
    </>
  )
}
