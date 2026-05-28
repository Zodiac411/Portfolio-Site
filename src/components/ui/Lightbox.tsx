import { useEffect } from 'react'
import { X } from 'lucide-react'
import type { GalleryItem } from '../../types'

interface LightboxProps {
  item: GalleryItem
  onClose: () => void
}

export function Lightbox({ item, onClose }: LightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal
      aria-label={item.title}
      onClick={onClose}
    >
      <button type="button" className="lightbox__close" aria-label="Close lightbox" onClick={onClose}>
        <X size={28} />
      </button>
      <img
        className="lightbox__img"
        src={item.src}
        alt={item.alt}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
