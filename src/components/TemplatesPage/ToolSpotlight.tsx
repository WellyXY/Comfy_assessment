import {
  ArrowRight,
  Banana,
  Film,
  Image as ImageIcon,
  Mic2,
  Sparkles,
  Wand2,
  Zap,
  type LucideIcon,
} from 'lucide-react'

type Tool = {
  id: string
  title: string
  body: string
  Icon: LucideIcon
  badge?: 'NEW' | 'TRENDING' | null
}

const tools: Tool[] = [
  {
    id: 'nano-banana',
    title: 'Nano Banana Pro',
    body: 'Generate high-quality visuals from a single brief.',
    Icon: Banana,
  },
  {
    id: 'seedance',
    title: 'Seedance 2.0',
    body: 'High-quality video from reference clips.',
    Icon: Film,
  },
  {
    id: 'image-to-video',
    title: 'Image-to-Video',
    body: 'Animate any still into a 5-second clip.',
    Icon: Sparkles,
    badge: 'TRENDING',
  },
  {
    id: 'gpt-image-2',
    title: 'GPT Image 2',
    body: '4K posters with near-perfect text.',
    Icon: ImageIcon,
  },
  {
    id: 'lipsync',
    title: 'Lipsync Studio',
    body: 'Make any portrait speak or sing on cue.',
    Icon: Mic2,
    badge: 'NEW',
  },
  {
    id: 'product-vfx',
    title: 'Product VFX',
    body: 'Splash, smoke, lightning on any product.',
    Icon: Wand2,
  },
]

function Badge({ kind }: { kind: 'NEW' | 'TRENDING' }) {
  const styles =
    kind === 'NEW'
      ? 'bg-electric text-black'
      : 'bg-rose-500 text-white'
  return (
    <span
      className={`rounded-md px-1.5 py-0.5 text-[0.5rem] font-bold uppercase tracking-wider ${styles}`}
    >
      {kind}
    </span>
  )
}

/** Horizontal strip of compact tool tiles — sits between the hero carousel and the
 *  template grid. Equal-weight rows (no featured-card hierarchy) so it reads as a
 *  quick-launch shortcut bar rather than a marketing spotlight. */
export function ToolSpotlight() {
  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap size={13} className="text-electric" />
          <span className="text-[0.625rem] uppercase tracking-[0.18em] text-smoke-500 font-semibold">
            Quick tools
          </span>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 text-[0.6875rem] text-smoke-700 hover:text-white"
        >
          View all
          <ArrowRight size={11} />
        </button>
      </div>

      {/* 2 rows × 3 cols of equal-weight tool tiles. Unified icon style — every tool
          gets the same muted plate so the bar reads as a uniform shortcut row. */}
      <div className="grid grid-cols-3 gap-2.5">
        {tools.map((t) => {
          const Icon = t.Icon
          return (
            <button
              key={t.id}
              type="button"
              className="group relative flex items-center gap-3 rounded-lg border border-charcoal-500 bg-charcoal-700/70 px-3 py-2.5 text-left hover:border-charcoal-200 hover:bg-charcoal-700 transition-all"
            >
              <div className="shrink-0 grid place-items-center w-9 h-9 rounded-md bg-charcoal-600 border border-charcoal-400 text-smoke-300 group-hover:text-white group-hover:border-charcoal-200 transition-colors">
                <Icon size={15} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-white text-[0.8125rem] font-semibold leading-none truncate">
                    {t.title}
                  </span>
                  {t.badge && <Badge kind={t.badge} />}
                </div>
                <div className="text-smoke-700 text-[0.6875rem] leading-snug line-clamp-1">
                  {t.body}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
