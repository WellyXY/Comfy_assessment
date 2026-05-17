import { useState } from 'react'
import { Search } from 'lucide-react'
import { heroCards, templates } from '../../data/templates'
import { GridCard } from './GridCard'
import { HeroCard } from './HeroCard'
import { TagChips } from './TagChips'

type Props = {
  onSelect: () => void
}

export function TemplatesPage({ onSelect }: Props) {
  const [tag, setTag] = useState('all')
  const [query, setQuery] = useState('')

  const visible = templates
    .filter((t) => {
      if (tag !== 'all' && !t.categories.includes(tag)) return false
      if (
        query &&
        !`${t.title} ${t.description} ${t.tags.join(' ')}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
        return false
      return true
    })
    // Stable sort: templates pinned to the active tag bubble up to position 0.
    .sort((a, b) => {
      const aPin = a.pinnedFor?.includes(tag) ? 0 : 1
      const bPin = b.pinnedFor?.includes(tag) ? 0 : 1
      return aPin - bPin
    })

  const showHero = tag === 'all' && !query

  return (
    <div
      data-tag="templates-page"
      className="absolute inset-0 bg-charcoal-800 overflow-y-auto"
    >
      <div className="max-w-[76rem] mx-auto px-10 pt-10 pb-16">
        {/* Page header */}
        <div className="flex items-end justify-between gap-6 mb-7">
          <div>
            <h1 className="text-white text-[1.5rem] font-bold tracking-tight leading-none">
              Templates
            </h1>
            <p className="text-smoke-700 text-[0.875rem] mt-2">
              Start from a workflow built by the Comfy team or the community.
            </p>
          </div>
          <div className="flex items-center bg-charcoal-700 border border-charcoal-400 rounded-lg h-11 px-3.5 gap-2 w-[22rem] focus-within:border-charcoal-200">
            <Search size={15} className="text-smoke-700" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates"
              className="flex-1 bg-transparent outline-none text-[0.875rem] text-white placeholder:text-smoke-700"
            />
          </div>
        </div>

        {/* Hero — curated Comfy capability promos (separate from the template list) */}
        {showHero && (
          <div data-tag="hero-scenarios" className="mb-14">
            <div className="flex gap-4 overflow-x-auto -mx-1 px-1 snap-x snap-mandatory hero-scroll">
              {heroCards.map((promo) => (
                <div
                  key={promo.id}
                  className="shrink-0 snap-start"
                  style={{ width: 'calc((100% - 3rem) / 4)' }}
                >
                  <HeroCard promo={promo} onSelect={onSelect} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tag chips */}
        <div data-tag="category-tabs" className="mb-6">
          <TagChips active={tag} onChange={setTag} />
        </div>

        {/* Section heading — hidden when "All" is selected (tag chips already say so) */}
        {tag !== 'all' && (
          <div className="mb-4">
            <h2 className="text-smoke-500 text-[0.875rem] font-medium tracking-tight">
              {tagChipLabel(tag)}
            </h2>
          </div>
        )}

        {visible.length === 0 ? (
          <div className="text-center py-16 text-smoke-700">
            No templates match your search.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visible.map((t) => (
              <GridCard key={t.id} template={t} onSelect={() => onSelect()} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function tagChipLabel(id: string) {
  const map: Record<string, string> = {
    featured: 'Featured',
    'e-commerce': 'E-commerce',
    'social-aesthetics': 'Social aesthetics',
    'media-trend': 'Media trend',
    'cinema-style': 'Cinema style',
    'seedream-2': 'Seedream 2.0',
    'gpt-image-2': 'GPT Image 2',
  }
  return map[id] ?? id
}
