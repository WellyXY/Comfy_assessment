import { ArrowUpDown, ChevronDown } from 'lucide-react'

function Dropdown({ label }: { label: string }) {
  return (
    <button className="flex items-center justify-between gap-2 bg-charcoal-700 border border-charcoal-400 hover:bg-charcoal-600 rounded-md h-8 px-3 text-[0.875rem] text-white min-w-[110px]">
      <span>{label}</span>
      <ChevronDown size={13} className="text-smoke-700" />
    </button>
  )
}

export function FilterRow() {
  return (
    <div className="flex items-center justify-between px-5 pb-3">
      <div className="flex items-center gap-2">
        <Dropdown label="Model Filter" />
        <Dropdown label="Use Case" />
        <Dropdown label="Run On" />
      </div>
      <button className="flex items-center justify-between gap-2 bg-charcoal-700 border border-charcoal-400 hover:bg-charcoal-600 rounded-md h-8 px-3 text-[0.875rem] text-white min-w-[110px]">
        <ArrowUpDown size={12} className="text-smoke-700" />
        <span>Popular</span>
        <ChevronDown size={13} className="text-smoke-700" />
      </button>
    </div>
  )
}
