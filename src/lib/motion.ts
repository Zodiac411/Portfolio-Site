import gsap from 'gsap'

export const MOTION = {
  panelIn: 0.38,
  panelOut: 0.16,
  panelStaggerIn: 0.06,
  panelStaggerOut: 0.035,
  routeBackdropOut: 0.2,
  routeBackdropIn: 0.35,
  routeBackdropEnter: 0.5,
  routePulseMs: 700,
  bgTransitionDuration: 0.45,
  bgTransitionIn: 0.45,
  bgTransitionOut: 0.45,
  panelHeaderIn: 0.45,
  panelHeaderScan: 0.5,
  menuSelectorMove: 0.22,
  menuSelectorEase: 'power3.out',
  parallaxDuration: 0.4,
  easeSnap: 'power3.out',
  easeOut: 'power2.out',
  easeIn: 'power2.in',
} as const

export function prefersReduced(reduced?: boolean): boolean {
  if (reduced !== undefined) return reduced
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    localStorage.getItem('hellstar-reduce-motion') === 'true'
  )
}

export function panelFragmentSurfaces(root: HTMLElement | null): HTMLElement[] {
  if (!root) return []
  return Array.from(root.querySelectorAll<HTMLElement>('.panel-fragment__surface'))
}

export function animatePanelFragments(
  root: HTMLElement | null,
  mode: 'in' | 'out',
  reduced?: boolean
): gsap.core.Timeline | null {
  if (prefersReduced(reduced)) return null
  const surfaces = panelFragmentSurfaces(root)
  if (!surfaces.length) return null

  if (mode === 'out') {
    return gsap.timeline().to(surfaces, {
      opacity: 0,
      duration: MOTION.panelOut,
      stagger: MOTION.panelStaggerOut,
      ease: MOTION.easeIn,
    })
  }

  return gsap.timeline().fromTo(
    surfaces,
    { opacity: 0 },
    {
      opacity: 1,
      duration: MOTION.panelIn,
      stagger: MOTION.panelStaggerIn,
      ease: MOTION.easeSnap,
      delay: 0.03,
    }
  )
}
