import { useEffect, useRef, useState } from 'react'
import type { Template } from '../../data/templates'

type Props = {
  template: Template
  onSelect?: (t: Template) => void
}

/** Single-cell card — original Comfy templates style: thumbnail + title + meta. */
export function GridCard({ template, onSelect }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  // Video carousel: cycle through clips on `onEnded`.
  const carousel = template.videoCarousel
  const [carouselIdx, setCarouselIdx] = useState(0)
  const currentVideoSrc = carousel ? carousel[carouselIdx] : template.video

  // Image carousel: auto-advance with a fade transition every 2.6s.
  const imgCarousel = template.imageCarousel
  const [imgIdx, setImgIdx] = useState(0)
  useEffect(() => {
    if (!imgCarousel || imgCarousel.length < 2) return
    const id = setInterval(() => {
      setImgIdx((i) => (i + 1) % imgCarousel.length)
    }, 2600)
    return () => clearInterval(id)
  }, [imgCarousel])

  // Video crossfade: all videos autoplay simultaneously stacked, active one fades in.
  const vidCrossfade = template.videoCrossfade
  const [crossIdx, setCrossIdx] = useState(0)
  useEffect(() => {
    if (!vidCrossfade || vidCrossfade.length < 2) return
    const id = setInterval(() => {
      setCrossIdx((i) => (i + 1) % vidCrossfade.length)
    }, 3000)
    return () => clearInterval(id)
  }, [vidCrossfade])

  // Auto-play the video only when the card is on screen.
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.15 },
    )
    obs.observe(v)
    return () => obs.disconnect()
  }, [])

  return (
    <button
      type="button"
      onClick={() => onSelect?.(template)}
      className="group text-left flex flex-col rounded-xl overflow-hidden bg-charcoal-700 border border-charcoal-500 hover:border-charcoal-200 transition-colors"
    >
      <div className="relative aspect-[4/5] bg-charcoal-600 overflow-hidden">
        {vidCrossfade && vidCrossfade.length > 0 ? (
          /* Video crossfade — stack all videos, only the active one is opaque. */
          vidCrossfade.map((src, i) => (
            <video
              key={src}
              src={src}
              loop
              muted
              autoPlay
              playsInline
              preload="metadata"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                i === crossIdx ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))
        ) : imgCarousel && imgCarousel.length > 0 ? (
          /* Image crossfade — stack all images, only the active one is opaque. */
          imgCarousel.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={template.title}
              loading={i === 0 ? 'eager' : 'lazy'}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                i === imgIdx ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))
        ) : currentVideoSrc ? (
          <video
            ref={ref}
            // `key` forces React to remount when the src changes so the new clip
            // starts playing from frame 0 instead of waiting for the buffer.
            key={currentVideoSrc}
            src={currentVideoSrc}
            poster={template.image}
            // When a carousel is set, don't loop — onEnded advances to the next clip.
            loop={!carousel}
            muted
            autoPlay
            playsInline
            preload="metadata"
            onEnded={
              carousel
                ? () => setCarouselIdx((i) => (i + 1) % carousel.length)
                : undefined
            }
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src={template.image}
            alt={template.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {/* Carousel dots — bottom-right indicator for any of the 3 carousel modes */}
        {(() => {
          const dots = vidCrossfade ?? imgCarousel ?? carousel
          const activeIdx = vidCrossfade
            ? crossIdx
            : imgCarousel
              ? imgIdx
              : carouselIdx
          if (!dots || dots.length <= 1) return null
          return (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-md rounded-full px-1.5 py-1">
              {dots.map((_, i) => (
                <span
                  key={i}
                  className={`w-1 h-1 rounded-full transition-colors ${
                    i === activeIdx ? 'bg-electric' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          )
        })()}
        {template.brand && (
          <div
            className="absolute top-2 left-2 flex items-center gap-1.5 backdrop-blur-md rounded-md pl-1 pr-2 py-0.5 text-[0.625rem] text-white shadow"
            style={{
              background: template.brandColor
                ? `${template.brandColor}E6`
                : 'rgba(0,0,0,0.55)',
            }}
          >
            <span className="w-3.5 h-3.5 rounded-sm bg-white/15 inline-flex items-center justify-center text-[0.5rem] font-bold">
              {template.brand[0]}
            </span>
            <span>{template.brand}</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="text-white text-[0.875rem] font-semibold leading-tight line-clamp-1 mb-1">
          {template.title}
        </div>
        <div className="text-smoke-700 text-[0.75rem] leading-snug line-clamp-2 mb-2 min-h-[2.25em]">
          {template.tagline ?? template.description}
        </div>
        <div className="flex items-center gap-1.5 text-[0.6875rem] text-smoke-500 capitalize">
          <span>{template.modality}</span>
          <span className="text-smoke-700">·</span>
          <span>{template.variantCount} templates</span>
        </div>
      </div>
    </button>
  )
}
