import { StickyNote } from 'lucide-react'

type Props = {
  open: boolean
  onToggle: () => void
}

export function DesignNotesToggle({ open, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className="fixed bottom-4 right-4 z-[54] flex items-center gap-2 bg-charcoal-700/95 border border-charcoal-300 hover:bg-charcoal-600 backdrop-blur-md rounded-full pl-2.5 pr-3.5 py-2 text-[0.75rem] text-white shadow-modal"
    >
      <span className="w-2 h-2 rounded-full bg-orange-400" />
      {open ? 'Hide design notes' : 'Show design notes'}
      <StickyNote size={13} className="text-smoke-500" />
    </button>
  )
}
