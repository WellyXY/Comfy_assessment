import { useState } from 'react'
import { ArrowUp, Paperclip, Sparkles } from 'lucide-react'
import { heroCards, templates } from '../../data/templates'
import { GridCard } from './GridCard'
import { HeroCard } from './HeroCard'
import { TagChips } from './TagChips'
import { ToolSpotlight } from './ToolSpotlight'

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
      <div className="max-w-[76rem] mx-auto px-10 pt-8 pb-16">
        {/* Agent prompt input — first thing on the page. Chat-style entry point: users
            describe what they want, the text doubles as a live filter for the template
            grid below, and the paperclip lets them attach reference assets. */}
        <div className="mb-6">
          <div className="relative bg-charcoal-700 border border-charcoal-400 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-electric/60 transition-colors">
            <Sparkles size={16} className="text-electric shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe what you want to create — the agent picks the workflow"
              className="flex-1 bg-transparent outline-none text-[0.9375rem] text-white placeholder:text-smoke-700"
            />
            <label
              aria-label="Attach assets"
              className="grid place-items-center w-8 h-8 rounded-full border border-charcoal-400 text-smoke-500 hover:text-white hover:border-charcoal-200 cursor-pointer shrink-0 transition-colors"
            >
              <Paperclip size={14} />
              <input type="file" accept="image/*,video/*" multiple className="hidden" />
            </label>
            <button
              type="button"
              aria-label="Ask agent"
              className="grid place-items-center w-8 h-8 rounded-full bg-electric text-black hover:bg-electric/90 shrink-0"
            >
              <ArrowUp size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>


        {/* Hero — curated Comfy capability promos (separate from the template list) */}
        {showHero && (
          <div data-tag="hero-scenarios" className="mb-6">
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

        {/* Tool spotlight — quick-entry tools, sits between hero and category chips */}
        {showHero && (
          <div className="mb-8">
            <ToolSpotlight />
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
