import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useMotionPreference } from '../../hooks/useReducedMotion'
import { MOTION } from '../../lib/motion'

interface PanelHeaderProps {
  title: string
}

export function PanelHeader({ title }: PanelHeaderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLSpanElement>(null)
  const { reduced } = useMotionPreference()
  useGSAP(
    () => {
      const root = rootRef.current
      const titleEl = titleRef.current
      if (!root || !titleEl) return

      if (reduced) {
        gsap.set([root, titleEl], { clearProps: 'all' })
        return
      }

      const tl = gsap.timeline()
      tl.fromTo(
        titleEl,
        { opacity: 0, x: 18, skewX: -14, rotateY: -6 },
        {
          opacity: 1,
          x: 0,
          skewX: -10,
          rotateY: -3,
          duration: MOTION.panelHeaderIn,
          ease: MOTION.easeSnap,
        }
      )

      return () => {
        tl.kill()
      }
    },
    { dependencies: [title, reduced], scope: rootRef }
  )

  return (
    <div ref={rootRef} className="command-panel">
      <span ref={titleRef} className="command-panel__title">
        {title}
      </span>
    </div>
  )
}
