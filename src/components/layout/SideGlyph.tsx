import { forwardRef } from 'react'
import siteData from '../../data/site.json'

interface SideGlyphProps {
  className?: string
}

const profileImageSrc = `${import.meta.env.BASE_URL}assets/profile/chris-folorunso.png`

export const SideGlyph = forwardRef<HTMLElement, SideGlyphProps>(function SideGlyph(
  { className = '' },
  ref
) {
  return (
    <aside ref={ref} className={`telemetry-rail ${className}`.trim()} aria-hidden>
      <span className="telemetry-rail__line" />
      <span className="telemetry-rail__ticks" />
      <div className="telemetry-rail__inner">
        <img
          className="telemetry-rail__avatar"
          src={profileImageSrc}
          alt={siteData.legalName}
          width={96}
          height={96}
          decoding="async"
        />
        <p className="telemetry-rail__legal">{siteData.legalName}</p>
        <p className="telemetry-rail__role">{siteData.tagline}</p>
      </div>
    </aside>
  )
})
