import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import siteData from '../../data/site.json'
import skillsData from '../../data/skills.json'
import { useMotionPreference } from '../../hooks/useReducedMotion'
import { GlassCard } from '../ui/GlassCard'
import { PanelHeader } from '../ui/PanelHeader'
import type { SkillsData } from '../../types'

const { groups } = skillsData as SkillsData

function bioWithoutName(bio: string, legalName: string) {
  const prefix = `${legalName} `
  return bio.startsWith(prefix) ? bio.slice(prefix.length) : bio
}

interface HomeSectionProps {
  title: string
  children: ReactNode
}

function HomeSection({ title, children }: HomeSectionProps) {
  return (
    <section className="home-section">
      <h3 className="home-section__title">{title}</h3>
      {children}
    </section>
  )
}

export function HomePanel() {
  const panelRef = useRef<HTMLDivElement>(null)
  const { reduced } = useMotionPreference()

  useGSAP(
    () => {
      if (!panelRef.current || reduced) return
      const blocks = panelRef.current.querySelectorAll(
        '.home-hero__name, .home-hero__bio, .home-section'
      )
      if (!blocks.length) return
      gsap.fromTo(
        blocks,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.38,
          stagger: 0.06,
          ease: 'power3.out',
          delay: 0.1,
        }
      )
    },
    { dependencies: [reduced], scope: panelRef }
  )

  return (
    <div className="home-panel-root" ref={panelRef}>
      <GlassCard className="panel-slab--home">
        <PanelHeader title="Home" />
        <h2 className="sr-only">Home — {siteData.legalName}</h2>
        <div className="home-panel-body">
          <header className="home-hero">
            <p className="home-hero__eyebrow">{siteData.tagline}</p>
            <h3 className="home-hero__name">{siteData.legalName}</h3>
            <p className="home-hero__bio">
              {bioWithoutName(siteData.bio, siteData.legalName)}
            </p>
          </header>
          <div className="home-panel-grid">
            <HomeSection title="Coding Languages">
              <ul className="tag-list tag-list--home">
                {siteData.codingLanguages.map((lang) => (
                  <li key={lang} className="tag-list__item">
                    {lang}
                  </li>
                ))}
              </ul>
            </HomeSection>
            <HomeSection title="Game Engines">
              <ul className="tag-list tag-list--home">
                {siteData.gameEngines.map((engine) => (
                  <li key={engine} className="tag-list__item">
                    {engine}
                  </li>
                ))}
              </ul>
            </HomeSection>
            {groups.map((group) => (
              <HomeSection key={group.name} title={group.name}>
                <ul className="tag-list tag-list--home">
                  {group.skills.map((s) => (
                    <li key={s.name} className="tag-list__item">
                      {s.name}
                    </li>
                  ))}
                </ul>
              </HomeSection>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
