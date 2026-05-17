import { useLayoutEffect, useState } from 'react'

type Props = {
  noteEl: HTMLElement | null
  targetSelector: string
}

type Pts = { from: { x: number; y: number }; to: { x: number; y: number } }

export function ConnectionOverlay({ noteEl, targetSelector }: Props) {
  const [pts, setPts] = useState<Pts | null>(null)

  useLayoutEffect(() => {
    if (!noteEl) {
      setPts(null)
      return
    }
    const target = document.querySelector<HTMLElement>(targetSelector)
    if (!target) {
      setPts(null)
      return
    }

    const compute = () => {
      const nr = noteEl.getBoundingClientRect()
      const tr = target.getBoundingClientRect()

      // Anchor on the note: left-middle edge
      const from = { x: nr.left, y: nr.top + nr.height / 2 }

      // Anchor on the target: nearest edge to the note
      // If the target is to the LEFT of the note, use its right edge.
      // If above/below, use its top/bottom centerpoint.
      const tCenterX = tr.left + tr.width / 2
      const tCenterY = tr.top + tr.height / 2

      let to: { x: number; y: number }
      if (tr.right < from.x) {
        // target left of note
        to = { x: tr.right, y: tCenterY }
      } else if (tr.left > from.x) {
        // target right of note (rare)
        to = { x: tr.left, y: tCenterY }
      } else {
        // target overlaps note horizontally — pick nearest top/bottom
        to = { x: tCenterX, y: tr.top < from.y ? tr.bottom : tr.top }
      }
      setPts({ from, to })
    }

    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(noteEl)
    ro.observe(target)
    window.addEventListener('scroll', compute, true)
    window.addEventListener('resize', compute)
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', compute, true)
      window.removeEventListener('resize', compute)
    }
  }, [noteEl, targetSelector])

  if (!pts) return null

  const { from, to } = pts
  const dx = Math.max(120, Math.abs(from.x - to.x) * 0.6)
  // Bezier curve sweeping from note left → target
  const path = `M ${from.x} ${from.y} C ${from.x - dx} ${from.y}, ${to.x + dx} ${to.y}, ${to.x} ${to.y}`

  return (
    <svg
      className="fixed inset-0 pointer-events-none z-[60]"
      width="100%"
      height="100%"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d={path}
        stroke="#fb923c"
        strokeWidth={1.5}
        fill="none"
        strokeDasharray="4 4"
        filter="url(#glow)"
      />
      {/* Endpoint dots */}
      <circle cx={from.x} cy={from.y} r={3} fill="#fb923c" />
      <circle cx={to.x} cy={to.y} r={5} fill="#fb923c" opacity={0.25} />
      <circle cx={to.x} cy={to.y} r={2.5} fill="#fb923c" />
    </svg>
  )
}
