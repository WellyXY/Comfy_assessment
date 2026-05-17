import { useEffect, useRef } from 'react'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import type { Template } from '../../data/templates'

// Per-column top/bottom flex-grow ratios. Each column has its split at a
// different point so the horizontal seams form a staggered rhythm rather
// than a straight line — copied from Luma's PresetCard pattern.
const columnSplits: { top: number; bottom: number }[] = [
  { top: 6, bottom: 4 },
  { top: 7, bottom: 3 },
  { top: 5, bottom: 5 },
  { top: 7, bottom: 3 },
]

function padPool(videos: string[], target: number): string[] {
  if (videos.length === 0) return []
  return Array.from({ length: target }, (_, i) => videos[i % videos.length])
}

/** Tile that renders either a looping video (.mp4/.webm) or a still image. */
function CollageTile({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(src)

  useEffect(() => {
    if (!isVideo) return
    const v = ref.current
    if (!v) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.2 },
    )
    obs.observe(v)
    return () => obs.disconnect()
  }, [isVideo])

  return (
    <div className="group/tile relative h-full w-full overflow-hidden rounded-[14px] bg-charcoal-600">
      {isVideo ? (
        <video
          ref={ref}
          src={src}
          poster={poster}
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <img
          src={src}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {/* Hover overlay: dimmed background + centered CTA pill */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover/tile:opacity-100">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-electric px-3 py-1.5 text-[0.6875rem] font-semibold text-black shadow-xl">
          Run the preset
          <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  )
}

type Props = {
  template: Template
  videos: string[]
  onSelect?: (t: Template) => void
}

export function ScenarioCard({ template, videos, onSelect }: Props) {
  const tiles = padPool(videos, 8)
  const ctaLabel =
    template.title.split(':')[0].split(/[—-]/)[0].trim() || 'template'

  return (
    <div
      onClick={() => onSelect?.(template)}
      className="group cursor-pointer block overflow-hidden rounded-card border border-charcoal-400 bg-gradient-to-br from-[#1a1024] via-[#11070d] to-[#0a0a0a] transition-colors hover:border-charcoal-200"
    >
      <div className="grid grid-cols-12 gap-4 p-4 md:gap-6 md:p-6">
        {/* Left — title, description, CTA */}
        <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
          {template.brand && (
            <div
              className="self-start flex items-center gap-1.5 backdrop-blur-md rounded-md pl-1 pr-2 py-0.5 text-[0.72rem] text-white shadow"
              style={{
                background: template.brandColor
                  ? `${template.brandColor}E6`
                  : 'rgba(0,0,0,0.55)',
              }}
            >
              <span className="w-4 h-4 rounded-sm bg-white/15 inline-flex items-center justify-center text-[0.56rem] font-bold tracking-tight">
                {template.brand[0]}
              </span>
              <span>{template.brand}</span>
            </div>
          )}

          <h3 className="text-[1.625rem] leading-[1.05] font-bold tracking-tight text-white uppercase md:text-[1.875rem]">
            {template.title}
          </h3>

          <p className="line-clamp-3 text-[0.8125rem] leading-relaxed text-smoke-500">
            {template.description}
          </p>

          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[0.75rem] font-semibold text-black group-hover:opacity-90">
              <Sparkles className="h-3.5 w-3.5" />
              Try {ctaLabel}
            </span>
          </div>

          <div className="mt-auto flex items-center gap-2 text-[0.6875rem] text-smoke-700 capitalize">
            <span>{template.modality}</span>
            <span>·</span>
            <span>{template.variantCount} templates</span>
          </div>
        </div>

        {/* Right — staggered video collage */}
        <div className="col-span-12 md:col-span-8">
          <div className="relative h-[17rem] [mask-image:linear-gradient(to_right,black_82%,transparent_100%)]">
            <div className="grid h-full grid-cols-4 gap-2">
              {columnSplits.map((split, col) => {
                const topIdx = col * 2
                const bottomIdx = col * 2 + 1
                return (
                  <div key={col} className="flex h-full flex-col gap-2">
                    <div className="min-h-0 basis-0" style={{ flexGrow: split.top }}>
                      <CollageTile src={tiles[topIdx]} poster={template.image} />
                    </div>
                    <div
                      className="min-h-0 basis-0"
                      style={{ flexGrow: split.bottom }}
                    >
                      <CollageTile src={tiles[bottomIdx]} poster={template.image} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
