import {
  AppWindow,
  Boxes,
  HelpCircle,
  Keyboard,
  LayoutGrid,
  PackageOpen,
  Settings,
  Share2,
  Workflow,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type LeftRailProps = {
  activeId?: string
}

type Item = { id: string; label: string; icon: LucideIcon }

const TOP_ITEMS: Item[] = [
  { id: 'assets', label: 'Assets', icon: PackageOpen },
  { id: 'nodes', label: 'Nodes', icon: Share2 },
  { id: 'models', label: 'Models', icon: Boxes },
  { id: 'workflows', label: 'Workflows', icon: Workflow },
  { id: 'apps', label: 'Apps', icon: AppWindow },
  { id: 'templates', label: 'Templates', icon: LayoutGrid },
]

const BOTTOM_ITEMS: Item[] = [
  { id: 'help', label: 'Help', icon: HelpCircle },
  { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function RailItem({ item, active }: { item: Item; active: boolean }) {
  const Icon = item.icon
  return (
    <button
      className={`relative flex flex-col items-center justify-center gap-1 w-full py-2 text-[0.625rem] cursor-pointer transition-colors ${
        active
          ? 'text-white'
          : 'text-smoke-700 hover:text-white'
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1 bottom-1 w-[2px] rounded-r bg-white" />
      )}
      <Icon size={16} strokeWidth={1.4} />
      <span>{item.label}</span>
    </button>
  )
}

export function LeftRail({ activeId }: LeftRailProps) {
  return (
    <div className="w-[3.75rem] shrink-0 bg-charcoal-800 border-r border-charcoal-700 flex flex-col">
      {/* Logo */}
      <div className="h-10 flex items-center justify-center border-b border-charcoal-700">
        <img src="/brand/comfy-logomark.svg" alt="Comfy" className="h-4 w-auto" />
      </div>
      <div className="flex flex-col py-1">
        {TOP_ITEMS.map((it) => (
          <RailItem key={it.id} item={it} active={activeId === it.id} />
        ))}
      </div>
      <div className="flex-1" />
      <div className="flex flex-col py-1 border-t border-charcoal-700/60">
        {BOTTOM_ITEMS.map((it) => (
          <RailItem key={it.id} item={it} active={activeId === it.id} />
        ))}
      </div>
    </div>
  )
}
