import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useGitHubRepos } from '../../hooks/useGitHubRepos'
import { useMotionPreference } from '../../hooks/useReducedMotion'
import { GlassCard } from '../ui/GlassCard'
import { PanelHeader } from '../ui/PanelHeader'
import { ProjectEntry } from '../ui/ProjectEntry'

export function ProjectsPanel() {
  const panelRef = useRef<HTMLDivElement>(null)
  const hasStaggered = useRef(false)
  const location = useLocation()
  const { projects, loading, error } = useGitHubRepos()
  const { reduced } = useMotionPreference()
  const featured = projects.filter((p) => p.featured)
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)

  useEffect(() => {
    hasStaggered.current = false
    setExpandedSlug(null)
  }, [location.pathname])

  useGSAP(
    () => {
      if (!panelRef.current || loading || reduced || hasStaggered.current) return
      const run = () => {
        if (!panelRef.current || hasStaggered.current) return
        const entries = panelRef.current.querySelectorAll(
          '.projects-panel-body .project-entry:not(.project-entry--loading)'
        )
        if (!entries.length) return
        hasStaggered.current = true
        gsap.fromTo(
          entries,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
        )
      }
      requestAnimationFrame(run)
    },
    { dependencies: [loading, reduced], scope: panelRef }
  )

  const handleToggle = (slug: string) => {
    setExpandedSlug((current) => (current === slug ? null : slug))
  }

  return (
    <div className="projects-panel-root" ref={panelRef}>
      <GlassCard className="panel-slab--projects">
        <PanelHeader title="Projects" />
        <h2 className="sr-only">Projects</h2>
        <div className="projects-panel-body">
          {loading && (
            <div className="projects-grid">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="project-entry project-entry--loading"
                  aria-hidden
                />
              ))}
            </div>
          )}
          {error && (
            <p className="panel-lead" role="status">
              Using local project data ({error}).
            </p>
          )}
          {!loading && (
            <div className="projects-grid">
              {featured.map((p, idx) => (
                <ProjectEntry
                  key={p.slug}
                  project={p}
                  index={idx}
                  expanded={expandedSlug === p.slug}
                  onToggle={() => handleToggle(p.slug)}
                />
              ))}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  )
}
