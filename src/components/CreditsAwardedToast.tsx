import { useEffect } from 'react'
import { Coins } from 'lucide-react'

type Props = {
  show: boolean
  onDismiss: () => void
}

export function CreditsAwardedToast({ show, onDismiss }: Props) {
  useEffect(() => {
    if (!show) return
    const t = setTimeout(onDismiss, 3500)
    return () => clearTimeout(t)
  }, [show, onDismiss])

  if (!show) return null
  return (
    <div className="absolute right-4 bottom-14 z-40 flex items-center gap-2.5 bg-charcoal-700 border border-electric/50 rounded-card shadow-modal pl-3 pr-4 py-3">
      <div className="w-8 h-8 rounded-full bg-electric/15 border border-electric/50 flex items-center justify-center text-electric">
        <Coins size={16} />
      </div>
      <div>
        <div className="text-white font-semibold text-[0.8125rem] leading-tight">
          +50 credits added
        </div>
        <div className="text-smoke-700 text-[0.6875rem]">Thanks for the feedback</div>
      </div>
    </div>
  )
}
