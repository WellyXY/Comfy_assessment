import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  ArrowUp,
  ChevronDown,
  Download,
  Film,
  Mic,
  Minus,
  Plus,
  Sparkles,
  Volume2,
  VolumeX,
  Wand2,
  X,
} from 'lucide-react'
import { UploadModal } from './UploadModal'
import type { LucideIcon } from 'lucide-react'

const PRODUCT_THUMB =
  'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=200&q=70'
const AVATAR_THUMB =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=70'

type FlowStep = {
  id: string
  label: string
  kind: 'input' | 'model' | 'output'
  thumb?: string
  icon?: LucideIcon
  sub?: string
  /** Optional data-coach tag for the onboarding coach to target this chip. */
  coachTag?: string
}

const FLOW: FlowStep[] = [
  { id: 'avatar', label: '@selfie', kind: 'input', thumb: AVATAR_THUMB, coachTag: 'avatar' },
  { id: 'product', label: '@outfits', kind: 'input', thumb: PRODUCT_THUMB, coachTag: 'product' },
  { id: 'model', label: 'Seedance 2.0', kind: 'model', icon: Wand2, sub: 'R2V' },
  { id: 'output', label: 'video', kind: 'output', icon: Film },
]

type Props = {
  onClose?: () => void
  /** Notify parent which flow step is selected so the canvas can highlight the matching node. */
  onSelectFlow?: (stepId: string) => void
  /** Lifted upload-modal state — lets the onboarding coach open the modal externally. */
  uploadFor?: 'avatar' | 'product' | null
  onUploadForChange?: (kind: 'avatar' | 'product' | null) => void
  /** Called when the character upload modal is confirmed — used by the onboarding coach. */
  onCharacterReplaced?: () => void
  /** Called when the product upload modal is confirmed — used by the onboarding coach. */
  onProductReplaced?: () => void
  /** Called when the bottom-right Run button is clicked — used by the onboarding coach. */
  onRunClicked?: () => void
}

export function AgentPanel({
  onClose,
  onSelectFlow,
  uploadFor: uploadForProp,
  onUploadForChange,
  onCharacterReplaced,
  onProductReplaced,
  onRunClicked,
}: Props) {
  const [selected, setSelected] = useState<string>('')
  const [note, setNote] = useState('run the work flow')
  // Local fallback if the parent doesn't supply lifted state (keeps the component standalone).
  const [uploadForLocal, setUploadForLocal] = useState<'avatar' | 'product' | null>(null)
  const uploadFor = uploadForProp !== undefined ? uploadForProp : uploadForLocal
  const setUploadFor = (v: 'avatar' | 'product' | null) => {
    if (onUploadForChange) onUploadForChange(v)
    else setUploadForLocal(v)
  }
  const [flowExpanded, setFlowExpanded] = useState(false)
  // Video result controls — mute toggle + click-to-zoom modal
  const [videoMuted, setVideoMuted] = useState(true)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const VIDEO_SRC = '/videos/agent-result.mp4'

  // On mount, scroll the conversation to the bottom so the final agent reply
  // (with the generated video) is fully in view from the start.
  const conversationRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = conversationRef.current
    if (!el) return
    // Use rAF so the layout (including the video's intrinsic height) has settled.
    const id = requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight
    })
    // Re-scroll once metadata for the video lands (its real height is known then).
    const video = el.querySelector('video') as HTMLVideoElement | null
    const onMeta = () => {
      el.scrollTop = el.scrollHeight
    }
    video?.addEventListener('loadedmetadata', onMeta)
    video?.addEventListener('loadeddata', onMeta)
    return () => {
      cancelAnimationFrame(id)
      video?.removeEventListener('loadedmetadata', onMeta)
      video?.removeEventListener('loadeddata', onMeta)
    }
  }, [])

  const handleChipClick = (step: FlowStep) => {
    setSelected(step.id)
    onSelectFlow?.(step.id)
    if (step.id === 'avatar' || step.id === 'product') {
      setUploadFor(step.id)
    }
  }

  return (
    <>
    <div className="absolute top-12 right-3 bottom-3 z-30 w-[22rem] bg-charcoal-700/95 backdrop-blur-md border border-charcoal-400 rounded-xl shadow-modal flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-charcoal-500 shrink-0">
        <button className="flex items-center gap-1 text-white font-semibold text-[0.75rem]">
          Product Photo to UGC
          <ChevronDown size={12} className="text-smoke-700" />
        </button>
        <button
          onClick={onClose}
          className="text-smoke-700 hover:text-white p-1"
          aria-label="Minimize"
        >
          <Minus size={14} />
        </button>
      </div>

      {/* Upper box — conversation (scrollable) with workflow chips pinned at its bottom edge */}
      <div className="flex-1 min-h-0 mx-2.5 mt-2.5 mb-2 bg-charcoal-600/40 border border-charcoal-400 rounded-xl overflow-hidden flex flex-col">
      <div
        ref={conversationRef}
        className="flex-1 overflow-y-auto px-3 pt-3 pb-[30px] space-y-4 min-h-0"
      >
        <UserMessage text="I'll pick the most scroll-stopping angle" />

        <AgentMessage>
          <div className="flex items-center gap-1.5 text-smoke-700 text-[0.625rem] mb-1.5">
            <Sparkles size={10} className="text-electric" />
            Analyzed your request
            <span>9s</span>
          </div>
          <p className="text-white text-[0.6875rem] leading-relaxed">
            Going with{' '}
            <span className="font-semibold">
              "the bathroom counter that isn't yours"
            </span>{' '}
            — you notice this bottle on someone else's counter and need to know
            what it is. Intimate, nosy, instantly relatable. The intrigue is
            built in.
          </p>
          <p className="text-white text-[0.6875rem] leading-relaxed mt-2">
            Now pick a visual aesthetic.
          </p>
          <button className="mt-2 flex items-center justify-between w-full bg-charcoal-600 hover:bg-charcoal-500 rounded-md px-2.5 py-2 text-[0.625rem] text-smoke-500 border border-charcoal-400">
            Tell me what you want
            <span className="flex items-center gap-0.5 text-smoke-700">
              <span className="w-2 h-[1px] bg-current" />
              <span className="w-2 h-[1px] bg-current" />
              <span className="w-2 h-[1px] bg-current" />
            </span>
          </button>
        </AgentMessage>

        <UserMessage text="Describe a specific look — I'll configure it" />

        {/* Final agent reply — generated result video with a dimmed workflow indicator above */}
        <AgentMessage>
          <div className="flex items-center gap-1.5 text-smoke-700 text-[0.625rem] mb-1.5">
            <Sparkles size={10} className="text-electric" />
            Generated
            <span>12s</span>
          </div>

          {/* Read-only flow label — chips laid out the same way as the bottom workflow (flex-wrap).
              No background/padding wrapper, so the first chip's left edge sits at left:0 — same
              as the video below. `noCoach` strips data-coach so the spotlight targets the
              interactive chips in the pinned bottom row, not these. */}
          <div className="opacity-50 pointer-events-none mb-1.5">
            <div className="flex items-center gap-0.5 flex-wrap">
              {FLOW.map((step, i) => (
                <FlowFragment
                  key={`result-${step.id}`}
                  step={step}
                  index={i}
                  selected={false}
                  onClick={() => {}}
                  prevKind={i > 0 ? FLOW[i - 1].kind : undefined}
                  noCoach
                />
              ))}
            </div>
          </div>

          {/* Video result — 49% width, left-aligned. Hover for mute/download; click to zoom. */}
          <div
            data-coach="result"
            className="group relative w-[49%] rounded-md overflow-hidden border border-charcoal-400 bg-black cursor-zoom-in"
            onClick={() => setVideoModalOpen(true)}
          >
            <video
              src={VIDEO_SRC}
              autoPlay
              loop
              muted={videoMuted}
              playsInline
              className="block w-full h-auto"
            />

            {/* Hover overlay controls — mute toggle + download */}
            <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setVideoMuted((m) => !m)
                }}
                aria-label={videoMuted ? 'Unmute' : 'Mute'}
                className="p-1 bg-black/60 backdrop-blur-md rounded-md text-white hover:bg-black/80"
              >
                {videoMuted ? <VolumeX size={11} /> : <Volume2 size={11} />}
              </button>
              <a
                href={VIDEO_SRC}
                download="agent-result.mp4"
                onClick={(e) => e.stopPropagation()}
                aria-label="Download video"
                className="p-1 bg-black/60 backdrop-blur-md rounded-md text-white hover:bg-black/80 flex items-center justify-center"
              >
                <Download size={11} />
              </a>
            </div>
          </div>
        </AgentMessage>
      </div>

      {/* Workflow chips — pinned at the bottom edge of the upper box (sibling of the scrollable conversation) */}
      <div data-tag="agent-flow" className="px-3 py-2 shrink-0 border-t border-charcoal-500/60 bg-charcoal-700/30">
        <button
          onClick={() => setFlowExpanded((v) => !v)}
          className="flex items-center justify-between w-full text-[0.5625rem] uppercase tracking-[0.12em] font-semibold mb-1.5 group"
        >
          <span className="flex items-center gap-1 text-smoke-700 group-hover:text-white">
            <ChevronDown
              size={9}
              className={`transition-transform ${flowExpanded ? '' : '-rotate-90'}`}
            />
            Workflow
          </span>
          <span className="flex items-center gap-0.5 text-electric/80 group-hover:text-electric normal-case font-medium tracking-normal text-[0.5625rem]">
            {flowExpanded ? 'Hide' : 'Show all'}
            <ChevronDown
              size={9}
              className={`transition-transform ${flowExpanded ? 'rotate-180' : ''}`}
            />
          </span>
        </button>
        <div
          className={`flex items-center gap-0.5 flex-wrap ${
            flowExpanded ? '' : 'max-h-[2.75rem] overflow-hidden'
          }`}
        >
          {FLOW.map((step, i) => (
            <FlowFragment
              key={step.id}
              step={step}
              index={i}
              selected={selected === step.id}
              onClick={() => handleChipClick(step)}
              prevKind={i > 0 ? FLOW[i - 1].kind : undefined}
            />
          ))}
        </div>
      </div>
      </div>{/* /upper box */}

      {/* Lower box — unified rounded composer: input on top, action row below. Step 3 spotlight covers this whole box. */}
      <div className="px-2.5 pb-2.5 shrink-0">
        <div
          data-coach="run"
          className="bg-charcoal-600 rounded-xl border border-charcoal-400 overflow-hidden"
        >
          {/* Prompt input */}
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What do you want to do?"
            className="w-full bg-transparent px-3 pt-2.5 pb-1.5 text-white text-[0.6875rem] outline-none placeholder:text-smoke-700"
          />

          {/* Action row */}
          <div className="flex items-center justify-between px-2 pb-1.5">
            <label
              aria-label="Upload assets"
              className="flex items-center justify-center w-5 h-5 rounded-md text-smoke-500 hover:text-white cursor-pointer transition-colors"
            >
              <Plus size={12} />
              <input type="file" accept="image/*,video/*" multiple className="hidden" />
            </label>
            <div className="flex items-center gap-1.5">
              <button className="text-smoke-500 hover:text-white">
                <Mic size={11} />
              </button>
              <button
                onClick={onRunClicked}
                className="w-5 h-5 rounded-full bg-electric flex items-center justify-center text-black hover:bg-electric/90"
                aria-label="Send"
              >
                <ArrowUp size={10} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {uploadFor && (
      <UploadModal
        label={uploadFor === 'avatar' ? 'Avatar' : 'Product'}
        thumb={uploadFor === 'avatar' ? AVATAR_THUMB : PRODUCT_THUMB}
        onClose={() => setUploadFor(null)}
        onReplace={() => {
          if (uploadFor === 'avatar') onCharacterReplaced?.()
          else if (uploadFor === 'product') onProductReplaced?.()
          setUploadFor(null)
        }}
      />
    )}

    {videoModalOpen && (
      <VideoPlayerModal
        src={VIDEO_SRC}
        onClose={() => setVideoModalOpen(false)}
      />
    )}
    </>
  )
}

function VideoPlayerModal({
  src,
  onClose,
}: {
  src: string
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90%] max-w-[90%]"
      >
        <video
          src={src}
          autoPlay
          loop
          controls
          playsInline
          className="max-h-[85vh] max-w-full rounded-lg shadow-modal"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-charcoal-700 border border-charcoal-300 text-white grid place-items-center hover:bg-charcoal-600 shadow-lg"
        >
          <X size={14} />
        </button>
        <a
          href={src}
          download="agent-result.mp4"
          onClick={(e) => e.stopPropagation()}
          aria-label="Download video"
          className="absolute -top-3 -right-12 w-7 h-7 rounded-full bg-charcoal-700 border border-charcoal-300 text-white grid place-items-center hover:bg-charcoal-600 shadow-lg"
        >
          <Download size={13} />
        </a>
      </div>
    </div>
  )
}

function FlowFragment({
  step,
  index,
  selected,
  onClick,
  prevKind,
  noCoach,
}: {
  step: FlowStep
  index: number
  selected: boolean
  onClick: () => void
  prevKind?: FlowStep['kind']
  /** Skip the data-coach attribute (used by the dimmed read-only indicator inside the agent reply). */
  noCoach?: boolean
}) {
  return (
    <>
      {index > 0 && (
        <span className="text-smoke-700 mx-0.5">
          {prevKind === 'input' && step.kind === 'input' ? (
            <Plus size={9} />
          ) : (
            <ArrowRight size={9} />
          )}
        </span>
      )}
      <FlowChip step={step} selected={selected} onClick={onClick} noCoach={noCoach} />
    </>
  )
}

function FlowChip({
  step,
  selected,
  onClick,
  noCoach,
}: {
  step: FlowStep
  selected: boolean
  onClick: () => void
  noCoach?: boolean
}) {
  const Icon = step.icon
  return (
    <button
      data-coach={noCoach ? undefined : step.coachTag}
      onClick={onClick}
      className={`flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[0.625rem] transition-all ${
        selected
          ? 'bg-electric/15 border-electric text-white shadow-[0_0_0_2px_rgba(240,255,65,0.08)]'
          : 'bg-charcoal-700 border-charcoal-300 text-smoke-300 hover:border-charcoal-100 hover:text-white'
      }`}
    >
      {step.thumb ? (
        <img
          src={step.thumb}
          alt=""
          className="w-3.5 h-3.5 rounded-sm object-cover"
        />
      ) : Icon ? (
        <Icon
          size={10}
          className={selected ? 'text-electric' : 'text-smoke-500'}
        />
      ) : null}
      <span className="font-medium">{step.label}</span>
      {step.sub && (
        <span className="text-smoke-700 text-[0.625rem]">·{step.sub}</span>
      )}
    </button>
  )
}

function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="bg-charcoal-500 text-white text-[0.6875rem] rounded-2xl px-3 py-1.5 max-w-[85%] leading-snug">
        {text}
      </div>
    </div>
  )
}

function AgentMessage({ children }: { children: React.ReactNode }) {
  return <div className="max-w-full">{children}</div>
}

function AssetTile({ label, thumb }: { label: string; thumb: string }) {
  return (
    <div className="relative w-[4.25rem] h-[4.25rem] rounded-lg overflow-hidden bg-charcoal-500 ring-1 ring-charcoal-300 shrink-0 group">
      <img
        src={thumb}
        alt={label}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="absolute bottom-1 left-0 right-0 text-center text-white text-[0.5625rem] font-bold tracking-[0.08em]">
        {label}
      </div>
      <button
        className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-black/55 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 flex items-center justify-center"
        aria-label={`Remove ${label}`}
      >
        <X size={7} />
      </button>
    </div>
  )
}
