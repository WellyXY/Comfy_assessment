import { useState } from 'react'
import { LayoutTemplate } from 'lucide-react'
import { templates } from '../../data/templates'
import { CategoryNav } from './CategoryNav'
import { FilterRow } from './FilterRow'
import { SearchBar } from './SearchBar'
import { TemplateCard } from './TemplateCard'

type Props = {
  open: boolean
  onClose: () => void
}

export function TemplateModal({ open, onClose }: Props) {
  const [active, setActive] = useState('all')

  if (!open) return null

  const sectionLabels: Record<string, string> = {
    all: 'All Templates',
    popular: 'Popular',
    'use-cases': 'Use Cases',
    tools: 'Tools',
    'quick-start': 'Quick Start',
    'node-basics': 'Node Basics',
    image: 'Image',
    video: 'Video',
    audio: 'Audio',
    '3d': '3D Models',
    llm: 'LLM',
  }

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div
        data-tag="template-modal"
        className="bg-charcoal-700 rounded-card shadow-modal flex overflow-hidden border border-charcoal-400"
        style={{ width: 'min(92vw, 68rem)', height: 'min(82vh, 40rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left column with title + nav */}
        <div className="flex flex-col w-[12rem] shrink-0 bg-charcoal-700">
          <div className="flex items-center gap-2 h-12 px-4 border-b border-charcoal-600">
            <LayoutTemplate size={16} className="text-white" strokeWidth={1.8} />
            <span className="text-white font-medium text-[1.0625rem]">Templates</span>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            <CategoryNav active={active} onChange={setActive} />
          </div>
        </div>

        {/* Main panel */}
        <div className="flex-1 flex flex-col bg-charcoal-700 min-w-0">
          <SearchBar onClose={onClose} />
          <FilterRow />
          <div className="flex-1 overflow-y-auto px-5 pb-5">
            <h2 className="text-[1.5rem] font-bold text-white mb-4">
              {sectionLabels[active] ?? 'Templates'}
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {templates.map((t) => (
                <TemplateCard key={t.id} template={t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
