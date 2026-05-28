import { useCallback, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import menuData from '../data/menu.json'
import type { MenuItemData } from '../types'

const ITEMS = menuData.items as MenuItemData[]
const ROUTES = ITEMS.map((i) => i.route)
const ALLOWED = new Set<string>(ROUTES)
const LEGACY_REDIRECTS: Record<string, string> = {
  '/about': '/',
  '/skills': '/',
}

export function useMenuNavigation() {
  const location = useLocation()
  const navigate = useNavigate()

  const routeIndex = useMemo(() => {
    const idx = ROUTES.indexOf(location.pathname)
    return idx >= 0 ? idx : 0
  }, [location.pathname])

  useEffect(() => {
    const legacy = LEGACY_REDIRECTS[location.pathname]
    if (legacy) {
      navigate(legacy, { replace: true })
      return
    }
    if (!ALLOWED.has(location.pathname)) {
      navigate('/', { replace: true })
    }
  }, [location.pathname, navigate])

  const navigateToIndex = useCallback(
    (index: number) => {
      const item = ITEMS[Math.max(0, Math.min(ITEMS.length - 1, index))]
      navigate(item.route)
    },
    [navigate]
  )

  const closePanel = useCallback(() => {
    navigate('/')
  }, [navigate])

  const isPanelOpen = location.pathname !== '/'

  const isCurrentRoute = useCallback(
    (route: string) => location.pathname === route,
    [location.pathname]
  )

  return {
    items: ITEMS,
    routeIndex,
    navigateToIndex,
    closePanel,
    isPanelOpen,
    pathname: location.pathname,
    isCurrentRoute,
  }
}
