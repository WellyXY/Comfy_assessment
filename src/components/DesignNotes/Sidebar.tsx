import { useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { categoryStyles, designNotes } from '../../data/designNotes'
import { ConnectionOverlay } from './ConnectionOverlay'

type Props = {
  onHide: () => void
  stepLabel: string
  mode: 'login' | 'A' | 'B'
}

export function DesignNotesSidebar({ onHide, stepLabel, mode }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const noteRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const notesForStep = designNotes.filter(
    (n) => !n.steps || n.steps.includes(mode),
  )
  const hoveredNote = hoveredId
    ? notesForStep.find((n) => n.id === hoveredId)
    : null
  const hoveredEl = hoveredId ? noteRefs.current[hoveredId] : null

  return (
    <>
      <aside className="w-[300px] shrink-0 bg-[#0c0c0d] border-l border-charcoal-700 flex flex-col h-full">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-charcoal-700">
          <div className="text-[0.625rem] uppercase tracking-[0.18em] text-orange-300/80 font-medium mb-1">
            Design Notes
          </div>
          <div className="text-white font-semibold text-[1rem] leading-tight mb-1">
            {stepLabel}
          </div>
          <div className="text-smoke-700 text-[0.75rem] leading-snug">
            Hover any card to see the UI element it points to.
          </div>
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {notesForStep.map((n) => {
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
                    ? `bg-charcoal-700 ${c.ring} ring-1 ring-orange-300/30`
                    : 'bg-transparent border-charcoal-600 hover:border-charcoal-300'
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

        {/* Footer toggle */}
        <div className="px-3 py-3 border-t border-charcoal-700">
          <button
            onClick={onHide}
            className="flex items-center gap-2 text-smoke-500 hover:text-white text-[0.75rem]"
          >
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            Hide design notes
          </button>
        </div>
      </aside>

      {hoveredNote && hoveredEl && (
        <ConnectionOverlay noteEl={hoveredEl} targetSelector={hoveredNote.target} />
      )}
    </>
  )
}

export function ShowNotesTab({ onShow }: { onShow: () => void }) {
  return (
    <button
      onClick={onShow}
      className="shrink-0 group flex items-start gap-2 px-2 pt-4 hover:bg-charcoal-700 transition-colors border-l border-charcoal-700 bg-[#0c0c0d]"
      style={{ width: 36 }}
    >
      <ChevronRight
        size={14}
        className="text-smoke-700 group-hover:text-white rotate-180"
      />
      <span
        className="text-[0.6875rem] uppercase tracking-[0.18em] text-smoke-700 group-hover:text-white font-medium"
        style={{ writingMode: 'vertical-rl' }}
      >
        Design notes
      </span>
    </button>
  )
}
