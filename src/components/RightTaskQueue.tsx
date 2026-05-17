import { AlertCircle, ArrowUpDown, Crosshair, Filter, LayoutGrid, X } from 'lucide-react'

const FAILED_RUNS = new Array(9).fill(0)

export function RightTaskQueue() {
  return (
    <div className="w-[212px] shrink-0 bg-charcoal-800 border-l border-charcoal-700 flex flex-col text-[0.875rem]">
      {/* Header */}
      <div className="flex items-center justify-between h-9 px-3 border-b border-charcoal-700">
        <span className="text-white font-medium text-[0.9375rem]">Task Queue</span>
        <div className="flex items-center gap-2 text-smoke-700">
          <button className="hover:text-white text-[0.8125rem] underline-offset-2">
            Clear Queue
          </button>
          <button className="hover:text-white">
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-charcoal-700">
        <div className="flex items-center gap-3 text-smoke-700 text-[0.8125rem]">
          <span className="text-white font-medium">All</span>
          <span>Completed</span>
          <span>Failed</span>
        </div>
        <div className="flex items-center gap-1 text-smoke-700">
          <Filter size={12} className="hover:text-white cursor-pointer" />
          <ArrowUpDown size={12} className="hover:text-white cursor-pointer" />
          <LayoutGrid size={12} className="hover:text-white cursor-pointer" />
        </div>
      </div>

      {/* Section header */}
      <div className="px-3 pt-3 pb-1 text-smoke-700 text-[0.8125rem]">No Date</div>

      {/* Tasks list */}
      <div className="flex-1 overflow-y-auto px-2">
        {FAILED_RUNS.map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-charcoal-700/60 cursor-pointer"
          >
            <AlertCircle size={14} className="text-smoke-700 shrink-0" />
            <div className="leading-tight">
              <div className="text-white font-medium">Failed</div>
              <div className="text-smoke-700 text-[0.75rem]">Failed</div>
            </div>
          </div>
        ))}
      </div>

      {/* Minimap */}
      <div className="m-2 mt-1 bg-charcoal-700 border border-charcoal-400 rounded-md">
        <div className="flex items-center justify-between px-2 py-1 border-b border-charcoal-400">
          <Crosshair size={12} className="text-smoke-700" />
          <X size={12} className="text-smoke-700 hover:text-white cursor-pointer" />
        </div>
        <div className="h-[78px] bg-charcoal-800/40 m-1.5 rounded relative overflow-hidden">
          {/* tiny abstract workflow thumbnail */}
          <div className="absolute left-3 top-3 w-7 h-5 bg-run/40 rounded-sm" />
          <div className="absolute left-14 top-4 w-6 h-4 bg-run/40 rounded-sm" />
          <div className="absolute left-8 top-10 w-5 h-4 bg-run/40 rounded-sm" />
        </div>
      </div>
    </div>
  )
}
