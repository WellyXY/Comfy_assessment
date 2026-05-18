import { ChevronRight, ChevronUp, ChevronDown } from 'lucide-react'

type Mode = 'login' | 'A' | 'B'

type Props = {
  mode: Mode
  onChange: (m: Mode) => void
  onHide?: () => void
}

const STEPS: { id: Mode; title: string }[] = [
  { id: 'login', title: 'Sign in' },
  { id: 'A', title: 'New user · Template gate' },
  { id: 'B', title: 'Template loaded · Survey opt-in' },
]

export function TopStepNav({ mode, onChange, onHide }: Props) {
  return (
    <div className="flex items-center justify-between h-12 px-5 bg-[#0c0c0d] border-b border-charcoal-700 text-[0.75rem] shrink-0">
      <div className="flex items-center gap-1">
        <span className="text-orange-300/80 text-[0.625rem] uppercase tracking-[0.15em] font-semibold pr-3 border-r border-charcoal-500 mr-3">
          Comfy Prototype
        </span>
        {STEPS.map((step, i) => {
          const isActive = step.id === mode
          return (
            <div key={step.id} className="flex items-center">
              {i > 0 && <ChevronRight size={12} className="text-smoke-800 mx-1" />}
              <button
                onClick={() => onChange(step.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
                  isActive
                    ? 'bg-orange-400/15 border border-orange-400/40 text-white'
                    : 'border border-transparent text-smoke-700 hover:text-white hover:bg-charcoal-700'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[0.625rem] font-semibold ${
                    isActive ? 'bg-orange-400 text-black' : 'bg-charcoal-500 text-smoke-500'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-[0.75rem]">{step.title}</span>
              </button>
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-smoke-700 text-[0.6875rem]">
          Comfy Cloud · Activation & retention prototype
        </span>
        {onHide && (
          <button
            type="button"
            onClick={onHide}
            aria-label="Hide step nav"
            className="flex items-center gap-1 text-smoke-700 hover:text-white text-[0.625rem] px-2 py-1 rounded-md hover:bg-charcoal-700 transition-colors"
          >
            <ChevronUp size={12} />
            Hide
          </button>
        )}
      </div>
    </div>
  )
}

/** Slim reveal tab shown in place of the full TopStepNav when it's hidden. */
export function ShowTopNavTab({ onShow }: { onShow: () => void }) {
  return (
    <button
      type="button"
      onClick={onShow}
      className="group flex items-center gap-1.5 self-start ml-5 mt-1 px-2.5 py-1 rounded-b-md bg-[#0c0c0d] border border-t-0 border-charcoal-700 text-smoke-700 hover:text-white text-[0.625rem] shrink-0 transition-colors"
    >
      <ChevronDown size={11} className="text-orange-300/80 group-hover:text-orange-300" />
      <span className="uppercase tracking-[0.15em] font-semibold">Show step nav</span>
    </button>
  )
}
