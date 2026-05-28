import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useMotionPreference } from '../../hooks/useReducedMotion'
import type { RouteBackgroundTransitionState } from '../../hooks/useRouteBackgroundTransition'
import { BACKGROUND_MOTION, routeClassSuffix } from '../../lib/backgroundMotion'
import { MOTION } from '../../lib/motion'

const DESKTOP_MQ = '(min-width: 768px)'

interface RouteBackdropProps {
  word: string
  pathname: string
  transition: RouteBackgroundTransitionState
}

export function RouteBackdrop({ word, pathname, transition }: RouteBackdropProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLParagraphElement>(null)
  const quickX = useRef<gsap.QuickToFunc | null>(null)
  const quickY = useRef<gsap.QuickToFunc | null>(null)
  const { reduced } = useMotionPreference()
  const routeClass = routeClassSuffix(pathname)
  const [displayWord, setDisplayWord] = useState(word)

  useEffect(() => {
    if (word === displayWord) return
    if (reduced) {
      setDisplayWord(word)
      return
    }
    const el = wordRef.current
    if (!el) {
      setDisplayWord(word)
      return
    }
    gsap.killTweensOf(el)
    gsap.to(el, {
      opacity: 0,
      x: 28,
      duration: MOTION.routeBackdropOut,
      ease: MOTION.easeIn,
    })
  }, [word, displayWord, reduced])

  useEffect(() => {
    if (transition.isTransitioning) return
    if (word === displayWord) return
    const el = wordRef.current
    if (!el) {
      setDisplayWord(word)
      return
    }
    if (reduced) {
      setDisplayWord(word)
      return
    }
    setDisplayWord(word)
    gsap.killTweensOf(el)
    gsap.fromTo(
      el,
      { opacity: 0, x: -36 },
      {
        x: '-8%',
        opacity: routeClass === 'home' ? 0.06 : 0.04,
        duration: MOTION.routeBackdropIn,
        ease: MOTION.easeOut,
      }
    )
  }, [transition.isTransitioning, transition.pulseToken, word, displayWord, reduced, routeClass])

  useEffect(() => {
    const el = wordRef.current
    if (!el || reduced) {
      if (el) gsap.set(el, { xPercent: 0, yPercent: 0 })
      return
    }

    const mq = window.matchMedia(DESKTOP_MQ)
    if (!mq.matches) return

    const cfg = BACKGROUND_MOTION
    quickX.current = gsap.quickTo(el, 'xPercent', {
      duration: cfg.backdropParallaxDuration,
      ease: 'power2.out',
    })
    quickY.current = gsap.quickTo(el, 'yPercent', {
      duration: cfg.backdropParallaxDuration,
      ease: 'power2.out',
    })

    const onMove = (e: PointerEvent) => {
      const rect = document.documentElement.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width - 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5
      quickX.current?.(nx * cfg.backdropParallaxXPercent)
      quickY.current?.(ny * cfg.backdropParallaxYPercent)
    }

    const onLeave = () => {
      quickX.current?.(0)
      quickY.current?.(0)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      onLeave()
      quickX.current = null
      quickY.current = null
    }
  }, [reduced, displayWord])

  useGSAP(
    () => {
      if (!wordRef.current || reduced) return
      if (displayWord !== word) return
      gsap.fromTo(
        wordRef.current,
        { x: '-14%', opacity: 0, xPercent: 0, yPercent: 0 },
        {
          x: '-8%',
          opacity: routeClass === 'home' ? 0.06 : 0.04,
          duration:
            displayWord === 'CHRIS FOLORUNSO'
              ? MOTION.routeBackdropEnter
              : MOTION.routeBackdropIn,
          ease: MOTION.easeOut,
        }
      )
    },
    { dependencies: [displayWord, pathname, reduced, routeClass], scope: rootRef, revertOnUpdate: true }
  )

  return (
    <div
      ref={rootRef}
      className={`route-backdrop route-backdrop--${routeClass}`.trim()}
      aria-hidden
    >
      <p ref={wordRef} className="route-backdrop__word">
        {displayWord}
      </p>
    </div>
  )
}
