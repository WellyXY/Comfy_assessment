import { ChevronDown, Workflow } from 'lucide-react'

type Props = {
  workflowName?: string
}

export function WorkflowToolbar({ workflowName }: Props) {
  return (
    <div className="absolute top-1.5 left-2 flex items-center gap-2 z-20">
      <button className="flex items-center gap-1.5 bg-charcoal-700 border border-charcoal-400 hover:bg-charcoal-600 rounded-md h-8 px-2.5 text-[0.875rem] text-white">
        <Workflow size={13} className="text-smoke-700" />
        <span>Graph</span>
        <ChevronDown size={12} className="text-smoke-700" />
      </button>
      {workflowName && (
        <div className="text-smoke-500 text-[0.875rem] ml-1">{workflowName}</div>
      )}
    </div>
  )
}
