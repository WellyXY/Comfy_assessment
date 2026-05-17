import {
  Box,
  Flame,
  Image as ImageIcon,
  LayoutGrid,
  Menu,
  Music,
  Rocket,
  Star,
  Video,
  Wrench,
  MessageSquare,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type CategoryNavProps = {
  active: string
  onChange: (id: string) => void
}

type Item = { id: string; label: string; icon: LucideIcon }

const TOP: Item[] = [
  { id: 'all', label: 'All Templates', icon: Menu },
  { id: 'popular', label: 'Popular', icon: Flame },
  { id: 'use-cases', label: 'Use Cases', icon: Star },
  { id: 'tools', label: 'Tools', icon: Wrench },
  { id: 'quick-start', label: 'Quick Start', icon: Rocket },
  { id: 'node-basics', label: 'Node Basics', icon: LayoutGrid },
]

const TYPES: Item[] = [
  { id: 'image', label: 'Image', icon: ImageIcon },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'audio', label: 'Audio', icon: Music },
  { id: '3d', label: '3D Models', icon: Box },
  { id: 'llm', label: 'LLM', icon: MessageSquare },
]

function NavItem({
  item,
  active,
  onChange,
}: {
  item: Item
  active: boolean
  onChange: (id: string) => void
}) {
  const Icon = item.icon
  return (
    <button
      onClick={() => onChange(item.id)}
      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md w-full text-left text-[0.9375rem] transition-colors ${
        active
          ? 'bg-charcoal-700 text-white'
          : 'text-smoke-700 hover:text-white hover:bg-charcoal-700/50'
      }`}
    >
      <Icon size={15} strokeWidth={1.6} />
      <span>{item.label}</span>
    </button>
  )
}

export function CategoryNav({ active, onChange }: CategoryNavProps) {
  return (
    <div className="w-[12rem] shrink-0 px-2 py-1 flex flex-col gap-0.5 border-r border-charcoal-600">
      {TOP.map((it) => (
        <NavItem key={it.id} item={it} active={active === it.id} onChange={onChange} />
      ))}
      <div className="text-[0.75rem] uppercase tracking-wider text-smoke-700 px-3 pt-4 pb-1.5">
        Generation Type
      </div>
      {TYPES.map((it) => (
        <NavItem key={it.id} item={it} active={active === it.id} onChange={onChange} />
      ))}
    </div>
  )
}
