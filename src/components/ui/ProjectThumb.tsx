import type { ProjectPreview } from '../../types'

interface ProjectThumbProps {
  preview: ProjectPreview
  slug?: string
}

/** Minimal geometric mark per project (fallback uses preview family). */
function ThumbIcon({ preview, slug }: ProjectThumbProps) {
  const stroke = '#02040b'
  const accent = '#18d8ff'
  const mark = '#ff2f5f'

  switch (slug) {
    case 'Prototype_Z':
      return (
        <>
          <rect x="18" y="14" width="36" height="24" rx="1" fill="none" stroke={accent} strokeWidth="2" />
          <circle cx="48" cy="20" r="3" fill={mark} />
        </>
      )
    case 'Final_Year_VR_Project':
      return (
        <>
          <ellipse cx="36" cy="26" rx="18" ry="12" fill="none" stroke={stroke} strokeWidth="2" />
          <line x1="18" y1="26" x2="54" y2="26" stroke={accent} strokeWidth="1.5" />
        </>
      )
    case 'MythGJ':
      return (
        <polygon
          points="36,12 54,40 18,40"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      )
    case 'TheBarMan':
      return (
        <>
          <rect x="16" y="18" width="40" height="8" fill={accent} opacity="0.35" stroke={stroke} strokeWidth="1.5" />
          <rect x="22" y="30" width="28" height="8" fill="none" stroke={stroke} strokeWidth="2" />
        </>
      )
    case 'BetterWorldGJ':
      return (
        <>
          <line x1="16" y1="34" x2="56" y2="34" stroke={accent} strokeWidth="2" strokeLinecap="square" />
          <line x1="20" y1="24" x2="48" y2="24" stroke={stroke} strokeWidth="2" strokeLinecap="square" />
          <line x1="24" y1="14" x2="40" y2="14" stroke={stroke} strokeWidth="1.5" strokeLinecap="square" opacity="0.45" />
        </>
      )
    default:
      break
  }

  if (preview === 'vr') {
    return (
      <ellipse cx="36" cy="26" rx="16" ry="11" fill="none" stroke={stroke} strokeWidth="2" />
    )
  }
  if (preview === 'jam') {
    return (
      <polygon points="36,14 52,38 20,38" fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
    )
  }
  if (preview === 'systems') {
    return (
      <>
        <rect x="14" y="16" width="18" height="8" fill="none" stroke={stroke} strokeWidth="2" />
        <rect x="36" y="16" width="22" height="8" fill="none" stroke={accent} strokeWidth="1.5" />
        <rect x="14" y="28" width="44" height="8" fill="none" stroke={stroke} strokeWidth="2" />
      </>
    )
  }
  if (preview === 'narrative') {
    return (
      <>
        <line x1="14" y1="32" x2="58" y2="32" stroke={accent} strokeWidth="2" strokeLinecap="square" />
        <line x1="14" y1="22" x2="46" y2="22" stroke={stroke} strokeWidth="2" strokeLinecap="square" />
        <line x1="14" y1="14" x2="34" y2="14" stroke={stroke} strokeWidth="1.5" strokeLinecap="square" opacity="0.4" />
      </>
    )
  }

  return (
    <>
      <rect x="20" y="16" width="32" height="20" fill="none" stroke={accent} strokeWidth="2" />
      <circle cx="44" cy="20" r="2.5" fill={mark} />
    </>
  )
}

export function ProjectThumb({ preview, slug }: ProjectThumbProps) {
  return (
    <svg
      className="project-thumb"
      viewBox="0 0 72 52"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="project-thumb__plate" width="72" height="52" />
      <ThumbIcon preview={preview} slug={slug} />
    </svg>
  )
}
