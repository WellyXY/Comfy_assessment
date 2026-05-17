import { useEffect, useRef, useState } from 'react'
import { ChevronDown, GripVertical, X } from 'lucide-react'
import { categoryStyles, designNotes } from '../../data/designNotes'
import { ConnectionOverlay } from './ConnectionOverlay'

type Props = {
  open: boolean
  onClose: () => void
}

const PANEL_W = 320
const DEFAULT_RIGHT = 24
const DEFAULT_TOP = 60

export function DesignNotes({ open, onClose }: Props) {
  // Position: tracked as absolute (top, left) once user has dragged; defaults to top-right
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const noteRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Drag handlers
  const dragState = useRef<{ startX: number; startY: number; origLeft: number; origTop: number } | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const startDrag = (e: React.MouseEvent) => {
    const rect = panelRef.current?.getBoundingClientRect()
    if (!rect) return
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      origLeft: rect.left,
      origTop: rect.top,
    }
    e.preventDefault()
  }

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragState.current) return
      const dx = e.clientX - dragState.current.startX
      const dy = e.clientY - dragState.current.startY
      const left = Math.max(
        0,
        Math.min(window.innerWidth - PANEL_W, dragState.current.origLeft + dx),
      )
      const top = Math.max(0, Math.min(window.innerHeight - 60, dragState.current.origTop + dy))
      setPos({ left, top })
    }
    const onUp = () => {
      dragState.current = null
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  if (!open) return null

  const positionStyle: React.CSSProperties = pos
    ? { left: pos.left, top: pos.top, right: 'auto' }
    : { right: DEFAULT_RIGHT, top: DEFAULT_TOP }

  const hoveredNote = hoveredId ? designNotes.find((n) => n.id === hoveredId) : null
  const hoveredEl = hoveredId ? noteRefs.current[hoveredId] : null

  return (
    <>
      <div
        ref={panelRef}
        className="fixed z-[55] w-[320px] bg-charcoal-700/95 border border-charcoal-300 rounded-card shadow-modal backdrop-blur-md select-none"
        style={positionStyle}
      >
        {/* Header / drag handle */}
        <div
          onMouseDown={startDrag}
          className="flex items-center gap-2 px-3 py-2 border-b border-charcoal-500 cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={14} className="text-smoke-700" />
          <div className="flex-1">
            <div className="text-[0.625rem] uppercase tracking-[0.15em] text-orange-300 font-medium">
              Design Notes
            </div>
            <div className="text-white text-[0.8125rem] font-semibold leading-tight">
              Comfy Cloud · Activation prototype
            </div>
          </div>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="text-smoke-700 hover:text-white p-1 rounded"
            aria-label={collapsed ? 'Expand' : 'Collapse'}
          >
            <ChevronDown
              size={14}
              className={`transition-transform ${collapsed ? '-rotate-90' : ''}`}
            />
          </button>
          <button
            onClick={onClose}
            className="text-smoke-700 hover:text-white p-1 rounded"
            aria-label="Hide design notes"
          >
            <X size={14} />
          </button>
        </div>

        {!collapsed && (
          <div className="px-3 py-3">
            <p className="text-smoke-700 text-[0.75rem] mb-3 leading-snug">
              Hover any card to see the UI element it points to.
            </p>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {designNotes.map((n) => {
                const c = categoryStyles[n.category]
                const isActive = hoveredId === n.id
                return (
                  <div
                    key={n.id}
                    ref={(el) => {
                      noteRefs.current[n.id] = el
                    }}
                    onMouseEnter={() => setHoveredId(n.id)}
                    onMouseLeave={() =>
                      setHoveredId((h) => (h === n.id ? null : h))
                    }
                    className={`p-3 rounded-lg border transition-all cursor-default ${
                      isActive
                        ? `bg-charcoal-600 ${c.ring} ring-1 ring-orange-300/30`
                        : 'bg-charcoal-700 border-charcoal-400 hover:border-charcoal-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                      <span className="text-[0.625rem] uppercase tracking-[0.12em] font-semibold text-smoke-500">
                        {c.label}
                      </span>
                    </div>
                    <div className="text-white text-[0.8125rem] font-semibold leading-snug mb-1">
                      {n.title}
                    </div>
                    <div className="text-smoke-500 text-[0.75rem] leading-snug">
                      {n.body}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Connection overlay drawn when hovering a note */}
      {hoveredNote && hoveredEl && (
        <ConnectionOverlay
          noteEl={hoveredEl}
          targetSelector={hoveredNote.target}
        />
      )}
    </>
  )
}
