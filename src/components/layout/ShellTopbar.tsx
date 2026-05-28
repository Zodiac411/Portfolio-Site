import siteData from '../../data/site.json'
import { MotionToggle } from '../ui/MotionToggle'

export function ShellTopbar() {
  return (
    <header className="shell-topbar">
      <p className="shell-topbar__cmd" aria-hidden>
        Interface
      </p>
      <div className="shell-topbar__row">
        <div className="shell-topbar__brand">
          <img
            className="shell-topbar__avatar"
            src="/assets/profile/chris-folorunso.png"
            alt=""
            width={40}
            height={40}
            decoding="async"
          />
          <div className="shell-topbar__brand-text">
            <span className="shell-topbar__name">{siteData.displayName}</span>
            <span className="shell-topbar__role">{siteData.tagline}</span>
          </div>
        </div>
        <MotionToggle />
      </div>
    </header>
  )
}
