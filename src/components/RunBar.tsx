import { ChevronDown, ChevronUp, GripVertical, PanelRight, Play, Send, X } from 'lucide-react'

export function RunBar() {
  return (
    <div data-tag="run-bar" className="absolute top-1.5 right-2 flex items-center gap-1.5 z-20">
      <button className="text-smoke-700 hover:text-white p-1 cursor-grab">
        <GripVertical size={14} />
      </button>

      {/* Run count input */}
      <div className="flex items-center bg-charcoal-700 border border-charcoal-400 rounded-md h-8 pl-2.5 pr-1 gap-1.5">
        <span className="text-white text-[0.875rem] font-medium">1</span>
        <div className="flex flex-col -my-0.5">
          <button className="text-smoke-700 hover:text-white">
            <ChevronUp size={11} />
          </button>
          <button className="text-smoke-700 hover:text-white">
            <ChevronDown size={11} />
          </button>
        </div>
      </div>

      {/* Run button (split) */}
      <div className="flex items-stretch">
        <button
          data-coach="runbar-run"
          className="flex items-center gap-1.5 bg-run hover:bg-run-hover text-white px-3 h-8 rounded-l-md font-medium text-[0.875rem] transition-colors"
        >
          <Play size={12} fill="white" />
          Run
        </button>
        <button className="flex items-center bg-run hover:bg-run-hover border-l border-white/20 px-1.5 h-8 rounded-r-md text-white">
          <ChevronDown size={12} />
        </button>
      </div>

      {/* Cancel */}
      <button className="flex items-center justify-center bg-[#4d2a2a] hover:bg-[#5e3434] text-red-300 h-8 w-8 rounded-md">
        <X size={14} />
      </button>

      {/* Active tasks pill */}
      <div className="flex items-center bg-charcoal-700 border border-charcoal-400 rounded-md h-8 px-3 text-[0.875rem] text-smoke-500">
        0 active tasks
      </div>

      {/* Share */}
      <button className="flex items-center gap-1.5 bg-charcoal-700 border border-charcoal-400 hover:bg-charcoal-600 h-8 px-3 rounded-md text-[0.875rem] text-white">
        <Send size={12} className="-rotate-12" />
        Share
      </button>

      {/* Right panel toggle */}
      <button className="flex items-center justify-center bg-charcoal-700 border border-charcoal-400 hover:bg-charcoal-600 h-8 w-8 rounded-md text-smoke-500">
        <PanelRight size={14} />
      </button>
    </div>
  )
}
