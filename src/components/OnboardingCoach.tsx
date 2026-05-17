import { useEffect, useLayoutEffect, useRef, useState, type ComponentType } from 'react'
import { createPortal } from 'react-dom'
import { ImagePlus, Package, Sparkles, type LucideProps } from 'lucide-react'

type CoachStep = {
  selector: string
  title: string
  body: string
  Icon: ComponentType<LucideProps>
  side: 'left' | 'right' | 'top' | 'bottom'
  /** Label for the primary CTA on this step (was "Next"). */
  primaryLabel: string
}

const STEPS: CoachStep[] = [
  {
    selector: '[data-coach="avatar"]',
    title: 'Step 1 · Replace character',
    body: 'Click @avatar to upload your character. Identity stays consistent across every shot.',
    Icon: ImagePlus,
    side: 'left',
    primaryLabel: 'Upload',
  },
  {
    selector: '[data-coach="product"]',
    title: 'Step 2 · Replace product',
    body: 'Now click @product to drop in your product. Shape and color stay locked.',
    Icon: Package,
    side: 'left',
    primaryLabel: 'Upload',
  },
  {
    selector: '[data-coach="run"]',
    title: 'Step 3 · Generate',
    body: 'All set. Hit the Run button to generate your UGC video.',
    Icon: Sparkles,
    side: 'left',
    primaryLabel: 'Generate',
  },
]

const TOOLTIP_W = 280
const TOOLTIP_GAP = 16
const SPOTLIGHT_PAD = 8

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

type Props = {
  /** -1 = dismissed; 0..n-1 = active step index */
  step: number
  onAdvance: () => void
  onDismiss: () => void
  /** Optional override for the primary CTA — when provided, runs this instead of `onAdvance`.
      Used to actually open the upload modal on steps 1 & 2. */
  onPrimaryAction?: (step: number) => void
}

export function OnboardingCoach({
  step,
  onAdvance,
  onDismiss,
  onPrimaryAction,
}: Props) {
  const [rect, setRect] = useState<DOMRect | null>(null)
  const [mounted, setMounted] = useState(false)
  // Measure the actual tooltip box so we can clamp it inside the viewport
  // (previously we used a fixed estimate that was too small and clipped the footer).
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [tooltipSize, setTooltipSize] = useState({ w: 280, h: 200 })
  useLayoutEffect(() => {
    if (!tooltipRef.current) return
    const r = tooltipRef.current.getBoundingClientRect()
    setTooltipSize((prev) =>
      prev.w === r.width && prev.h === r.height ? prev : { w: r.width, h: r.height },
    )
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (step < 0 || step >= STEPS.length) {
      setRect(null)
      return
    }
    const sel = STEPS[step].selector
    let raf = 0
    const tick = () => {
      const el = document.querySelector(sel)
      if (el) {
        const r = el.getBoundingClientRect()
        setRect((prev) =>
          prev &&
          prev.top === r.top &&
          prev.left === r.left &&
          prev.width === r.width &&
          prev.height === r.height
            ? prev
            : r,
        )
      } else {
        setRect(null)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [step])

  if (!mounted || step < 0 || step >= STEPS.length || !rect) return null

  const current = STEPS[step]
  const Icon = current.Icon

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800

  // Use the measured tooltip box so the card stays fully inside the viewport.
  const tw = tooltipSize.w
  const th = tooltipSize.h

  let top = rect.top
  let left = rect.left

  if (current.side === 'left') {
    left = rect.left - tw - TOOLTIP_GAP
    top = rect.top + rect.height / 2 - th / 2
  } else if (current.side === 'right') {
    left = rect.right + TOOLTIP_GAP
    top = rect.top + rect.height / 2 - th / 2
  } else if (current.side === 'top') {
    top = rect.top - TOOLTIP_GAP - th
    left = rect.left + rect.width / 2 - tw / 2
  } else {
    top = rect.bottom + TOOLTIP_GAP
    left = rect.left + rect.width / 2 - tw / 2
  }

  // Clamp using the *measured* size so the card is never clipped at the viewport edges.
  top = clamp(top, 16, vh - th - 16)
  left = clamp(left, 16, vw - tw - 16)

  return createPortal(
    <>
      {/* Dim everything, spotlight a rounded hole over the target */}
      <div
        className="pointer-events-none fixed z-[90] rounded-lg transition-all duration-150"
        style={{
          top: rect.top - SPOTLIGHT_PAD,
          left: rect.left - SPOTLIGHT_PAD,
          width: rect.width + SPOTLIGHT_PAD * 2,
          height: rect.height + SPOTLIGHT_PAD * 2,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
        }}
      />
      {/* Electric ring around the spotlight to make the target obvious */}
      <div
        className="pointer-events-none fixed z-[91] rounded-lg ring-2 ring-electric animate-pulse transition-all duration-150"
        style={{
          top: rect.top - SPOTLIGHT_PAD,
          left: rect.left - SPOTLIGHT_PAD,
          width: rect.width + SPOTLIGHT_PAD * 2,
          height: rect.height + SPOTLIGHT_PAD * 2,
        }}
      />

      {/* Tooltip card */}
      <div
        ref={tooltipRef}
        className="fixed z-[100] w-[280px] rounded-xl border border-charcoal-300 bg-charcoal-700 p-3.5 shadow-modal"
        style={{ top, left }}
      >
        <div className="-mt-7 mb-2 grid h-9 w-9 place-items-center rounded-full border border-charcoal-300 bg-charcoal-600 shadow-lg">
          <Icon className="h-4 w-4 text-electric" />
        </div>
        <h4 className="mb-1 text-[0.8125rem] font-bold text-white">
          {current.title}
        </h4>
        <p className="mb-3 text-[0.6875rem] leading-relaxed text-smoke-300">
          {current.body}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[0.625rem] text-smoke-700">
            {step + 1} / {STEPS.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onAdvance}
              className="text-[0.6875rem] text-smoke-700 hover:text-white"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={() => (onPrimaryAction ? onPrimaryAction(step) : onAdvance())}
              className="rounded-full bg-electric px-3 py-1 text-[0.6875rem] font-semibold text-black shadow-lg hover:bg-electric/90"
            >
              {current.primaryLabel}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}
