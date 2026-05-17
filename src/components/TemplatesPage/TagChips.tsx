import { tagChips } from '../../data/templates'

type Props = {
  active: string
  onChange: (id: string) => void
}

export function TagChips({ active, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
      {tagChips.map((c) => {
        const isActive = active === c.id
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={`shrink-0 rounded-full px-4 h-9 text-[0.8125rem] font-medium transition-all ${
              isActive
                ? 'bg-white text-black'
                : 'bg-transparent border border-charcoal-300 text-smoke-300 hover:border-charcoal-100 hover:text-white'
            }`}
          >
            {c.label}
          </button>
        )
      })}
    </div>
  )
}
