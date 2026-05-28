import { useEffect, useState } from 'react'

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setReduced(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reduced
}

export function useMotionPreference() {
  const systemReduced = useReducedMotion()
  const [userReduced, setUserReduced] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('hellstar-reduce-motion') === 'true'
  })

  const reduced = systemReduced || userReduced

  useEffect(() => {
    document.documentElement.classList.toggle('motion-reduced', userReduced)
    return () => {
      document.documentElement.classList.remove('motion-reduced')
    }
  }, [userReduced])

  const toggleReduced = () => {
    setUserReduced((prev) => {
      const next = !prev
      localStorage.setItem('hellstar-reduce-motion', String(next))
      return next
    })
  }

  return { reduced, toggleReduced, systemReduced }
}
