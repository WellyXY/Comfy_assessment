import {
  ChevronDown,
  Film,
  GitFork,
  Image as ImageIcon,
  Layers,
  Minus,
  Plus,
  Settings2,
  Shuffle,
  Type,
  Upload,
} from 'lucide-react'
import { memo, useState } from 'react'
import { UploadModal } from '../UploadModal'

type Field =
  | { label: string; type: 'number'; value: number }
  | { label: string; type: 'text'; value: string }
  | { label: string; type: 'select'; value: string }
  | { label: string; type: 'seed'; value: string }

type Socket = { id: string; label: string; color?: string }

type NodeProps = {
  x: number
  y: number
  w: number
  title: string
  prompt?: string
  fields?: Field[]
  inputs?: Socket[]
  outputs?: Socket[]
  showSubgraph?: boolean
  onDrag?: (dx: number, dy: number) => void
  onSocketClick?: () => void
  // New props for complex workflow nodes
  accent?: 'green' | 'amber' | 'plain'
  previewImage?: string
  previewCaption?: string
  textTitle?: string
  textContent?: string
  advancedToggle?: boolean
  collapsedByDefault?: boolean
  /** When true, the node renders with an electric outline (selection from agent panel). */
  highlighted?: boolean
  /** data-coach attribute — lets the canvas coach target this specific node. */
  coachTag?: string
}

const ACCENT = {
  green: {
    header: 'bg-[#1f3a2a]',
    border: 'border-[#3d6e54]',
    titleColor: 'text-[#a9d9b8]',
  },
  amber: {
    header: 'bg-[#3a2f1f]',
    border: 'border-[#7a5a30]',
    titleColor: 'text-[#e8c489]',
  },
  plain: {
    header: 'bg-charcoal-600',
    border: 'border-charcoal-400',
    titleColor: 'text-white',
  },
} as const

function FieldRow({ field }: { field: Field }) {
  switch (field.type) {
    case 'number':
      return (
        <div className="flex items-center justify-between py-1 text-[0.8125rem]">
          <div className="text-smoke-700 px-2 w-20">{field.label}</div>
          <div className="flex items-center flex-1 mr-2 bg-charcoal-500 rounded">
            <button className="px-1.5 py-0.5 text-smoke-700 hover:text-white">
              <Minus size={10} />
            </button>
            <input
              defaultValue={field.value}
              className="flex-1 text-center bg-transparent outline-none text-white"
            />
            <button className="px-1.5 py-0.5 text-smoke-700 hover:text-white">
              <Plus size={10} />
            </button>
          </div>
        </div>
      )
    case 'seed':
      return (
        <div className="flex items-center justify-between py-1 text-[0.8125rem]">
          <div className="text-smoke-700 px-2 w-20">{field.label}</div>
          <div className="flex items-center flex-1 mr-2 bg-charcoal-500 rounded gap-0.5">
            <button className="px-1.5 py-0.5 text-smoke-700 hover:text-white">
              <Minus size={10} />
            </button>
            <input
              defaultValue={field.value}
              className="flex-1 bg-transparent outline-none text-white text-center"
            />
            <button className="px-1 py-0.5 bg-run/80 rounded text-white">
              <Shuffle size={10} />
            </button>
            <button className="px-1.5 py-0.5 text-smoke-700 hover:text-white">
              <Plus size={10} />
            </button>
          </div>
        </div>
      )
    case 'select':
      return (
        <div className="flex items-center justify-between py-1 text-[0.8125rem]">
          <div className="text-smoke-700 px-2 w-24">{field.label}</div>
          <button className="flex items-center justify-between bg-charcoal-500 rounded flex-1 mr-2 px-2 py-1 text-white truncate">
            <span className="truncate">{field.value || '—'}</span>
            <ChevronDown size={10} className="text-smoke-700 shrink-0 ml-1" />
          </button>
        </div>
      )
    case 'text':
      return (
        <div className="flex items-center justify-between py-1 text-[0.8125rem]">
          <div className="text-smoke-700 px-2 w-24 truncate">{field.label}</div>
          <input
            defaultValue={field.value}
            className="flex-1 mr-2 min-w-0 bg-charcoal-500 rounded px-2 py-1 text-white outline-none"
          />
        </div>
      )
  }
}

/** Map a socket label to a Lucide icon. Recognised: image / mask / video / string-or-text / value-combo. */
function socketIconFor(label: string) {
  const l = label.toLowerCase()
  if (l.includes('mask')) return Layers
  if (l.includes('video')) return Film
  if (l.includes('string') || l.includes('text') || l.includes('prompt'))
    return Type
  if (l.includes('combo') || l.includes('value')) return Settings2
  return ImageIcon
}

/** Icon-style socket button — rounded-square with a type icon (replaces the older colored dot). */
function SocketIcon({
  label,
  color = '#9aa6c4',
  onClick,
}: {
  label: string
  color?: string
  onClick?: () => void
}) {
  const Icon = socketIconFor(label)
  return (
    <button
      type="button"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      className="grid place-items-center w-6 h-6 rounded-md bg-charcoal-600 border border-charcoal-300 text-smoke-300 shadow hover:text-white hover:border-electric/70 transition-all cursor-crosshair"
      style={{ borderColor: `${color}55` }}
      aria-label={`Socket: ${label}`}
    >
      <Icon size={11} style={{ color }} />
    </button>
  )
}

function NodeInner({
  x,
  y,
  w,
  title,
  prompt,
  fields,
  inputs,
  outputs,
  showSubgraph,
  onDrag,
  onSocketClick,
  accent = 'plain',
  previewImage,
  previewCaption,
  textTitle,
  textContent,
  advancedToggle,
  collapsedByDefault,
  highlighted,
  coachTag,
}: NodeProps) {
  const [collapsed, setCollapsed] = useState(!!collapsedByDefault)
  const [isDragging, setIsDragging] = useState(false)
  // Workflow-node image replacement modal. Same UploadModal component used by the agent panel chips.
  const [uploading, setUploading] = useState(false)
  const accentStyles = ACCENT[accent]

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

  // Visual padding-top so socket-row content begins below header (header h ~28px + body py-2)
  const socketBaseTop = 30
  const socketStep = 28

  return (
    <div
      data-coach={coachTag}
      className={`absolute pointer-events-auto rounded-node bg-charcoal-700 border ${accentStyles.border} shadow-node overflow-visible transition-all ${
        isDragging ? 'border-run/60 shadow-lg' : ''
      } ${
        highlighted
          ? 'ring-2 ring-electric ring-offset-2 ring-offset-charcoal-800 shadow-[0_0_0_6px_rgba(240,255,65,0.12)]'
          : ''
      }`}
      style={{ left: x, top: y, width: w }}
    >
      {/* Header — drag handle */}
      <div
        onPointerDown={handlePointerDown}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 select-none border-b ${accentStyles.header} ${accentStyles.border} ${
          onDrag ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-pointer'
        }`}
        onDoubleClick={() => setCollapsed((c) => !c)}
      >
        <ChevronDown
          size={11}
          className={`text-smoke-700 transition-transform ${collapsed ? '-rotate-90' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            setCollapsed((c) => !c)
          }}
        />
        <span className={`text-[0.78rem] font-medium truncate ${accentStyles.titleColor}`}>
          {title}
        </span>
      </div>

      {!collapsed && (
        <div className="py-2 relative">
          {/* Output sockets — icon buttons that float off the right edge */}
          {outputs?.map((s, i) => (
            <div
              key={`out-${s.id}`}
              className="absolute right-0 translate-x-1/2"
              style={{ top: socketBaseTop + i * socketStep - 30 }}
            >
              <SocketIcon label={s.label} color={s.color} onClick={onSocketClick} />
            </div>
          ))}

          {/* Input sockets — icon buttons that float off the left edge */}
          {inputs?.map((s, i) => (
            <div
              key={`in-${s.id}`}
              className="absolute left-0 -translate-x-1/2"
              style={{ top: socketBaseTop + i * socketStep - 30 }}
            >
              <SocketIcon label={s.label} color={s.color} onClick={onSocketClick} />
            </div>
          ))}

          {/* Spacer so following content clears socket rows */}
          {(outputs?.length || inputs?.length) && (
            <div style={{ height: Math.max(outputs?.length ?? 0, inputs?.length ?? 0) * socketStep }} />
          )}

          {/* Preview image — clickable to open the shared UploadModal. */}
          {previewImage && (
            <div
              className="mx-2 mb-2 cursor-pointer group/upload"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation()
                setUploading(true)
              }}
            >
              <div className="rounded overflow-hidden bg-black/30 relative">
                <img
                  src={previewImage}
                  alt={title}
                  className="w-full object-cover"
                  style={{ aspectRatio: '4/5' }}
                />
                {/* Hover overlay — signals the image is replaceable. */}
                <div className="absolute inset-0 grid place-items-center bg-black/55 opacity-0 group-hover/upload:opacity-100 transition-opacity duration-150">
                  <span className="inline-flex items-center gap-1 rounded-full bg-electric px-2.5 py-1 text-[0.625rem] font-semibold text-black shadow-lg whitespace-nowrap">
                    <Upload size={10} />
                    Replace
                  </span>
                </div>
              </div>
              {previewCaption && (
                <div className="text-center text-[0.72rem] text-smoke-700 mt-1">
                  {previewCaption}
                </div>
              )}
            </div>
          )}

          {/* Text block (Prompt Template / Grid nodes) */}
          {textContent && (
            <div className="mx-2 mb-1">
              {textTitle && (
                <div className="text-[0.625rem] text-smoke-700 mb-1 px-1 uppercase tracking-wider">
                  {textTitle}
                </div>
              )}
              <div className="bg-charcoal-500 rounded p-2 text-[0.6875rem] leading-snug font-mono text-smoke-300 max-h-[12rem] overflow-y-auto whitespace-pre-wrap">
                {textContent}
              </div>
            </div>
          )}

          {/* Prompt — clean inline text, no input chrome */}
          {prompt !== undefined && (
            <div className="mx-3 mb-2 mt-1 text-[0.78rem] leading-relaxed text-smoke-300">
              {prompt}
            </div>
          )}

          {/* Field rows */}
          {fields?.map((f) => <FieldRow key={f.label} field={f} />)}

          {advancedToggle && (
            <div className="flex justify-center pt-1">
              <button className="text-[0.6875rem] text-smoke-700 hover:text-white">
                Show advanced inputs ▾
              </button>
            </div>
          )}

          {showSubgraph && (
            <div className="flex justify-center pt-1 pb-1">
              <button className="flex items-center gap-1.5 text-[0.75rem] text-smoke-500 hover:text-white bg-charcoal-500 hover:bg-charcoal-400 rounded-full px-3 py-0.5">
                Enter subgraph
                <GitFork size={9} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Image-replacement modal — portals to body so it covers the viewport. */}
      {uploading && previewImage && (
        <UploadModal
          label={title}
          thumb={previewImage}
          onClose={() => setUploading(false)}
        />
      )}
    </div>
  )
}

// Memo: skip re-render of un-dragged nodes. Custom comparator ignores callback
// identity (Canvas recreates onDrag per render) and compares only visual props.
export const Node = memo(NodeInner, (a, b) =>
  a.x === b.x &&
  a.y === b.y &&
  a.w === b.w &&
  a.title === b.title &&
  a.prompt === b.prompt &&
  a.fields === b.fields &&
  a.inputs === b.inputs &&
  a.outputs === b.outputs &&
  a.showSubgraph === b.showSubgraph &&
  a.accent === b.accent &&
  a.previewImage === b.previewImage &&
  a.previewCaption === b.previewCaption &&
  a.textTitle === b.textTitle &&
  a.textContent === b.textContent &&
  a.advancedToggle === b.advancedToggle &&
  a.collapsedByDefault === b.collapsedByDefault &&
  a.highlighted === b.highlighted &&
  a.coachTag === b.coachTag,
)
