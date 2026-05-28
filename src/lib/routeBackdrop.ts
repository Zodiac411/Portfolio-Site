import type { RouteBackdropKey } from '../types'

export const ROUTE_BACKDROP_WORDS: Record<RouteBackdropKey, string> = {
  '/': 'HOME',
  '/projects': 'PROJECTS',
  '/resume': 'RESUME',
  '/contact': 'CONTACT',
}

export function backdropWordForPath(pathname: string): string {
  return ROUTE_BACKDROP_WORDS[pathname as RouteBackdropKey] ?? 'CHRIS FOLORUNSO'
}
