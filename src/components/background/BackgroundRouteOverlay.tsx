import { useMotionPreference } from '../../hooks/useReducedMotion'
import { routeClassSuffix } from '../../lib/backgroundMotion'

interface BackgroundRouteOverlayProps {
  pathname: string
}

export function BackgroundRouteOverlay({ pathname }: BackgroundRouteOverlayProps) {
  const { reduced } = useMotionPreference()
  const routeClass = routeClassSuffix(pathname)

  if (reduced) return null

  return (
    <div className={`bg-route-overlay bg-route-overlay--${routeClass}`} aria-hidden>
      <div className="bg-route-overlay__layer bg-route-overlay__layer--home" />
      <div className="bg-route-overlay__layer bg-route-overlay__layer--projects" />
      <div className="bg-route-overlay__layer bg-route-overlay__layer--resume" />
      <div className="bg-route-overlay__layer bg-route-overlay__layer--contact" />
    </div>
  )
}
