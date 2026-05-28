import {
  BACKGROUND_MOTION,
  CYAN_RGB,
  PINK_RGB,
  type RouteBackgroundProfile,
} from './backgroundMotion'

export function readCssVar(name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tSec: number,
  profile: RouteBackgroundProfile,
  highlightPhaseRef: { current: number }
) {
  const breathe =
    (Math.sin((tSec / profile.breathePeriodSec) * Math.PI * 2) + 1) * 0.5
  const gridOpacity =
    profile.gridOpacityMin + (profile.gridOpacityMax - profile.gridOpacityMin) * breathe
  const offset =
    Math.sin((tSec / profile.breathePeriodSec) * Math.PI * 2 + 0.6) * profile.gridOffsetAmp
  const step = profile.gridStep
  const bias = profile.gridDiagonalBias

  ctx.strokeStyle = `rgba(247, 248, 251, ${gridOpacity})`
  ctx.lineWidth = 1

  ctx.beginPath()
  for (let x = -step; x < w + step; x += step) {
    const px = x + offset
    ctx.moveTo(px, 0)
    ctx.lineTo(px + bias * 8, h)
  }
  ctx.stroke()

  ctx.beginPath()
  for (let y = -step; y < h + step; y += step) {
    const py = y + offset * 0.65
    ctx.moveTo(0, py)
    ctx.lineTo(w, py - bias * 6)
  }
  ctx.stroke()

  const highlightTick = Math.floor(tSec / profile.cyanHighlightIntervalSec)
  if (highlightTick !== highlightPhaseRef.current) {
    highlightPhaseRef.current = highlightTick
  }
  const highlightIndex =
    (highlightTick * 17 + Math.floor(w / step)) % Math.max(1, Math.floor(w / step))
  ctx.strokeStyle = `rgba(${CYAN_RGB}, ${profile.cyanHighlightOpacity})`
  const hx = highlightIndex * step + offset
  ctx.beginPath()
  ctx.moveTo(hx, 0)
  ctx.lineTo(hx, h)
  ctx.stroke()
}

export function drawScanBand(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tSec: number,
  profile: RouteBackgroundProfile,
  alpha = 1
) {
  if (alpha <= 0) return
  const bandH = h * profile.scanBandHeightRatio
  const opacity = profile.scanBandOpacity * alpha

  if (profile.scanVertical) {
    const travel = h + bandH
    const progress = (tSec % profile.scanBandPeriodSec) / profile.scanBandPeriodSec
    const y = progress * travel - bandH
    const grad = ctx.createLinearGradient(0, y, 0, y + bandH)
    grad.addColorStop(0, `rgba(${CYAN_RGB}, 0)`)
    grad.addColorStop(0.35, `rgba(${CYAN_RGB}, ${opacity})`)
    grad.addColorStop(0.5, `rgba(${CYAN_RGB}, ${opacity * 1.1})`)
    grad.addColorStop(0.65, `rgba(${CYAN_RGB}, ${opacity})`)
    grad.addColorStop(1, `rgba(${CYAN_RGB}, 0)`)
    ctx.fillStyle = grad
    ctx.fillRect(0, y, w, bandH)
  } else {
    const bandW = w * profile.scanBandHeightRatio
    const travel = w + bandW
    const progress = (tSec % profile.scanBandPeriodSec) / profile.scanBandPeriodSec
    const x = progress * travel - bandW
    const grad = ctx.createLinearGradient(x, 0, x + bandW, 0)
    grad.addColorStop(0, `rgba(${CYAN_RGB}, 0)`)
    grad.addColorStop(0.35, `rgba(${CYAN_RGB}, ${opacity})`)
    grad.addColorStop(0.5, `rgba(${CYAN_RGB}, ${opacity * 1.1})`)
    grad.addColorStop(0.65, `rgba(${CYAN_RGB}, ${opacity})`)
    grad.addColorStop(1, `rgba(${CYAN_RGB}, 0)`)
    ctx.fillStyle = grad
    ctx.fillRect(x, 0, bandW, h)
  }
}

export function drawRoutePulse(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  pulse: number,
  profile: RouteBackgroundProfile
) {
  if (pulse <= 0) return
  const alpha = pulse * 0.14 * profile.pulse.peak
  const spread = w * (0.35 + pulse * 0.2 * profile.pulse.intensity)
  const pinkMix = profile.pinkPulseMix

  const fillEdge = (edge: typeof profile.pulseEdge) => {
    if (edge === 'right') {
      const grad = ctx.createLinearGradient(w, 0, w - spread, 0)
      grad.addColorStop(0, `rgba(${CYAN_RGB}, ${alpha})`)
      grad.addColorStop(0.45, `rgba(${CYAN_RGB}, ${alpha * 0.35})`)
      grad.addColorStop(1, `rgba(${CYAN_RGB}, 0)`)
      ctx.fillStyle = grad
      ctx.fillRect(w - spread, 0, spread, h)
    } else if (edge === 'left') {
      const grad = ctx.createLinearGradient(0, 0, spread, 0)
      grad.addColorStop(0, `rgba(${CYAN_RGB}, ${alpha})`)
      grad.addColorStop(0.55, `rgba(${CYAN_RGB}, ${alpha * 0.3})`)
      grad.addColorStop(1, `rgba(${CYAN_RGB}, 0)`)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, spread, h)
    } else {
      const cx = w * 0.5
      const cy = h * 0.45
      const radial = ctx.createRadialGradient(cx, cy, 0, cx, cy, spread * 0.9)
      radial.addColorStop(0, `rgba(${CYAN_RGB}, ${alpha * 0.7})`)
      radial.addColorStop(0.5, `rgba(${CYAN_RGB}, ${alpha * 0.15})`)
      radial.addColorStop(1, `rgba(${CYAN_RGB}, 0)`)
      ctx.fillStyle = radial
      ctx.fillRect(0, 0, w, h)
    }
  }

  fillEdge(profile.pulseEdge)

  if (pinkMix > 0) {
    const px = w * 0.72
    const py = h * 0.38
    const radial = ctx.createRadialGradient(px, py, 0, px, py, spread * 0.85)
    radial.addColorStop(0, `rgba(${PINK_RGB}, ${alpha * pinkMix})`)
    radial.addColorStop(0.6, `rgba(${PINK_RGB}, ${alpha * pinkMix * 0.2})`)
    radial.addColorStop(1, `rgba(${PINK_RGB}, 0)`)
    ctx.fillStyle = radial
    ctx.fillRect(0, 0, w, h)
  }
}

export function drawTimelineLines(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tSec: number,
  alpha: number
) {
  if (alpha <= 0) return
  const count = 5
  const drift = (tSec * 0.04) % 1
  ctx.strokeStyle = `rgba(${CYAN_RGB}, ${0.12 * alpha})`
  ctx.lineWidth = 1
  for (let i = 0; i < count; i++) {
    const y = h * (0.18 + i * 0.14) + drift * 12
    ctx.beginPath()
    ctx.moveTo(w * 0.08, y)
    ctx.lineTo(w * 0.55 + Math.sin(tSec + i) * 20, y)
    ctx.stroke()
  }
}

export function drawRadialPing(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tSec: number,
  alpha: number
) {
  if (alpha <= 0) return
  const period = 4.5
  const phase = (tSec % period) / period
  const cx = w * 0.62
  const cy = h * 0.55
  const maxR = Math.min(w, h) * 0.45
  const r = maxR * phase
  ctx.strokeStyle = `rgba(${CYAN_RGB}, ${(1 - phase) * 0.35 * alpha})`
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()
  if (phase > 0.15) {
    ctx.strokeStyle = `rgba(${PINK_RGB}, ${(1 - phase) * 0.2 * alpha})`
    ctx.beginPath()
    ctx.arc(cx, cy, r * 0.65, 0, Math.PI * 2)
    ctx.stroke()
  }
}

export function drawVignetteInk(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  alpha: number
) {
  if (alpha <= 0) return
  const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.2, w * 0.5, h * 0.5, w * 0.75)
  grad.addColorStop(0, 'rgba(2, 4, 11, 0)')
  grad.addColorStop(1, `rgba(2, 4, 11, ${0.35 * alpha})`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)
}

export function drawTransitionWipe(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  progress: number
) {
  if (progress <= 0 || progress >= 1) return
  const peak = BACKGROUND_MOTION.bgWipePeakOpacity
  const x = w * progress
  const band = w * 0.22
  const grad = ctx.createLinearGradient(x - band, 0, x + band * 0.2, 0)
  grad.addColorStop(0, `rgba(${CYAN_RGB}, 0)`)
  grad.addColorStop(0.45, `rgba(${CYAN_RGB}, ${peak})`)
  grad.addColorStop(0.55, `rgba(${PINK_RGB}, ${peak * 0.35})`)
  grad.addColorStop(1, `rgba(${CYAN_RGB}, 0)`)
  ctx.fillStyle = grad
  ctx.fillRect(Math.max(0, x - band), 0, band * 1.2, h)
}

export function drawProfileScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tSec: number,
  profile: RouteBackgroundProfile,
  highlightPhaseRef: { current: number },
  mixAlpha = 1
) {
  drawGrid(ctx, w, h, tSec, profile, highlightPhaseRef)
  drawScanBand(ctx, w, h, tSec, profile, mixAlpha)

  if (profile.timelineLines) {
    drawTimelineLines(ctx, w, h, tSec, mixAlpha)
  }
  if (profile.radialPing) {
    drawRadialPing(ctx, w, h, tSec, mixAlpha)
  }
  if (profile.vignetteInk) {
    drawVignetteInk(ctx, w, h, mixAlpha)
  }
}
