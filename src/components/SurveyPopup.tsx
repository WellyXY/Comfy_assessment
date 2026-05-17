import { useEffect, useState } from 'react'
import { Check, ChevronRight, Coins, Sparkles, X } from 'lucide-react'

type RadioStep = {
  question: string
  type: 'radio'
  options: string[]
}
type TextStep = {
  question: string
  type: 'text'
  placeholder: string
  optional: boolean
}
type Step = RadioStep | TextStep

const STEPS: Step[] = [
  {
    question: 'How do you plan to use ComfyUI?',
    type: 'radio',
    options: ['Personal use', 'Work', 'Education (student or educator)'],
  },
  {
    question: 'Which best describes your role?',
    type: 'radio',
    options: [
      'Solo creator / content maker',
      'In-house creative at a company',
      'Agency / freelance',
      'Researcher / engineer',
    ],
  },
  {
    question: 'What do you most want to create?',
    type: 'radio',
    options: [
      'Stylized product photos',
      'Short videos / social ads',
      'Character art & illustration',
      'Just experimenting',
    ],
  },
  {
    question: 'Share a social handle (optional)',
    type: 'text',
    placeholder: '@your_handle  or  https://...',
    optional: true,
  },
]

type Props = {
  mode: 'invite' | 'survey' | null
  onTake: () => void
  onDismiss: () => void
  onComplete: () => void
}

/** Compact invite that auto-collapses after 5s. Sits below RunBar's Share. Slides in from the right. */
function AutoCollapseInvite({
  onTake,
  onDismiss,
  entered,
}: {
  onTake: () => void
  onDismiss: () => void
  entered: boolean
}) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(), 5000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div
      data-tag="survey-popup"
      className={`absolute bottom-3 left-3 z-40 w-[14rem] bg-charcoal-700 border border-charcoal-300 rounded-card shadow-modal overflow-hidden transition-transform duration-300 ease-out ${
        entered ? 'translate-x-0' : '-translate-x-[120%]'
      }`}
    >
      <div className="h-[2px] bg-gradient-to-r from-electric via-amber-300 to-electric" />
      <div className="p-2.5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <Coins size={11} className="text-electric" strokeWidth={2} />
            <div className="text-white font-semibold text-[0.75rem] leading-tight">
              Earn 50 credits
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="text-smoke-700 hover:text-white p-0.5"
            aria-label="Dismiss"
          >
            <X size={11} />
          </button>
        </div>
        <button
          data-tag="survey-cta"
          onClick={onTake}
          className="w-full flex items-center justify-center gap-1.5 bg-electric text-black font-semibold text-[0.6875rem] rounded-md h-7 hover:bg-electric/90 transition-colors"
        >
          <Sparkles size={11} />
          Take survey
        </button>
      </div>
    </div>
  )
}

export function SurveyPopup({ mode, onTake, onDismiss, onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<(string | null)[]>([null, null, null, ''])

  // Track the mode that's *currently rendered* so we can animate the exit.
  // When `mode` becomes null, we keep the last non-null mode mounted for ~300ms
  // (matching the transition duration), then unmount.
  const [renderedMode, setRenderedMode] = useState<Props['mode']>(mode)
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    if (mode !== null) {
      setRenderedMode(mode)
      // Mount first, then flip the transform on the next frame so the transition runs.
      const id = requestAnimationFrame(() => setEntered(true))
      return () => cancelAnimationFrame(id)
    }
    // Exiting: slide out, then unmount after the transition.
    setEntered(false)
    const t = setTimeout(() => setRenderedMode(null), 320)
    return () => clearTimeout(t)
  }, [mode])

  if (renderedMode === null) return null

  // ─────── Compact invite card ───────
  // Auto-collapses after 5s of inactivity. Sits below the RunBar Share button.
  if (renderedMode === 'invite') {
    return (
      <AutoCollapseInvite
        onTake={onTake}
        onDismiss={onDismiss}
        entered={entered}
      />
    )
  }

  // ─────── Inline survey ───────
  const current = STEPS[step]
  const selected = answers[step]
  const isLast = step === STEPS.length - 1
  const canProceed =
    current.type === 'radio'
      ? !!selected
      : current.optional || (typeof selected === 'string' && selected.length > 0)
  const filledSteps = answers.filter((a, i) => {
    const s = STEPS[i]
    return s.type === 'radio' ? !!a : s.optional || (typeof a === 'string' && a.length > 0)
  }).length
  const progress = ((step + (canProceed ? 1 : 0)) / STEPS.length) * 100

  const pickRadio = (opt: string) => {
    const next = [...answers]
    next[step] = opt
    setAnswers(next)
  }
  const setText = (v: string) => {
    const next = [...answers]
    next[step] = v
    setAnswers(next)
  }

  const handleNext = () => {
    if (isLast) {
      onComplete()
      setStep(0)
      setAnswers([null, null, null, ''])
    } else {
      setStep(step + 1)
    }
  }

  return (
    <div
      data-tag="survey-popup"
      className={`absolute bottom-3 left-3 z-40 w-[18rem] bg-charcoal-700 border border-charcoal-300 rounded-card shadow-modal overflow-hidden transition-transform duration-300 ease-out ${
        entered ? 'translate-x-0' : '-translate-x-[120%]'
      }`}
    >
      <div className="h-0.5 bg-gradient-to-r from-electric via-amber-300 to-electric" />

      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-electric/15 border border-electric/40 flex items-center justify-center text-electric">
            <Coins size={11} strokeWidth={2} />
          </div>
          <div className="leading-tight">
            <div className="text-white font-semibold text-[0.75rem]">
              30-second survey
            </div>
            <div className="text-smoke-700 text-[0.625rem]">
              Step {step + 1} of {STEPS.length} · Get 50 credits
            </div>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-smoke-700 hover:text-white p-1"
          aria-label="Dismiss"
        >
          <X size={12} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mx-3 h-0.5 bg-charcoal-500 rounded-full overflow-hidden">
        <div
          className="h-full bg-electric transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question + answer area */}
      <div className="px-3 pt-2.5 pb-3">
        <div className="text-white font-semibold text-[0.75rem] leading-snug mb-2">
          {current.question}
          {current.type === 'text' && current.optional && (
            <span className="text-smoke-700 font-normal ml-1.5 text-[0.625rem]">
              · optional
            </span>
          )}
        </div>

        {current.type === 'radio' && (
          <div className="space-y-1">
            {current.options.map((opt) => {
              const isSel = selected === opt
              return (
                <button
                  key={opt}
                  onClick={() => pickRadio(opt)}
                  className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md border transition-all ${
                    isSel
                      ? 'border-electric bg-electric/5'
                      : 'border-charcoal-400 hover:border-charcoal-200 bg-charcoal-700'
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSel ? 'border-electric bg-electric' : 'border-smoke-700'
                    }`}
                  >
                    {isSel && (
                      <Check size={7} className="text-black" strokeWidth={3} />
                    )}
                  </span>
                  <span
                    className={`text-[0.6875rem] ${isSel ? 'text-white' : 'text-smoke-300'}`}
                  >
                    {opt}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {current.type === 'text' && (
          <div>
            <input
              type="text"
              value={typeof selected === 'string' ? selected : ''}
              onChange={(e) => setText(e.target.value)}
              placeholder={current.placeholder}
              className="w-full bg-charcoal-500 border border-charcoal-400 focus:border-electric/60 rounded-md px-2.5 py-2 text-white text-[0.6875rem] placeholder:text-smoke-700 outline-none transition-colors"
              autoFocus
            />
            <p className="text-smoke-700 text-[0.625rem] mt-1.5 leading-snug">
              We'll never DM, post, or share this. Used only to recommend
              creator-relevant templates.
            </p>
          </div>
        )}

        {/* Footer buttons */}
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            className={`text-smoke-700 hover:text-white text-[0.625rem] ${
              step === 0 ? 'invisible' : ''
            }`}
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-semibold text-[0.6875rem] transition-all ${
              canProceed
                ? 'bg-electric text-black hover:bg-electric/90'
                : 'bg-charcoal-500 text-smoke-700 cursor-not-allowed'
            }`}
          >
            {isLast
              ? current.type === 'text' && !selected
                ? 'Skip & claim 50 credits'
                : 'Finish & claim 50 credits'
              : 'Next'}
            {!isLast && <ChevronRight size={11} />}
          </button>
        </div>
      </div>
    </div>
  )
}
