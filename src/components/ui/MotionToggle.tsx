import { useMotionPreference } from '../../hooks/useReducedMotion'

export function MotionToggle() {
  const { reduced, toggleReduced } = useMotionPreference()

  return (
    <button
      type="button"
      className="motion-toggle"
      aria-pressed={reduced}
      onClick={toggleReduced}
      title="Reduce motion (also respects system preference)"
    >
      <span className="motion-toggle__label">Motion</span>
      <span className="motion-toggle__state">{reduced ? 'Reduced' : 'Full'}</span>
    </button>
  )
}
