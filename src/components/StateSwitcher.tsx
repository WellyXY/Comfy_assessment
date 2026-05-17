type StateMode = 'A' | 'B'

type Props = {
  mode: StateMode
  onChange: (m: StateMode) => void
}

export function StateSwitcher({ mode, onChange }: Props) {
  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center bg-black/70 border border-white/15 rounded-full p-1 backdrop-blur-md text-[0.8125rem] font-medium shadow-lg">
      <button
        onClick={() => onChange('A')}
        className={`px-3 py-1 rounded-full transition-colors ${
          mode === 'A' ? 'bg-white text-black' : 'text-white/80 hover:text-white'
        }`}
      >
        State A · New user
      </button>
      <button
        onClick={() => onChange('B')}
        className={`px-3 py-1 rounded-full transition-colors ${
          mode === 'B' ? 'bg-white text-black' : 'text-white/80 hover:text-white'
        }`}
      >
        State B · Template loaded
      </button>
    </div>
  )
}
