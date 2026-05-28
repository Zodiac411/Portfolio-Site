import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useMotionPreference } from '../../hooks/useReducedMotion'
import { MOBILE_MQ } from '../../hooks/useMobileLayout'
import type { RouteBackgroundTransitionState } from '../../hooks/useRouteBackgroundTransition'
import {
  BACKGROUND_MOTION,
  lerpProfile,
  routeClassSuffix,
  scaleProfileForViewport,
} from '../../lib/backgroundMotion'
import {
  drawProfileScene,
  drawRoutePulse,
  drawTransitionWipe,
  readCssVar,
} from '../../lib/backgroundCanvas'

const RESIZE_DEBOUNCE_MS = 150

interface Accent {
  kind: 'tick' | 'bar'
  x: number
  y: number
  h?: number
  w?: number
}

interface CommandBackgroundProps {
  pathname: string
  transition: RouteBackgroundTransitionState
}

const BASE_ACCENTS: Accent[] = [
  { kind: 'tick', x: 8, y: 12, h: 28 },
  { kind: 'tick', x: 92, y: 45, h: 40 },
  { kind: 'tick', x: 4, y: 72, h: 22 },
  { kind: 'bar', x: 15, y: 28, w: 48 },
  { kind: 'bar', x: 78, y: 62, w: 36 },
  { kind: 'bar', x: 22, y: 85, w: 64 },
]

const WIDE_ACCENTS: Accent[] = [
  { kind: 'tick', x: 88, y: 18, h: 32 },
  { kind: 'bar', x: 72, y: 38, w: 52 },
]

export function CommandBackground({ pathname, transition }: CommandBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const accentsRef = useRef<HTMLDivElement>(null)
  const routePulseRef = useRef(0)
  const transitionRef = useRef(transition)
  const highlightPhaseRef = useRef(0)
  const fieldBlueRef = useRef('#0e45c4')
  const accentTweensRef = useRef<gsap.core.Tween[]>([])
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { reduced } = useMotionPreference()
  const routeClass = routeClassSuffix(pathname)

  transitionRef.current = transition

  const refreshFieldBlue = () => {
    fieldBlueRef.current = readCssVar('--field-blue', '#0e45c4')
  }

  useEffect(() => {
    if (reduced) return
    routePulseRef.current = transition.toProfile.pulse.intensity
  }, [pathname, reduced, transition.toProfile.pulse.intensity])

  useEffect(() => {
    if (reduced) return
    routePulseRef.current = Math.max(
      routePulseRef.current,
      transition.toProfile.pulse.intensity
    )
  }, [transition.pulseToken, reduced, transition.toProfile.pulse.intensity])

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let lastTs = performance.now()
    let dpr = 1
    const cfg = BACKGROUND_MOTION

    const resolveDpr = () => {
      const mobile = window.matchMedia(MOBILE_MQ).matches
      return mobile ? 1 : Math.min(window.devicePixelRatio || 1, 2)
    }

    const viewportSize = () => {
      const root = rootRef.current
      const rect = root
        ? root.getBoundingClientRect()
        : canvas.getBoundingClientRect()
      return {
        width: Math.max(rect.width, window.innerWidth),
        height: Math.max(rect.height, window.innerHeight),
      }
    }

    const resize = () => {
      dpr = resolveDpr()
      const { width, height } = viewportSize()
      canvas.width = Math.ceil(width * dpr)
      canvas.height = Math.ceil(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      refreshFieldBlue()
    }

    const scheduleResize = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current)
      resizeTimerRef.current = setTimeout(() => {
        resizeTimerRef.current = null
        resize()
      }, RESIZE_DEBOUNCE_MS)
    }

    const draw = (ts: number) => {
      if (document.hidden) {
        raf = 0
        return
      }
      const dt = Math.min(ts - lastTs, 48)
      lastTs = ts
      const tSec = ts / 1000

      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const tr = transitionRef.current
      const progress = tr.progressRef.current
      const fromP = scaleProfileForViewport(tr.fromProfile, w)
      const toP = scaleProfileForViewport(tr.toProfile, w)
      const blended = scaleProfileForViewport(
        lerpProfile(fromP, toP, progress),
        w
      )

      ctx.fillStyle = fieldBlueRef.current
      ctx.fillRect(0, 0, w, h)

      if (progress < 0.999 && tr.isTransitioning) {
        drawProfileScene(ctx, w, h, tSec, fromP, highlightPhaseRef, 1 - progress)
        drawProfileScene(ctx, w, h, tSec, toP, highlightPhaseRef, progress)
        drawTransitionWipe(ctx, w, h, progress)
      } else {
        drawProfileScene(ctx, w, h, tSec, blended, highlightPhaseRef, 1)
      }

      let pulse = routePulseRef.current
      if (pulse > 0) {
        const decay = dt / cfg.routePulseDecayMs
        routePulseRef.current = Math.max(0, pulse - decay)
        drawRoutePulse(ctx, w, h, pulse, blended)
      }

      raf = requestAnimationFrame(draw)
    }

    const pauseAccentTweens = () => {
      accentTweensRef.current.forEach((t) => t.pause())
    }

    const resumeAccentTweens = () => {
      accentTweensRef.current.forEach((t) => t.resume())
    }

    const onVisibility = () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf)
        raf = 0
        pauseAccentTweens()
      } else {
        resumeAccentTweens()
        if (!raf) {
          lastTs = performance.now()
          raf = requestAnimationFrame(draw)
        }
      }
    }

    dpr = resolveDpr()
    refreshFieldBlue()
    resize()
    requestAnimationFrame(() => resize())
    lastTs = performance.now()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', scheduleResize)
    window.visualViewport?.addEventListener('resize', scheduleResize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current)
      window.removeEventListener('resize', scheduleResize)
      window.visualViewport?.removeEventListener('resize', scheduleResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced])

  useGSAP(
    () => {
      if (reduced || !accentsRef.current) return
      const ticks = accentsRef.current.querySelectorAll('.command-bg__tick')
      const bars = accentsRef.current.querySelectorAll('.command-bg__bar')
      const mult = transition.toProfile.accentMotionMultiplier
      const cfg = BACKGROUND_MOTION

      const tweens: gsap.core.Tween[] = []

      tweens.push(
        gsap.to(ticks, {
          y: `+=${18 * mult}`,
          duration: 4 / mult,
          ease: 'none',
          repeat: -1,
          stagger: { each: 0.4, from: 'random' },
        })
      )
      tweens.push(
        gsap.to(bars, {
          x: `+=${12 * mult}`,
          duration: 5 / mult,
          ease: 'none',
          repeat: -1,
          stagger: { each: 0.5, from: 'random' },
        })
      )

      const targets = [...ticks, ...bars]
      gsap.set(targets, { opacity: cfg.accentOpacityMin })
      tweens.push(
        gsap.to(targets, {
          opacity: cfg.accentOpacityMax,
          duration: cfg.accentBreatheDuration,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          stagger: {
            each: cfg.accentBreatheStagger,
            from: 'random',
          },
        })
      )

      accentTweensRef.current = tweens
      if (document.hidden) {
        tweens.forEach((t) => t.pause())
      }

      return () => {
        accentTweensRef.current = []
      }
    },
    { dependencies: [reduced, transition.toPath], scope: rootRef }
  )

  useGSAP(
    () => {
      if (reduced || !accentsRef.current || document.hidden) return
      const ticks = accentsRef.current.querySelectorAll('.command-bg__tick')
      const bars = accentsRef.current.querySelectorAll('.command-bg__bar')
      const cfg = BACKGROUND_MOTION
      const targets = [...ticks, ...bars]

      gsap.fromTo(
        targets,
        { scale: 1 },
        {
          scale: cfg.accentSnapScale,
          duration: cfg.accentSnapDuration * 0.45,
          ease: 'power2.out',
          stagger: { each: 0.03, from: 'center' },
          yoyo: true,
          repeat: 1,
        }
      )
    },
    { dependencies: [transition.pulseToken, reduced], scope: rootRef, revertOnUpdate: true }
  )

  const accentList = [...BASE_ACCENTS, ...WIDE_ACCENTS]

  if (reduced) {
    return (
      <div
        className={`command-bg command-bg--static command-bg--route-${routeClass}`}
        aria-hidden
      />
    )
  }

  return (
    <div
      ref={rootRef}
      className={`command-bg command-bg--route-${routeClass}`.trim()}
      aria-hidden
    >
      <canvas ref={canvasRef} />
      <div ref={accentsRef} className="command-bg__accents">
        {accentList.map((a, i) =>
          a.kind === 'tick' ? (
            <span
              key={i}
              className="command-bg__tick"
              style={{ left: `${a.x}%`, top: `${a.y}%`, height: `${a.h}px` }}
            />
          ) : (
            <span
              key={i}
              className="command-bg__bar"
              style={{ left: `${a.x}%`, top: `${a.y}%`, width: `${a.w}px` }}
            />
          )
        )}
      </div>
    </div>
  )
}
