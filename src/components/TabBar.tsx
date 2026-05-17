import { useEffect, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LayoutGrid,
  LogOut,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Settings as SettingsIcon,
  Sparkles,
  User,
  X,
} from 'lucide-react'

type TabBarProps = {
  activeId: string
  onOpenSurvey?: () => void
  onOpenTemplates?: () => void
  templatesActive?: boolean
}

const TABS = [
  { id: 'text-to-image', label: 'text-to-image' },
  { id: 'product-photo', label: 'product-photo', modified: true },
  { id: 'video-loop', label: 'video-loop' },
  { id: 'unsaved-1', label: 'Unsaved Workflow', modified: true },
  { id: 'gsc_starter_1', label: 'gsc_starter_1', modified: true },
]

export function TabBar({
  activeId,
  onOpenSurvey,
  onOpenTemplates,
  templatesActive,
}: TabBarProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  return (
    <div className="flex items-stretch h-7 bg-charcoal-800 border-b border-charcoal-700 text-[0.875rem] select-none">
      {/* Templates pinned tab — icon only */}
      <button
        onClick={onOpenTemplates}
        className={`flex items-center justify-center px-2.5 border-r border-charcoal-700 transition-colors ${
          templatesActive
            ? 'bg-charcoal-700 text-white'
            : 'text-smoke-700 hover:bg-charcoal-700/50 hover:text-white'
        }`}
        aria-label="Templates"
        title="Templates"
      >
        <LayoutGrid size={13} strokeWidth={1.6} />
      </button>

      {TABS.map((t) => {
        const isActive = t.id === activeId
        return (
          <div
            key={t.id}
            className={`group flex items-center gap-1.5 px-3 max-w-[180px] border-r border-charcoal-700 cursor-pointer ${
              isActive
                ? 'bg-charcoal-700 text-white'
                : 'text-smoke-700 hover:bg-charcoal-700/50'
            }`}
          >
            {t.modified && (
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
            )}
            <span className="truncate">{t.label}</span>
            <X
              size={12}
              className="text-smoke-700 opacity-0 group-hover:opacity-100 shrink-0 hover:text-white"
            />
          </div>
        )
      })}
      <div className="flex items-center px-2 text-smoke-700 hover:text-white cursor-pointer">
        <Plus size={14} />
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-1 px-2 text-smoke-700">
        <button className="p-1 hover:bg-charcoal-700 rounded">
          <ChevronLeft size={14} />
        </button>
        <button className="p-1 hover:bg-charcoal-700 rounded">
          <ChevronRight size={14} />
        </button>
        <button className="p-1 hover:bg-charcoal-700 rounded">
          <MoreHorizontal size={14} />
        </button>
        <button className="p-1 hover:bg-charcoal-700 rounded">
          <MessageSquare size={14} />
        </button>

        {/* Avatar + dropdown */}
        <div ref={ref} className="relative ml-1">
          <button
            onClick={() => setOpen((o) => !o)}
            className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[0.75rem] font-semibold text-white hover:ring-2 hover:ring-white/20"
            aria-label="Account menu"
          >
            W
          </button>

          {open && (
            <div className="absolute top-[calc(100%+4px)] right-0 w-[15rem] bg-charcoal-700 border border-charcoal-400 rounded-md shadow-modal py-1.5 z-50 text-[0.8125rem]">
              <div className="px-3 py-2 border-b border-charcoal-500">
                <div className="text-white font-semibold">welly</div>
                <div className="text-smoke-700 text-[0.72rem] mt-0.5">
                  Free · 2 credits
                </div>
              </div>

              {/* Survey re-entry */}
              <button
                onClick={() => {
                  setOpen(false)
                  onOpenSurvey?.()
                }}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 hover:bg-charcoal-600 text-left"
              >
                <span className="flex items-center gap-2 text-white">
                  <Sparkles size={13} className="text-electric" />
                  Take survey
                </span>
                <span className="text-electric text-[0.72rem] font-semibold">
                  +50
                </span>
              </button>

              <div className="border-t border-charcoal-500 my-1" />

              <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-charcoal-600 text-smoke-300 text-left">
                <User size={13} />
                Account
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-charcoal-600 text-smoke-300 text-left">
                <CreditCard size={13} />
                Billing & credits
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-charcoal-600 text-smoke-300 text-left">
                <SettingsIcon size={13} />
                Settings
              </button>

              <div className="border-t border-charcoal-500 my-1" />

              <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-charcoal-600 text-smoke-300 text-left">
                <LogOut size={13} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
