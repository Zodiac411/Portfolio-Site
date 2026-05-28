import type { ProjectPreview } from '../types'

export function inferPreview(
  tags: string[],
  language: string | null,
  name: string
): ProjectPreview {
  const hay = `${tags.join(' ')} ${language ?? ''} ${name}`.toLowerCase()
  if (hay.includes('vr') || hay.includes('unreal')) return 'vr'
  if (hay.includes('jam') || hay.includes('game jam')) return 'jam'
  if (hay.includes('sim') || hay.includes('systems') || hay.includes('management')) return 'systems'
  if (hay.includes('narrative') || hay.includes('story')) return 'narrative'
  return 'prototype'
}
