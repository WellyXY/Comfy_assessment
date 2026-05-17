import { Search, X } from 'lucide-react'

type SearchBarProps = {
  onClose: () => void
}

export function SearchBar({ onClose }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 px-5 pt-4 pb-3">
      <div className="flex-1 flex items-center bg-charcoal-700 border border-charcoal-400 rounded-md h-9 px-3 gap-2">
        <Search size={14} className="text-smoke-700" />
        <input
          className="flex-1 bg-transparent outline-none text-[0.9375rem] text-white placeholder:text-smoke-700"
          placeholder="Search templates"
        />
      </div>
      <button
        onClick={onClose}
        className="text-smoke-700 hover:text-white w-9 h-9 rounded-md flex items-center justify-center"
      >
        <X size={16} />
      </button>
    </div>
  )
}
