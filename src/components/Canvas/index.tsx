import { useEffect, useMemo, useRef, useState } from 'react'
import { Crosshair, Maximize, Minus, MousePointer2, Plus } from 'lucide-react'
import { ugcWorkflow, type WorkflowNode } from '../../data/ugcWorkflow'
import { Node } from './Node'
import { WireOverlay } from './WireOverlay'

type Props = {
  showWorkflow: boolean
  /** Flow step from the AgentPanel — used to highlight matching workflow nodes. */
  selectedFlow?: string
}

// Map a flow chip id to the workflow node IDs it represents.
const FLOW_TO_NODES: Record<string, string[]> = {
  avatar: ['character'],
  product: ['outfit-1', 'outfit-2', 'outfit-3'],
  model: ['seedance'],
  output: ['save-video'],
}

type Pos = { x: number; y: number }

const SOCKET_DX = 0
const SOCKET_DY = 42
const SOCKET_STEP = 28

const MIN_ZOOM = 0.25
const MAX_ZOOM = 1.5
const DEFAULT_ZOOM = 0.55

function socketIndex(
  node: WorkflowNode,
  kind: 'output' | 'input',
  id: string,
): number {
  const list = kind === 'output' ? node.outputs ?? [] : node.inputs ?? []
  const i = list.findIndex((s) => s.id === id)
  return Math.max(0, i)
}

export function Canvas({ showWorkflow, selectedFlow }: Props) {
  const highlightedIds = new Set(
    selectedFlow ? FLOW_TO_NODES[selectedFlow] ?? [] : [],
  )
  const initial = useMemo<Record<string, Pos>>(() => {
    const m: Record<string, Pos> = {}
    for (const n of ugcWorkflow.nodes) m[n.id] = { x: n.x, y: n.y }
    return m
  }, [])
  const [positions, setPositions] = useState<Record<string, Pos>>(initial)
  const [pan, setPan] = useState<Pos>({ x: 40, y: 40 })
  const [isPanning, setIsPanning] = useState(false)
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const containerRef = useRef<HTMLDivElement>(null)

  const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z))

  const updateNodePos = (id: string, dx: number, dy: number) => {
    // Drag deltas are in screen pixels; convert to world coords by dividing by zoom
    setPositions((prev) => ({
      ...prev,
      [id]: { x: prev[id].x + dx / zoom, y: prev[id].y + dy / zoom },
    }))
  }

  const handleCanvasPanStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return
    e.preventDefault()
    setIsPanning(true)
    let lastX = e.clientX
    let lastY = e.clientY
    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - lastX
      const dy = ev.clientY - lastY
      lastX = ev.clientX
      lastY = ev.clientY
      setPan((p) => ({ x: p.x + dx, y: p.y + dy }))
    }
    const onUp = () => {
      setIsPanning(false)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
  }

  // Wheel zoom: scroll to zoom (Comfy-style; no modifier needed)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const dir = e.deltaY > 0 ? -1 : 1
      const step = e.shiftKey ? 0.015 : 0.03
      setZoom((z) => clampZoom(z + dir * step))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const socketPoint = (
    nodeId: string,
    kind: 'output' | 'input',
    socketId: string,
  ): Pos => {
    const node = ugcWorkflow.nodes.find((n) => n.id === nodeId)!
    const pos = positions[nodeId]
    const idx = socketIndex(node, kind, socketId)
    const y = pos.y + SOCKET_DY + idx * SOCKET_STEP
    const x = kind === 'output' ? pos.x + node.w - SOCKET_DX : pos.x + SOCKET_DX
    return { x, y }
  }

  const zoomPct = Math.round(zoom * 100)

  return (
    <div
      ref={containerRef}
      onPointerDown={handleCanvasPanStart}
      className={`absolute inset-0 canvas-grid overflow-hidden ${
        isPanning ? 'cursor-grabbing' : showWorkflow ? 'cursor-grab' : ''
      }`}
      style={{
        backgroundPosition: `${pan.x}px ${pan.y}px`,
        backgroundSize: `${22 * zoom}px ${22 * zoom}px`,
      }}
    >
      {/* Pan + zoom transform layer.
          Explicit size so absolutely-positioned wires (SVG inset-0) have a
          non-zero parent box to render against. */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          width: 4000,
          height: 3000,
        }}
      >
        <div className="pointer-events-none relative w-full h-full">
          {showWorkflow && (
            <>
              {ugcWorkflow.wires.map((w, i) => (
                <WireOverlay
                  key={i}
                  from={socketPoint(w.from.nodeId, 'output', w.from.output)}
                  to={socketPoint(w.to.nodeId, 'input', w.to.input)}
                  color="#7d8aa0"
                />
              ))}

              {ugcWorkflow.nodes.map((n) => {
                const p = positions[n.id]
                return (
                  <Node
                    key={n.id}
                    x={p.x}
                    y={p.y}
                    w={n.w}
                    title={n.title}
                    accent={n.accent ?? 'plain'}
                    previewImage={n.previewImage}
                    previewCaption={n.previewCaption}
                    textTitle={n.textTitle}
                    textContent={n.textContent}
                    prompt={n.prompt}
                    fields={n.fields as any}
                    inputs={n.inputs}
                    outputs={n.outputs}
                    showSubgraph={n.showSubgraph}
                    advancedToggle={n.advancedToggle}
                    collapsedByDefault={n.collapsedByDefault}
                    highlighted={highlightedIds.has(n.id)}
                    coachTag={n.coachTag}
                    onDrag={(dx, dy) => updateNodePos(n.id, dx, dy)}
                  />
                )
              })}
            </>
          )}
        </div>
      </div>

      {/* Bottom-right floating zoom controls */}
      <div
        className="absolute right-3 bottom-3 flex items-center gap-1 bg-charcoal-700/85 border border-charcoal-400 rounded-md px-1.5 h-7 text-[0.8125rem] text-smoke-700"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setZoom((z) => clampZoom(z - 0.1))}
          className="px-1 py-0.5 hover:text-white"
          aria-label="Zoom out"
        >
          <Minus size={12} />
        </button>
        <button
          onClick={() => setZoom(DEFAULT_ZOOM)}
          className="text-white text-[0.78rem] font-mono tabular-nums min-w-[3rem] text-center hover:text-electric"
          aria-label="Reset zoom"
        >
          {zoomPct}%
        </button>
        <button
          onClick={() => setZoom((z) => clampZoom(z + 0.1))}
          className="px-1 py-0.5 hover:text-white"
          aria-label="Zoom in"
        >
          <Plus size={12} />
        </button>
        <span className="text-charcoal-300">|</span>
        <button
          onClick={() => {
            setZoom(DEFAULT_ZOOM)
            setPan({ x: 40, y: 40 })
          }}
          className="px-1 py-0.5 hover:text-white"
          aria-label="Fit to view"
        >
          <Maximize size={12} />
        </button>
        <span className="text-charcoal-300">|</span>
        <MousePointer2 size={12} />
        <span className="text-charcoal-300">|</span>
        <Crosshair size={12} />
      </div>
    </div>
  )
}
