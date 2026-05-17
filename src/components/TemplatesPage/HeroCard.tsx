import { useEffect, useRef, useState } from 'react'
import { Link2, Play, Sparkles } from 'lucide-react'
import type { HeroPromo } from '../../data/templates'

type Props = {
  promo: HeroPromo
  onSelect?: (id: string) => void
}

/** Crossfade through a sequence of product photos. */
function TransformSequence({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (images.length < 2) return
    const dwell = idx === 0 ? 1800 : 1100
    const t = setTimeout(() => {
      setIdx((i) => (i + 1) % images.length)
    }, dwell)
    return () => clearTimeout(t)
  }, [idx, images.length])

  return (
    <div className="absolute inset-0">
      {images.map((src, i) => {
        const isActive = i === idx
        return (
          <img
            key={src}
            src={src}
            alt=""
            loading={i === 0 ? 'eager' : 'lazy'}
            className={`absolute inset-0 w-full h-full object-cover transition-all ease-out ${
              isActive
                ? 'opacity-100 scale-100 duration-[1200ms]'
                : 'opacity-0 scale-[1.08] duration-700'
            }`}
          />
        )
      })}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/55 backdrop-blur-md rounded-full pl-2 pr-2.5 py-1 text-white text-[0.72rem]">
        <Sparkles size={11} className="text-electric" />
        <span className="font-mono tabular-nums">
          {String(idx + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

/** 3 vertical videos side-by-side. */
function VideoTriptych({ videos }: { videos: string[] }) {
  return (
    <div className="absolute inset-0 flex gap-1 p-1">
      {videos.map((src, i) => (
        <TriptychTile key={i} src={src} delay={i * 250} />
      ))}
    </div>
  )
}

function TriptychTile({ src, delay }: { src: string; delay: number }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger the playback start so the 3 clips don't move in lockstep
          setTimeout(() => v.play().catch(() => {}), delay)
        } else v.pause()
      },
      { threshold: 0.2 },
    )
    obs.observe(v)
    return () => obs.disconnect()
  }, [delay])
  return (
    <div className="flex-1 rounded-md overflow-hidden bg-charcoal-600 ring-1 ring-black/20">
      <video
        ref={ref}
        src={src}
        loop
        muted
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
      />
    </div>
  )
}

/** Animated URL bar — types out the URL, pauses, restarts. */
function UrlInputAnimation({ url }: { url: string }) {
  const [typed, setTyped] = useState(0)
  useEffect(() => {
    if (typed >= url.length) {
      const t = setTimeout(() => setTyped(0), 2200)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setTyped((n) => n + 1), 70)
    return () => clearTimeout(t)
  }, [typed, url.length])

  return (
    <div className="absolute left-3 right-3 bottom-3 flex items-center gap-2 bg-black/75 backdrop-blur-md rounded-lg px-3 py-2 ring-1 ring-white/10">
      <Link2 size={12} className="text-electric shrink-0" />
      <div className="flex-1 min-w-0 font-mono text-white text-[0.78rem] truncate">
        {url.slice(0, typed)}
        <span className="inline-block w-[1px] h-[0.9em] bg-electric ml-[1px] align-middle animate-pulse" />
      </div>
      <button className="shrink-0 bg-electric text-black text-[0.7rem] font-semibold px-2 py-0.5 rounded">
        Generate
      </button>
    </div>
  )
}

export function HeroCard({ promo, onSelect }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasTransform =
    Array.isArray(promo.transformSequence) && promo.transformSequence.length > 1
  const hasTriptych =
    Array.isArray(promo.videoTriptych) && promo.videoTriptych.length >= 2

  useEffect(() => {
    if (hasTransform || hasTriptych) return
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
  }, [hasTransform, hasTriptych])

  return (
    <div
      onClick={() => onSelect?.(promo.id)}
      className="group cursor-pointer flex flex-col"
    >
      {/* Image / video / triptych */}
      <div className="relative aspect-[5/4] overflow-hidden rounded-[14px] bg-charcoal-600 ring-1 ring-charcoal-400/50 group-hover:ring-charcoal-200/70 transition-all">
        {hasTransform ? (
          <TransformSequence images={promo.transformSequence!} />
        ) : hasTriptych ? (
          <VideoTriptych videos={promo.videoTriptych!} />
        ) : (
          <video
            ref={videoRef}
            src={promo.video}
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}

        {/* Demo affordance — top-right (hidden for transform / triptych) */}
        {!hasTransform && !hasTriptych && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/55 backdrop-blur-md rounded-full pl-1.5 pr-2.5 py-1 text-white text-[0.72rem]">
            <span className="w-4 h-4 rounded-full bg-white/15 inline-flex items-center justify-center">
              <Play size={8} fill="white" className="text-white" />
            </span>
            Demo
          </div>
        )}

        {/* Brand badge top-left */}
        {promo.brand && !hasTransform && !hasTriptych && (
          <div
            className="absolute top-3 left-3 flex items-center gap-1.5 backdrop-blur-md rounded-md pl-1 pr-2 py-0.5 text-[0.72rem] text-white shadow"
            style={{
              background: promo.brandColor
                ? `${promo.brandColor}E6`
                : 'rgba(0,0,0,0.65)',
            }}
          >
            <span className="w-4 h-4 rounded-sm bg-white/15 inline-flex items-center justify-center text-[0.56rem] font-bold">
              {promo.brand[0]}
            </span>
            <span>{promo.brand}</span>
          </div>
        )}

        {/* Animated URL input pinned to bottom of image */}
        {promo.urlAnimation && <UrlInputAnimation url={promo.urlAnimation} />}
      </div>

      {/* Text caption below the image */}
      <div className="pt-3 px-0.5">
        <h3 className="text-white font-bold tracking-tight uppercase text-[1rem] leading-tight">
          {promo.hero.headline}
        </h3>
        <p className="text-smoke-700 text-[0.8125rem] mt-1.5 line-clamp-1">
          {promo.hero.subtitle}
        </p>
      </div>
    </div>
  )
}
