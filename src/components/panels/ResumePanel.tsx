import siteData from '../../data/site.json'
import { GitHubIcon, LinkedInIcon } from '../ui/BrandIcons'
import { GlassCard } from '../ui/GlassCard'
import { PanelHeader } from '../ui/PanelHeader'
import { Timeline } from '../ui/Timeline'

export function ResumePanel() {
  return (
    <GlassCard className="panel-slab--resume">
      <PanelHeader title="Resume" />
      <h2 className="sr-only">Resume</h2>
      <div className="resume-panel-body">
        <ul className="command-links-row command-links-row--primary">
          <li>
            <a
              className="command-link command-link--primary"
              href={siteData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile (opens in new tab)"
            >
              <LinkedInIcon
                size={18}
                className="command-link__icon command-link__icon--brand"
              />
              LinkedIn
            </a>
          </li>
          <li>
            <a
              className="command-link command-link--primary"
              href={siteData.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile (opens in new tab)"
            >
              <GitHubIcon
                size={18}
                className="command-link__icon command-link__icon--brand"
              />
              GitHub
            </a>
          </li>
        </ul>
        <section className="panel-section panel-section--divider">
          <h3 className="panel-title panel-title--sub">Education & experience</h3>
          <Timeline />
        </section>
      </div>
    </GlassCard>
  )
}
