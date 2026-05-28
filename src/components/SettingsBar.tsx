import { useMotionPreference } from '../hooks/useReducedMotion'

export function SettingsBar() {
  const { reduced, toggleReduced } = useMotionPreference()

  return (
    <div className="settings-bar">
      <button
        type="button"
        aria-pressed={reduced}
        onClick={toggleReduced}
        title="Reduce motion (also respects system preference)"
      >
        {reduced ? 'Motion: Reduced' : 'Motion: Full'}
      </button>
    </div>
  )
}
