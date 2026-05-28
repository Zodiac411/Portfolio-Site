import { useLayoutEffect, useRef } from 'react'
import { ChevronDown, Code2 } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { MergedProject } from '../../types'
import { useMotionPreference } from '../../hooks/useReducedMotion'
import { inferPreview } from '../../lib/inferPreview'
import { ProjectThumb } from './ProjectThumb'

interface ProjectEntryProps {
  project: MergedProject
  index: number
  expanded: boolean
  onToggle: () => void
}

export function ProjectEntry({ project, index, expanded, onToggle }: ProjectEntryProps) {
  const entryRef = useRef<HTMLElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)
  const measuredHeightRef = useRef(0)
  const { reduced } = useMotionPreference()
  const preview = project.preview ?? inferPreview(project.tags, project.language, project.name)
  const hasDetails =
    Boolean(project.howItWorks) ||
    Boolean(project.improvements) ||
    project.partsMade.length > 0

  useLayoutEffect(() => {
    if (!detailsRef.current || reduced) return
    if (expanded) {
      detailsRef.current.style.height = 'auto'
      measuredHeightRef.current = detailsRef.current.scrollHeight
      detailsRef.current.style.height = '0px'
    }
  }, [expanded, reduced, project.slug])

  useGSAP(
    () => {
      if (!detailsRef.current || reduced) return
      const el = detailsRef.current
      const targetHeight = expanded ? measuredHeightRef.current : 0

      if (!expanded) {
        gsap.set(el, { height: 0, opacity: 0, overflow: 'hidden' })
      }

      gsap.to(el, {
        height: targetHeight,
        opacity: expanded ? 1 : 0,
        duration: expanded ? 0.26 : 0.22,
        ease: expanded ? 'power2.out' : 'power2.in',
      })
    },
    { dependencies: [expanded, reduced], scope: entryRef }
  )

  return (
    <article
      ref={entryRef}
      className={`project-entry${expanded ? ' project-entry--expanded' : ''}`}
    >
      <div className="project-entry__selector" aria-hidden>
        <span className="project-entry__selector-pink" />
        <span className="project-entry__selector-white" />
      </div>
      <div className="project-entry__main">
        <span className="project-entry__index" aria-hidden>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="project-entry__thumb">
          <ProjectThumb preview={preview} slug={project.slug} />
        </span>
        <div className="project-entry__body">
          <div className="project-entry__head">
            <h3 className="project-entry__title">{project.name}</h3>
            {project.role && (
              <p className="project-entry__role">{project.role}</p>
            )}
          </div>
          {project.systems.length > 0 && (
            <ul className="tag-list tag-list--home project-entry__systems">
              {project.systems.map((system) => (
                <li key={system} className="tag-list__item">
                  {system}
                </li>
              ))}
            </ul>
          )}
          {project.summary && (
            <p className="project-entry__summary">{project.summary}</p>
          )}
          <a
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="project-entry__github"
          >
            <Code2 size={14} aria-hidden />
            GitHub
          </a>
          {hasDetails && (
            <div className="project-entry__footer">
              <button
                type="button"
                className="project-entry__expand"
                aria-expanded={expanded}
                aria-controls={`project-details-${project.slug}`}
                onClick={onToggle}
              >
                {expanded ? 'Less' : 'More'}
                <ChevronDown
                  size={18}
                  aria-hidden
                  className={
                    expanded ? 'project-entry__expand-icon--open' : undefined
                  }
                />
              </button>
            </div>
          )}
        </div>
      </div>
      {hasDetails && (
        <div
          id={`project-details-${project.slug}`}
          ref={detailsRef}
          className="project-entry__details"
          hidden={!expanded && reduced}
        >
          {project.howItWorks && (
            <section className="project-entry__section">
              <h4 className="project-entry__section-title">How it works</h4>
              <p>{project.howItWorks}</p>
            </section>
          )}
          {project.improvements && (
            <section className="project-entry__section">
              <h4 className="project-entry__section-title">Could improve</h4>
              <p>{project.improvements}</p>
            </section>
          )}
          {project.partsMade.length > 0 && (
            <section className="project-entry__section">
              <h4 className="project-entry__section-title">Parts I made</h4>
              <ul className="project-entry__parts">
                {project.partsMade.map((part) => (
                  <li key={part}>{part}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </article>
  )
}
