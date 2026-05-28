import { Mail } from 'lucide-react'
import siteData from '../../data/site.json'
import { GitHubIcon, LinkedInIcon } from '../ui/BrandIcons'
import { GlassCard } from '../ui/GlassCard'
import { PanelHeader } from '../ui/PanelHeader'

const SOCIALS: {
  id: 'linkedin' | 'github'
  href: string
  label: string
  ariaLabel: string
  Icon: typeof LinkedInIcon
}[] = [
  {
    id: 'linkedin',
    href: siteData.linkedin,
    label: 'LinkedIn',
    ariaLabel: 'LinkedIn profile (opens in new tab)',
    Icon: LinkedInIcon,
  },
  {
    id: 'github',
    href: siteData.githubUrl,
    label: 'GitHub',
    ariaLabel: 'GitHub profile (opens in new tab)',
    Icon: GitHubIcon,
  },
]

export function ContactPanel() {
  const showEmail = (siteData.contactPrimary ?? ['linkedin', 'github', 'email']).includes(
    'email'
  )

  return (
    <GlassCard className="panel-slab--contact">
      <PanelHeader title="Contact" />
      <h2 className="sr-only">Contact</h2>
      <div className="contact-panel-body">
        <ul className="contact-socials">
          {SOCIALS.map(({ id, href, label, ariaLabel, Icon }) => (
            <li key={id} className="contact-socials__item">
              <a
                className="contact-social-link"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ariaLabel}
              >
                <span className="contact-social-link__icon" aria-hidden>
                  <Icon size={40} />
                </span>
                <span className="contact-social-link__label">{label}</span>
              </a>
            </li>
          ))}
        </ul>
        {showEmail && (
          <a
            className="command-link contact-email-link"
            href={`mailto:${siteData.email}`}
          >
            <Mail size={18} className="command-link__icon" aria-hidden />
            Email (optional)
            <span className="command-link__sub">{siteData.email}</span>
          </a>
        )}
      </div>
    </GlassCard>
  )
}
