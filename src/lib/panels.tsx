import { lazy, type ComponentType } from 'react'

import type { RouteBackdropKey } from '../types'



export const PANEL_PATHS: RouteBackdropKey[] = [

  '/',

  '/projects',

  '/resume',

  '/contact',

]



const HomePanel = lazy(() =>

  import('../components/panels/HomePanel').then((m) => ({ default: m.HomePanel }))

)

const ProjectsPanel = lazy(() =>

  import('../components/panels/ProjectsPanel').then((m) => ({

    default: m.ProjectsPanel,

  }))

)

const ResumePanel = lazy(() =>

  import('../components/panels/ResumePanel').then((m) => ({ default: m.ResumePanel }))

)

const ContactPanel = lazy(() =>

  import('../components/panels/ContactPanel').then((m) => ({ default: m.ContactPanel }))

)



export const PANEL_COMPONENTS: Record<RouteBackdropKey, ComponentType> = {

  '/': HomePanel,

  '/projects': ProjectsPanel,

  '/resume': ResumePanel,

  '/contact': ContactPanel,

}



/** Stable component reference for a route (avoids remounting on unrelated parent re-renders). */

export function panelComponentForPath(

  pathname: string

): ComponentType | null {

  if (!(pathname in PANEL_COMPONENTS)) return null

  return PANEL_COMPONENTS[pathname as RouteBackdropKey]

}



export const PANEL_LABELS: Record<string, string> = {

  '/': 'Home',

  '/projects': 'Projects',

  '/resume': 'Resume',

  '/contact': 'Contact',

}



export function isPanelPath(pathname: string): pathname is RouteBackdropKey {

  return pathname in PANEL_COMPONENTS

}


