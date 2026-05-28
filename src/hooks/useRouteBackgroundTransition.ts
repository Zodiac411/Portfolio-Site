import { useEffect, useRef, useState, type MutableRefObject } from 'react'
import gsap from 'gsap'
import {
  BACKGROUND_MOTION,
  profileForPath,
  resolveBackgroundPath,
  type RouteBackgroundProfile,
} from '../lib/backgroundMotion'
import type { RouteBackdropKey } from '../types'
import { MOBILE_MQ } from './useMobileLayout'

export interface RouteBackgroundTransitionState {
  fromPath: RouteBackdropKey
  toPath: RouteBackdropKey
  progressRef: MutableRefObject<number>
  isTransitioning: boolean
  fromProfile: RouteBackgroundProfile
  toProfile: RouteBackgroundProfile
  pulseToken: number
}

export function useRouteBackgroundTransition(
  pathname: string,
  reduced: boolean
): RouteBackgroundTransitionState {
  const [simplified, setSimplified] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(MOBILE_MQ).matches
  })
  const pathRef = useRef<RouteBackdropKey>(resolveBackgroundPath(pathname))
  const [fromPath, setFromPath] = useState<RouteBackdropKey>(pathRef.current)
  const [toPath, setToPath] = useState<RouteBackdropKey>(pathRef.current)
  const progressRef = useRef(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [pulseToken, setPulseToken] = useState(0)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  const fromProfile = profileForPath(fromPath, simplified)
  const toProfile = profileForPath(toPath, simplified)

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ)
    const onChange = () => setSimplified(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const next = resolveBackgroundPath(pathname)
    if (next === pathRef.current) return

    tweenRef.current?.kill()
    const prev = pathRef.current
    pathRef.current = next

    if (reduced) {
      setFromPath(next)
      setToPath(next)
      progressRef.current = 1
      setIsTransitioning(false)
      return
    }

    setFromPath(prev)
    setToPath(next)
    progressRef.current = 0
    setIsTransitioning(true)

    const proxy = { value: progressRef.current }
    tweenRef.current = gsap.to(proxy, {
      value: 1,
      duration: BACKGROUND_MOTION.bgTransitionDuration,
      ease: BACKGROUND_MOTION.bgTransitionEase,
      overwrite: true,
      onUpdate: () => {
        progressRef.current = proxy.value
      },
      onComplete: () => {
        progressRef.current = 1
        setFromPath(next)
        setIsTransitioning(false)
        setPulseToken((t) => t + 1)
      },
    })
  }, [pathname, reduced])

  useEffect(() => {
    return () => {
      tweenRef.current?.kill()
    }
  }, [])

  return {
    fromPath,
    toPath,
    progressRef,
    isTransitioning,
    fromProfile,
    toProfile,
    pulseToken,
  }
}
