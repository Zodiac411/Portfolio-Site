import { useEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'
import { MOTION } from '../lib/motion'

const DESKTOP_MQ = '(min-width: 768px)'

export function usePanelParallax(
  hostRef: RefObject<HTMLElement | null>,
  reduced: boolean,
  disabled = false
) {
  const quickX = useRef<gsap.QuickToFunc | null>(null)
  const quickY = useRef<gsap.QuickToFunc | null>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host || reduced || disabled) {
      host?.querySelectorAll('.panel-fragment__surface').forEach((el) => {
        gsap.set(el, { x: 0, y: 0 })
      })
      return
    }

    const mq = window.matchMedia(DESKTOP_MQ)
    if (!mq.matches) return

    const surfaces = host.querySelectorAll<HTMLElement>('.panel-fragment__surface')
    if (!surfaces.length) return

    quickX.current = gsap.quickTo(surfaces, 'x', {
      duration: MOTION.parallaxDuration,
      ease: 'power2.out',
    })
    quickY.current = gsap.quickTo(surfaces, 'y', {
      duration: MOTION.parallaxDuration,
      ease: 'power2.out',
    })

    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width - 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5
      quickX.current?.(nx * 3)
      quickY.current?.(ny * 2)
    }

    const onLeave = () => {
      quickX.current?.(0)
      quickY.current?.(0)
    }

    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)
    return () => {
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
      onLeave()
      quickX.current = null
      quickY.current = null
    }
  }, [hostRef, reduced, disabled])
}
