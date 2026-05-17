import { useState } from 'react'
import { Check, ChevronRight, Download, X } from 'lucide-react'

type Props = {
  open: boolean
  onClose: () => void
  onComplete: () => void
}

type Step = {
  question: string
  options: string[]
}

const STEPS: Step[] = [
  {
    question: 'How do you plan to use ComfyUI?',
    options: ['Personal use', 'Work', 'Education (student or educator)'],
  },
  {
    question: 'Which best describes your role?',
    options: [
      'Solo creator / content maker',
      'In-house creative at a company',
      'Agency / freelance',
      'Researcher / engineer',
    ],
  },
  {
    question: 'What do you most want to create on Comfy Cloud?',
    options: [
      'Stylized product photos',
      'Short videos / social ads',
      'Character art & illustration',
      'Just experimenting',
    ],
  },
]

export function SurveyModal({ open, onClose, onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [picks, setPicks] = useState<(string | null)[]>([null, null, null])

  if (!open) return null

  const current = STEPS[step]
  const selected = picks[step]
  const progress = ((step + (selected ? 1 : 0)) / STEPS.length) * 100

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      onComplete()
      // Reset for next time
      setStep(0)
      setPicks([null, null, null])
    }
  }

  const pickOption = (opt: string) => {
    const next = [...picks]
    next[step] = opt
    setPicks(next)
  }

  return (
    <div className="absolute inset-0 z-40 flex bg-charcoal-800">
      {/* Left — survey content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar with close */}
        <div className="flex items-center justify-end h-12 px-5">
          <button
            onClick={onClose}
            className="text-smoke-700 hover:text-white p-1.5 rounded-md hover:bg-charcoal-700"
            aria-label="Close survey"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-md">
            <p className="text-smoke-500 text-[0.875rem] mb-3">
              Help us tailor your ComfyUI experience.
            </p>

            {/* Progress bar */}
            <div className="h-1 w-full bg-charcoal-600 rounded-full overflow-hidden mb-10">
              <div
                className="h-full bg-electric transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <h2 className="text-white text-[1.375rem] font-bold mb-6">
              {current.question}
            </h2>

            <div className="space-y-3">
              {current.options.map((opt) => {
                const isSel = selected === opt
                return (
                  <button
                    key={opt}
                    onClick={() => pickOption(opt)}
                    className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg border transition-all ${
                      isSel
                        ? 'border-electric bg-electric/5'
                        : 'border-charcoal-400 hover:border-charcoal-200 bg-charcoal-700'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSel ? 'border-electric bg-electric' : 'border-smoke-700'
                      }`}
                    >
                      {isSel && <Check size={10} className="text-black" strokeWidth={3} />}
                    </span>
                    <span
                      className={`text-[0.9375rem] ${isSel ? 'text-white' : 'text-smoke-300'}`}
                    >
                      {opt}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center justify-between mt-10">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                className={`text-smoke-700 hover:text-white text-[0.8125rem] ${
                  step === 0 ? 'invisible' : ''
                }`}
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                disabled={!selected}
                className={`flex items-center gap-1.5 px-8 py-2.5 rounded-md font-semibold text-[0.875rem] transition-all ${
                  selected
                    ? 'bg-electric text-black hover:bg-electric/90'
                    : 'bg-charcoal-500 text-smoke-700 cursor-not-allowed'
                }`}
              >
                {step === STEPS.length - 1 ? 'Finish & claim 50 credits' : 'Next'}
                {step < STEPS.length - 1 && <ChevronRight size={14} />}
              </button>
            </div>

            <div className="text-center mt-5 text-smoke-700 text-[0.6875rem]">
              Step {step + 1} of {STEPS.length}
            </div>
          </div>
        </div>
      </div>

      {/* Right — marketing panel */}
      <div className="hidden md:flex w-[45%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_30%,rgba(240,255,65,0.15),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(23,45,215,0.4),transparent_55%)]" />

        <div className="relative flex flex-col justify-center items-center text-center px-12 w-full">
          <h3 className="text-white font-extrabold text-[1.75rem] tracking-tight leading-tight uppercase">
            Start Creating
            <br />
            in seconds
          </h3>
          <p className="text-smoke-300 text-[0.9375rem] mt-4 max-w-sm">
            Zero setup required. Works on any device.
          </p>
          <p className="text-smoke-300 text-[0.9375rem] mt-1 max-w-sm">
            Generate multiple outputs at once. Share workflows with ease.
          </p>
        </div>

        <button className="absolute bottom-5 right-5 flex items-center gap-1.5 bg-black/85 hover:bg-black text-white text-[0.75rem] px-3 py-2 rounded-md">
          <Download size={13} />
          Download ComfyUI
        </button>
      </div>
    </div>
  )
}
