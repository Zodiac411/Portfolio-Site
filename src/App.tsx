import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')

function redirectCleanPagePathToHashRoute() {
  if (typeof window === 'undefined') return
  if (window.location.hash || !basePath) return

  const basePathWithSlash = `${basePath}/`
  const { pathname, search } = window.location
  const isBasePath = pathname === basePath || pathname === basePathWithSlash
  if (isBasePath || !pathname.startsWith(basePathWithSlash)) return

  const routePath = pathname.slice(basePath.length) || '/'
  window.history.replaceState(null, '', `${basePathWithSlash}#${routePath}${search}`)
}

redirectCleanPagePathToHashRoute()

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/*" element={<AppShell />} />
      </Routes>
    </HashRouter>
  )
}
