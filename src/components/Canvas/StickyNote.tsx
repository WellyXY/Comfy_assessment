import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

type Props = {
  x: number
  y: number
  w: number
  title: string
  body?: string
  tone?: 'instruction' | 'cta'
  onDrag?: (dx: number, dy: number) => void
}

export function StickyNote({ x, y, w, title, body, tone = 'instruction', onDrag }: Props) {
  const [isDragging, setIsDragging] = useState(false)

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!onDrag) return
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    let lastX = e.clientX
    let lastY = e.clientY
    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - lastX
      const dy = ev.clientY - lastY
      lastX = ev.clientX
      lastY = ev.clientY
      onDrag(dx, dy)
    }
    const onUp = () => {
      setIsDragging(false)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
  }

  return (
    <div
      className={`absolute sticky-note rounded-node text-[0.84rem] text-white ${
        isDragging ? 'ring-1 ring-amber-300/40' : ''
      }`}
      style={{ left: x, top: y, width: w }}
    >
      <div
        onPointerDown={handlePointerDown}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 border-b border-charcoal-400 select-none ${
          onDrag ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''
        }`}
      >
        <ChevronDown size={11} className="text-smoke-700" />
        <span className="font-medium">{title}</span>
      </div>
      {body && (
        <div className="px-3 py-2 whitespace-pre-line leading-snug text-smoke-300">
          {body}
        </div>
      )}
      {tone === 'cta' && !body && <div className="h-6" />}
    </div>
  )
}
