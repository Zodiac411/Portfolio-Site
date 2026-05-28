import { useEffect, useState } from 'react'

export const MOBILE_MQ = '(max-width: 767px)'
export const COMPACT_SHELL_MQ = '(max-width: 767px)'

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export function useMobileLayout(): boolean {
  return useMediaQuery(MOBILE_MQ)
}

/** Mobile only: telemetry rail is hidden; tablet+ shows SideGlyph. */
export function useCompactShell(): boolean {
  return useMediaQuery(COMPACT_SHELL_MQ)
}
