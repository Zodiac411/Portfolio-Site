import { Suspense, memo, useEffect, useMemo, useRef, useState } from 'react'



import { useLocation } from 'react-router-dom'



import gsap from 'gsap'



import { useGSAP } from '@gsap/react'



import { useMotionPreference } from '../../hooks/useReducedMotion'



import { usePanelParallax } from '../../hooks/usePanelParallax'



import { animatePanelFragments } from '../../lib/motion'



import {

  isPanelPath,

  panelComponentForPath,

  PANEL_LABELS,

} from '../../lib/panels'







const SCROLL_PANEL_PATHS = new Set<string>(['/projects'])







function resolvePanelPath(pathname: string): string {



  if (isPanelPath(pathname)) return pathname



  return '/'



}







function PanelFallback() {

  return (

    <div className="panel-loading-fallback" aria-busy="true" aria-live="polite">

      <div className="panel-loading-fallback__header" aria-hidden />

      <ul className="panel-loading-fallback__lines" aria-hidden>

        <li className="panel-loading-fallback__line" />

        <li className="panel-loading-fallback__line" />

        <li className="panel-loading-fallback__line" />

      </ul>

      <p className="panel-loading-fallback__status">Loading panel…</p>

    </div>

  )

}







export const SubPanelHost = memo(function SubPanelHost() {



  const location = useLocation()



  const hostRef = useRef<HTMLDivElement>(null)



  const innerRef = useRef<HTMLDivElement>(null)



  const [transitioning, setTransitioning] = useState(false)



  const animatedInPathRef = useRef<string | null>(null)



  const { reduced } = useMotionPreference()



  const panelPath = resolvePanelPath(location.pathname)



  const [displayPath, setDisplayPath] = useState(panelPath)



  const PanelComponent = useMemo(

    () => panelComponentForPath(displayPath),

    [displayPath]

  )



  const scrollPanel = SCROLL_PANEL_PATHS.has(displayPath)



  const isHome = location.pathname === '/'



  const regionLabel = PANEL_LABELS[panelPath] ?? 'Home'







  usePanelParallax(innerRef, reduced, transitioning)







  useEffect(() => {



    const nextPath = resolvePanelPath(location.pathname)



    if (nextPath === displayPath) return



    if (reduced) {



      setDisplayPath(nextPath)



      return



    }



    const inner = innerRef.current



    const frags = inner?.querySelectorAll('.panel-fragment__surface')



    if (inner && frags && frags.length > 0 && isPanelPath(displayPath)) {



      setTransitioning(true)



      const out = animatePanelFragments(inner, 'out', reduced)



      if (out) {



        out.eventCallback('onComplete', () => {



          animatedInPathRef.current = null



          setDisplayPath(nextPath)



          setTransitioning(false)



        })



        return



      }



    }



    animatedInPathRef.current = null



    setDisplayPath(nextPath)



    setTransitioning(false)



  }, [location.pathname, displayPath, reduced])







  useGSAP(



    () => {



      if (!innerRef.current || !PanelComponent) return



      if (reduced) {



        gsap.set(innerRef.current, { opacity: 1, pointerEvents: 'auto' })



        const surfaces = innerRef.current.querySelectorAll('.panel-fragment__surface')



        gsap.set(surfaces, { opacity: 1 })



        animatedInPathRef.current = displayPath



        return



      }



      gsap.set(innerRef.current, { opacity: 1, pointerEvents: 'auto' })



      if (animatedInPathRef.current === displayPath) return



      animatedInPathRef.current = displayPath



      animatePanelFragments(innerRef.current, 'in', reduced)



    },



    { dependencies: [displayPath, reduced, PanelComponent], scope: hostRef }



  )







  return (



    <div



      ref={hostRef}



      className={`sub-panel-host ${isHome ? 'sub-panel-host--home' : 'sub-panel-host--open'} ${scrollPanel ? 'sub-panel-host--scroll' : ''}`.trim()}



      role="region"



      aria-label={regionLabel}



    >



      <div ref={innerRef} className="sub-panel-host__inner panel-slab-host">



        <Suspense fallback={<PanelFallback />}>

          {PanelComponent ? <PanelComponent key={displayPath} /> : null}

        </Suspense>



      </div>



    </div>



  )



})


