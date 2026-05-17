import { memo } from 'react'

type Point = { x: number; y: number }

type Props = {
  from: Point
  to: Point
  color?: string
}

function WireOverlayInner({ from, to, color = '#9aa6c4' }: Props) {
  const dx = Math.max(40, Math.abs(to.x - from.x) * 0.4)
  const path = `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width="100%"
      height="100%"
      style={{ overflow: 'visible' }}
    >
      <path
        d={path}
        stroke={color}
        strokeWidth={2}
        fill="none"
        opacity={0.95}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export const WireOverlay = memo(
  WireOverlayInner,
  (a, b) =>
    a.from.x === b.from.x &&
    a.from.y === b.from.y &&
    a.to.x === b.to.x &&
    a.to.y === b.to.y &&
    a.color === b.color,
)
