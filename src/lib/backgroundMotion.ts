import type { RouteBackdropKey } from '../types'

/** Tunable shared canvas + accent background motion */
export const BACKGROUND_MOTION = {
  gridStep: 56,
  breathePeriodSec: 16,
  gridOpacityMin: 0.04,
  gridOpacityMax: 0.09,
  gridOffsetAmp: 1.5,
  cyanHighlightOpacity: 0.08,
  cyanHighlightIntervalSec: 7,

  scanBandHeightRatio: 0.08,
  scanBandPeriodSec: 21,
  scanBandOpacity: 0.05,

  routePulseDecayMs: 700,

  accentOpacityMin: 0.35,
  accentOpacityMax: 0.55,
  accentBreatheDuration: 4,
  accentBreatheStagger: 0.35,
  accentSnapScale: 1.06,
  accentSnapDuration: 0.22,

  backdropParallaxDuration: 0.4,
  backdropParallaxXPercent: 2,
  backdropParallaxYPercent: 1,

  bgTransitionDuration: 0.45,
  bgTransitionEase: 'power2.inOut',
  bgWipePeakOpacity: 0.22,
} as const

export const CYAN_RGB = '24, 216, 255'
export const PINK_RGB = '255, 47, 95'

export type PulseEdge = 'left' | 'right' | 'center'

export type RoutePulseProfile = {
  intensity: number
  peak: number
}

export type RouteBackgroundProfile = {
  gridStep: number
  breathePeriodSec: number
  gridOpacityMin: number
  gridOpacityMax: number
  gridOffsetAmp: number
  cyanHighlightOpacity: number
  cyanHighlightIntervalSec: number
  scanBandHeightRatio: number
  scanBandPeriodSec: number
  scanBandOpacity: number
  /** true = vertical drift, false = horizontal */
  scanVertical: boolean
  /** 0 = orthogonal grid; >0 adds diagonal emphasis */
  gridDiagonalBias: number
  pulseEdge: PulseEdge
  pulse: RoutePulseProfile
  timelineLines: boolean
  radialPing: boolean
  vignetteInk: boolean
  pinkPulseMix: number
  accentMotionMultiplier: number
}

const DEFAULT_PULSE: RoutePulseProfile = { intensity: 1, peak: 1 }

const BASE_PROFILE: RouteBackgroundProfile = {
  gridStep: BACKGROUND_MOTION.gridStep,
  breathePeriodSec: BACKGROUND_MOTION.breathePeriodSec,
  gridOpacityMin: BACKGROUND_MOTION.gridOpacityMin,
  gridOpacityMax: BACKGROUND_MOTION.gridOpacityMax,
  gridOffsetAmp: BACKGROUND_MOTION.gridOffsetAmp,
  cyanHighlightOpacity: BACKGROUND_MOTION.cyanHighlightOpacity,
  cyanHighlightIntervalSec: BACKGROUND_MOTION.cyanHighlightIntervalSec,
  scanBandHeightRatio: BACKGROUND_MOTION.scanBandHeightRatio,
  scanBandPeriodSec: BACKGROUND_MOTION.scanBandPeriodSec,
  scanBandOpacity: BACKGROUND_MOTION.scanBandOpacity,
  scanVertical: true,
  gridDiagonalBias: 0,
  pulseEdge: 'right',
  pulse: DEFAULT_PULSE,
  timelineLines: false,
  radialPing: false,
  vignetteInk: false,
  pinkPulseMix: 0,
  accentMotionMultiplier: 1,
}

/** Per-route idle canvas profiles */
export const ROUTE_BACKGROUND_PROFILES: Record<RouteBackdropKey, RouteBackgroundProfile> = {
  '/': {
    ...BASE_PROFILE,
    breathePeriodSec: 18,
    gridOpacityMin: 0.035,
    gridOpacityMax: 0.075,
    gridOffsetAmp: 1.1,
    scanBandPeriodSec: 26,
    scanBandOpacity: 0.04,
    pulseEdge: 'left',
    pulse: { intensity: 0.55, peak: 0.75 },
    accentMotionMultiplier: 0.85,
  },
  '/projects': {
    ...BASE_PROFILE,
    breathePeriodSec: 12,
    gridOpacityMin: 0.05,
    gridOpacityMax: 0.1,
    gridOffsetAmp: 2,
    scanBandPeriodSec: 14,
    scanBandOpacity: 0.07,
    gridDiagonalBias: 0.35,
    pulseEdge: 'right',
    pulse: { intensity: 1.25, peak: 1.15 },
    accentMotionMultiplier: 1.35,
  },
  '/resume': {
    ...BASE_PROFILE,
    breathePeriodSec: 20,
    gridOpacityMin: 0.03,
    gridOpacityMax: 0.065,
    gridOffsetAmp: 0.9,
    scanBandPeriodSec: 28,
    scanBandOpacity: 0.035,
    scanVertical: true,
    pulseEdge: 'left',
    pulse: { intensity: 0.95, peak: 1 },
    timelineLines: true,
    vignetteInk: true,
    accentMotionMultiplier: 0.75,
  },
  '/contact': {
    ...BASE_PROFILE,
    breathePeriodSec: 14,
    gridOpacityMin: 0.045,
    gridOpacityMax: 0.095,
    gridOffsetAmp: 1.6,
    scanBandPeriodSec: 16,
    scanBandOpacity: 0.055,
    scanVertical: false,
    pulseEdge: 'center',
    pulse: { intensity: 1.1, peak: 1.05 },
    radialPing: true,
    pinkPulseMix: 0.45,
    accentMotionMultiplier: 1.15,
  },
}

/** Mobile / perf: grid + scan + pulse only */
export function simplifyProfile(profile: RouteBackgroundProfile): RouteBackgroundProfile {
  return {
    ...profile,
    timelineLines: false,
    radialPing: false,
    vignetteInk: false,
    gridDiagonalBias: profile.gridDiagonalBias * 0.5,
    pinkPulseMix: profile.pinkPulseMix * 0.5,
  }
}

export function resolveBackgroundPath(pathname: string): RouteBackdropKey {
  if (pathname in ROUTE_BACKGROUND_PROFILES) return pathname as RouteBackdropKey
  return '/'
}

export function profileForPath(pathname: string, simplified = false): RouteBackgroundProfile {
  const key = resolveBackgroundPath(pathname)
  const profile = ROUTE_BACKGROUND_PROFILES[key]
  return simplified ? simplifyProfile(profile) : profile
}

/** Viewport-scaled grid density and slightly stronger lines on wide screens */
export function scaleProfileForViewport(
  profile: RouteBackgroundProfile,
  width: number
): RouteBackgroundProfile {
  const gridStep = Math.max(40, Math.min(72, Math.floor(width / 40)))
  const wideBoost = width >= 1800 ? 1.18 : width >= 1400 ? 1.12 : width >= 1200 ? 1.06 : 1
  return {
    ...profile,
    gridStep,
    gridOpacityMin: profile.gridOpacityMin * wideBoost,
    gridOpacityMax: Math.min(0.12, profile.gridOpacityMax * wideBoost),
  }
}

function lerpNum(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function lerpProfile(
  from: RouteBackgroundProfile,
  to: RouteBackgroundProfile,
  t: number
): RouteBackgroundProfile {
  return {
    gridStep: lerpNum(from.gridStep, to.gridStep, t),
    breathePeriodSec: lerpNum(from.breathePeriodSec, to.breathePeriodSec, t),
    gridOpacityMin: lerpNum(from.gridOpacityMin, to.gridOpacityMin, t),
    gridOpacityMax: lerpNum(from.gridOpacityMax, to.gridOpacityMax, t),
    gridOffsetAmp: lerpNum(from.gridOffsetAmp, to.gridOffsetAmp, t),
    cyanHighlightOpacity: lerpNum(from.cyanHighlightOpacity, to.cyanHighlightOpacity, t),
    cyanHighlightIntervalSec: lerpNum(
      from.cyanHighlightIntervalSec,
      to.cyanHighlightIntervalSec,
      t
    ),
    scanBandHeightRatio: lerpNum(from.scanBandHeightRatio, to.scanBandHeightRatio, t),
    scanBandPeriodSec: lerpNum(from.scanBandPeriodSec, to.scanBandPeriodSec, t),
    scanBandOpacity: lerpNum(from.scanBandOpacity, to.scanBandOpacity, t),
    scanVertical: t < 0.5 ? from.scanVertical : to.scanVertical,
    gridDiagonalBias: lerpNum(from.gridDiagonalBias, to.gridDiagonalBias, t),
    pulseEdge: t < 0.5 ? from.pulseEdge : to.pulseEdge,
    pulse: {
      intensity: lerpNum(from.pulse.intensity, to.pulse.intensity, t),
      peak: lerpNum(from.pulse.peak, to.pulse.peak, t),
    },
    timelineLines: t < 0.5 ? from.timelineLines : to.timelineLines,
    radialPing: t < 0.5 ? from.radialPing : to.radialPing,
    vignetteInk: t < 0.5 ? from.vignetteInk : to.vignetteInk,
    pinkPulseMix: lerpNum(from.pinkPulseMix, to.pinkPulseMix, t),
    accentMotionMultiplier: lerpNum(
      from.accentMotionMultiplier,
      to.accentMotionMultiplier,
      t
    ),
  }
}

/** @deprecated Use profileForPath().pulse */
export const ROUTE_PULSE_MAP: Partial<Record<RouteBackdropKey | string, RoutePulseProfile>> = {
  '/': ROUTE_BACKGROUND_PROFILES['/'].pulse,
  '/projects': ROUTE_BACKGROUND_PROFILES['/projects'].pulse,
  '/resume': ROUTE_BACKGROUND_PROFILES['/resume'].pulse,
  '/contact': ROUTE_BACKGROUND_PROFILES['/contact'].pulse,
}

export function routePulseForPath(pathname: string): RoutePulseProfile {
  return profileForPath(pathname).pulse
}

export function routeClassSuffix(pathname: string): string {
  const key = resolveBackgroundPath(pathname)
  if (key === '/') return 'home'
  return key.slice(1)
}
