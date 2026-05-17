import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ImagePlus, Upload, X } from 'lucide-react'

type Props = {
  /** Label that fills the "Replace {label}" header — e.g., "Avatar", "Character Image". */
  label: string
  /** Current image to show as the preview thumb. */
  thumb: string
  onClose: () => void
  /** Optional confirm action — fires when the user clicks the primary "Replace" button. */
  onReplace?: () => void
}

/** Asset replacement modal. Portals to document.body so it covers the viewport
 *  regardless of where it's instantiated (agent panel chips, workflow node, ...). */
export function UploadModal({ label, thumb, onClose, onReplace }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-charcoal-700 border border-charcoal-300 rounded-xl shadow-modal w-[15rem] overflow-hidden"
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-charcoal-500">
          <div>
            <div className="text-white font-semibold text-[0.75rem]">
              Replace {label}
            </div>
            <div className="text-smoke-700 text-[0.625rem] mt-0.5">
              Drop a new image or pick from assets.
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-smoke-700 hover:text-white p-1"
            aria-label="Close"
          >
            <X size={12} />
          </button>
        </div>
        <div className="p-3">
          <div className="aspect-[3/4] rounded-md bg-charcoal-600 overflow-hidden ring-1 ring-charcoal-400 mb-2">
            <img src={thumb} alt="" className="w-full h-full object-cover" />
          </div>
          <label className="flex flex-col items-center justify-center gap-1 w-full bg-charcoal-600 hover:bg-charcoal-500 border border-dashed border-charcoal-300 rounded-md py-3 cursor-pointer text-smoke-300 hover:text-white">
            <ImagePlus size={14} />
            <span className="text-[0.625rem] font-medium">
              Drop image or click to upload
            </span>
            <span className="text-[0.5625rem] text-smoke-700">
              PNG, JPG, WebP · up to 25MB
            </span>
            <input type="file" accept="image/*" className="hidden" />
          </label>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={onClose}
              className="flex-1 text-smoke-500 hover:text-white text-[0.625rem] py-1.5 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onReplace?.()
                if (!onReplace) onClose()
              }}
              className="flex-1 bg-electric text-black font-semibold text-[0.625rem] rounded-md py-1.5 flex items-center justify-center gap-1 hover:bg-electric/90"
            >
              <Upload size={10} />
              Replace
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
