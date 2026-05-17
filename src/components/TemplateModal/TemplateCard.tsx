import { useEffect, useRef } from 'react'
import { GitBranch } from 'lucide-react'
import type { Template } from '../../data/templates'

type Props = {
  template: Template
  onSelect?: (template: Template) => void
}

export function TemplateCard({ template, onSelect }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Autoplay only when the card is in viewport — saves CPU/network.
  useEffect(() => {
    const v = videoRef.current
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
  }, [])

  return (
    <div
      onClick={() => onSelect?.(template)}
      className="group cursor-pointer flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden rounded-[10px] bg-charcoal-600 ring-1 ring-charcoal-400/60 group-hover:ring-charcoal-200/80 transition-all">
        {template.video ? (
          <video
            ref={videoRef}
            src={template.video}
            poster={template.image}
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <img
            src={template.image}
            alt={template.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        )}
        {/* Gentle bottom gradient so tag pills stay legible */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />

        {/* Brand badge top-left */}
        {template.brand && (
          <div
            className="absolute top-2 left-2 flex items-center gap-1.5 backdrop-blur-md rounded-md pl-1 pr-2 py-0.5 text-[0.75rem] text-white shadow-sm"
            style={{
              background: template.brandColor
                ? `${template.brandColor}E0`
                : 'rgba(0,0,0,0.55)',
            }}
          >
            <span className="w-4 h-4 rounded-sm bg-white/15 inline-flex items-center justify-center text-[0.56rem] font-bold tracking-tight">
              {template.brand[0]}
            </span>
            <span className="leading-none">{template.brand}</span>
          </div>
        )}

        {/* Tag pills bottom-right */}
        <div className="absolute bottom-2 right-2 flex gap-1 flex-wrap justify-end max-w-[85%]">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="bg-black/65 backdrop-blur-sm text-white text-[0.75rem] px-1.5 py-0.5 rounded font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 px-0.5">
        <div className="text-[0.875rem] font-semibold text-white leading-tight tracking-tight">
          {template.title}
        </div>
        <div className="text-[0.78rem] text-smoke-700 leading-snug mt-1 line-clamp-2">
          {template.description}
        </div>
        <div className="flex items-center gap-1.5 text-smoke-700 text-[0.72rem] mt-2.5">
          <GitBranch size={12} strokeWidth={1.6} />
          <span>{template.nodeCount} nodes</span>
        </div>
      </div>
    </div>
  )
}
