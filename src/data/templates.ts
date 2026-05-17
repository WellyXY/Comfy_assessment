export type ScenarioId =
  | 'e-commerce'
  | 'social-aesthetics'
  | 'media-trend'
  | 'cinema-style'

export type Template = {
  id: string
  scenarioId: ScenarioId
  title: string
  /** Long description shown in the card body */
  description: string
  /** Short one-liner shown on grid cards (and hero subtitle fallback) */
  tagline?: string
  modality: 'image' | 'video'
  /** Number of variants this preset can produce — shown as "N templates" */
  variantCount: number
  image: string
  video: string
  /** Optional carousel of videos for the grid card thumbnail — cycles in order on `onEnded`. */
  videoCarousel?: string[]
  /** Optional crossfade between videos — all videos autoplay simultaneously; the active one
   *  fades in. Default switch interval is 3000ms. */
  videoCrossfade?: string[]
  /** Optional carousel of images — crossfades through them on the grid card. */
  imageCarousel?: string[]
  /** Optional image sequence — when set, the hero card shows a
   *  transformation animation (first image is the input, rest cycle). */
  transformSequence?: string[]
  /** Optional image array — when set, the ScenarioCard collage on the
   *  right side renders these images instead of looping videos. Used
   *  for product-photography templates where stills convey more. */
  imageCollage?: string[]
  featured?: boolean
  /** Category IDs where this template should be pinned to the top of the filtered list. */
  pinnedFor?: string[]
  hero?: { headline: string; subtitle: string }
  brand?: string
  brandColor?: string
  // Convenience aliases kept for the existing card components:
  tags: string[]
  /** Mirrors variantCount; legacy field name. */
  nodeCount: number
  /** Mirrors [scenarioId]; legacy field used for filter chips. */
  categories: string[]
}

// Picsum poster fallback while the video loads
const img = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/720/900`

// Sanity CDN — used for the UGC Product Post transformation animation
const lumaCdn = (file: string) =>
  `https://cdn.sanity.io/images/2ylxvaa2/production/${file}?w=900&q=80&fit=crop&auto=format`

// ───────── Hero promo cards ─────────
// These are top-of-page FEATURE promos — Comfy capabilities being highlighted,
// not workflow templates per se. Kept separate from the `templates` list below.
export type HeroPromo = {
  id: string
  title: string
  video: string
  transformSequence?: string[]
  /** Optional 3-video triptych — when set, the hero shows three vertical clips
   *  side-by-side instead of the single full-bleed video. */
  videoTriptych?: string[]
  /** When set, an animated URL input is shown overlaid at the bottom. */
  urlAnimation?: string
  hero: { headline: string; subtitle: string }
  meta: string
  brand?: string
  brandColor?: string
}

export const heroCards: HeroPromo[] = [
  {
    id: 'comfy-agent',
    title: 'Comfy Agent',
    video: '/videos/comfy-agent-demo.mp4',
    hero: {
      headline: 'Build everything by agent',
      subtitle: 'Describe a goal. Ship a workflow.',
    },
    meta: 'Agent · Automation',
  },
  {
    id: 'social-ads-copy',
    title: 'Social Ads Copy',
    video: '/videos/marketing/01.mp4',
    videoTriptych: [
      '/videos/marketing/01.mp4',
      '/videos/marketing/02.mp4',
      '/videos/marketing/03.mp4',
    ],
    urlAnimation: 'amazon.com/dp/B0CVTXJZ8X',
    hero: {
      headline: 'One link in, marketing out',
      subtitle: 'Product URL → 40+ ad creatives',
    },
    meta: 'Marketing · 16 nodes',
  },
  {
    id: 'ugc-product-post',
    title: 'UGC Product Post',
    video: '/videos/vlog-selfie/01.mp4',
    transformSequence: [
      lumaCdn('c27b66480a1d1d45cee122082b87878e929e695b-750x422.png'),
      lumaCdn('03d98f51394617d4427e17692a60c7eb5df900b4-750x422.png'),
      lumaCdn('728e390759fdc756b96ee3464e51909a82468ba4-750x422.png'),
      lumaCdn('7548817b0c048bea8b9807abe15d1dd4bffdc93a-750x422.png'),
      lumaCdn('f2f02332f46a1a6c6f778719acca742cefa74ea0-750x422.png'),
      lumaCdn('4c4a623ef498c910d39a433083331b2d702793f8-750x422.png'),
      lumaCdn('ec3a2c26b08c24735b69c5281fe9f047e159b363-750x422.png'),
      lumaCdn('9932dd2d7fc5cb39ddaadfe266ed3658afe7ea6d-750x422.png'),
    ],
    hero: {
      headline: 'Turn any product into authentic',
      subtitle: 'Creator content, zero shoot day',
    },
    meta: 'UGC · Featured',
  },
  {
    id: 'seedance-gpt',
    title: 'Seedance 2.0 × GPT Image 2.0',
    video: '/videos/premium-hero-shot/01.mp4',
    brand: 'OpenAI × ByteDance',
    brandColor: '#1a1a1a',
    hero: {
      headline: 'Explore your creative',
      subtitle: 'Video moves + visual ideation, fused',
    },
    meta: 'Mixed-Model · Featured',
  },
]

export const templates: Template[] = [
  // ───────── Top picks — surfaced first ─────────
  {
    id: 'content-character-swap',
    scenarioId: 'social-aesthetics',
    title: 'Content Character Swap',
    description:
      "Drop a reference clip and your character. I'll re-shoot the whole video with your face — every gesture, every beat preserved — so any trending piece becomes yours overnight.",
    tagline: 'Swap the character in any clip',
    modality: 'video',
    variantCount: 10,
    image: '/videos/character-swap/01.mp4',
    video: '/videos/character-swap/01.mp4',
    videoCrossfade: [
      '/videos/character-swap/01.mp4',
      '/videos/character-swap/02.mp4',
    ],
    featured: true,
    hero: {
      headline: 'Content character swap',
      subtitle:
        'Reference clip + your character. The whole video re-shot with your face, gestures intact.',
    },
    tags: ['Video', 'Character'],
    nodeCount: 10,
    categories: ['social-aesthetics', 'media-trend'],
  },
  {
    id: 'relocalize-scenes',
    scenarioId: 'e-commerce',
    title: 'Relocalize Scenes',
    description:
      'Re-render a scene for a new market — swap the backdrop, restyle wardrobe and props, change signage language, and re-light to match local aesthetics. One shoot, every region.',
    tagline: 'Re-render any scene for a new market',
    modality: 'image',
    variantCount: 12,
    image: '/images/relocalize/01.png',
    imageCarousel: [
      '/images/relocalize/01.png',
      '/images/relocalize/02.png',
      '/images/relocalize/03.png',
      '/images/relocalize/04.png',
      '/images/relocalize/05.png',
    ],
    video: '',
    featured: true,
    hero: {
      headline: 'Relocalize scenes',
      subtitle:
        'One scene, every region — backdrop, wardrobe, signage, and lighting re-cast for each market.',
    },
    tags: ['Image', 'Localization'],
    nodeCount: 12,
    categories: ['e-commerce', 'cinema-style'],
  },
  {
    id: 'product-vfx',
    scenarioId: 'e-commerce',
    title: 'Product VFX',
    description:
      'Drop a product photo and pick an effect — liquid splash, glitter burst, smoke trail, lightning halo. Hollywood-grade VFX wrapped around your product, ready to drop straight into an ad.',
    tagline: 'Hollywood VFX wrapped on your product',
    modality: 'video',
    variantCount: 8,
    image:
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=720&q=70',
    video: '/videos/product-vfx/01.mp4',
    videoCarousel: [
      '/videos/product-vfx/01.mp4',
      '/videos/product-vfx/02.mp4',
      '/videos/product-vfx/03.mp4',
    ],
    featured: true,
    hero: {
      headline: 'Product VFX',
      subtitle:
        'Pick an effect — splash, glitter, smoke, lightning. Ad-ready VFX wrapped on your product.',
    },
    tags: ['Video', 'VFX'],
    nodeCount: 8,
    categories: ['e-commerce', 'media-trend'],
  },

  // ───────── E-commerce ─────────
  {
    id: 'marketing-video',
    scenarioId: 'e-commerce',
    title: 'Marketing Video',
    description:
      "Drop a product photo and a one-line angle. I'll cut a 15-second campaign video tuned for TikTok, Reels, or YouTube Shorts — with motion, captions, and a hook that lands in the first 2 seconds.",
    tagline: 'Cut a 15s campaign video, ready to ship',
    modality: 'video',
    variantCount: 8,
    image: img('lp-marketing'),
    video: '/videos/marketing/01.mp4',
    featured: true,
    hero: {
      headline: 'Marketing video',
      subtitle:
        'Product photo + one-line angle. 15s campaign-ready clip with captions and a 2-second hook.',
    },
    tags: ['Video', 'Marketing'],
    nodeCount: 8,
    categories: ['e-commerce'],
  },
  {
    id: 'product-variants',
    scenarioId: 'e-commerce',
    title: 'Product Variants',
    description:
      "Upload any product photo and I'll generate stunning color, texture, and finish variants — from sleek metallics to wild liquid metal — while preserving every detail of your product's shape.",
    tagline: 'Color, texture, finish — endless variants',
    modality: 'image',
    variantCount: 14,
    image: img('lp-variants'),
    video: '/videos/product-variants/01.mp4',
    featured: true,
    hero: {
      headline: 'Product variants',
      subtitle:
        'One product photo → sleek metallics, wild liquid metal, every finish. Shape preserved.',
    },
    transformSequence: [
      lumaCdn('c27b66480a1d1d45cee122082b87878e929e695b-750x422.png'),
      lumaCdn('03d98f51394617d4427e17692a60c7eb5df900b4-750x422.png'),
      lumaCdn('728e390759fdc756b96ee3464e51909a82468ba4-750x422.png'),
      lumaCdn('7548817b0c048bea8b9807abe15d1dd4bffdc93a-750x422.png'),
      lumaCdn('f2f02332f46a1a6c6f778719acca742cefa74ea0-750x422.png'),
      lumaCdn('4c4a623ef498c910d39a433083331b2d702793f8-750x422.png'),
      lumaCdn('ec3a2c26b08c24735b69c5281fe9f047e159b363-750x422.png'),
      lumaCdn('9932dd2d7fc5cb39ddaadfe266ed3658afe7ea6d-750x422.png'),
    ],
    tags: ['Image', 'E-commerce'],
    nodeCount: 14,
    categories: ['e-commerce', 'seedream-2'],
    // Multi-angle product photography for the right-side collage
    imageCollage: [
      lumaCdn('c27b66480a1d1d45cee122082b87878e929e695b-750x422.png'),
      lumaCdn('03d98f51394617d4427e17692a60c7eb5df900b4-750x422.png'),
      lumaCdn('728e390759fdc756b96ee3464e51909a82468ba4-750x422.png'),
      lumaCdn('7548817b0c048bea8b9807abe15d1dd4bffdc93a-750x422.png'),
      lumaCdn('f2f02332f46a1a6c6f778719acca742cefa74ea0-750x422.png'),
      lumaCdn('4c4a623ef498c910d39a433083331b2d702793f8-750x422.png'),
      lumaCdn('ec3a2c26b08c24735b69c5281fe9f047e159b363-750x422.png'),
      lumaCdn('9932dd2d7fc5cb39ddaadfe266ed3658afe7ea6d-750x422.png'),
    ],
  },
  {
    id: 'app-promotion',
    scenarioId: 'e-commerce',
    title: 'APP Promotion',
    description:
      "Drop your app screenshots. I'll spin them into a 10-second app store promo with smooth UI transitions, voiceover hook, and an end-card CTA.",
    tagline: 'App store promo with motion and CTA',
    modality: 'video',
    variantCount: 6,
    image: img('lp-app-promo'),
    video: '/videos/app-promotion/01.mp4',
    featured: true,
    hero: {
      headline: 'App promotion',
      subtitle:
        '3–5 screenshots in, 10-second store promo out — UI transitions, voiceover, end-card CTA.',
    },
    tags: ['Video', 'App'],
    nodeCount: 6,
    categories: ['e-commerce'],
  },
  {
    id: 'premium-hero-shot',
    scenarioId: 'e-commerce',
    title: 'Premium Hero Shot',
    description:
      'Turn a flat product photo into a magazine-grade hero: studio lighting, considered composition, and a backdrop that elevates the brand.',
    tagline: 'Magazine-grade product hero',
    modality: 'image',
    variantCount: 9,
    image: img('lp-hero-shot'),
    video: '/videos/premium-hero-shot/01.mp4',
    tags: ['Image', 'Brand'],
    nodeCount: 9,
    categories: ['e-commerce', 'seedream-2'],
  },

  // ───────── Social aesthetics ─────────
  {
    id: 'vlog-selfie',
    scenarioId: 'social-aesthetics',
    title: 'Vlog Selfie',
    description:
      'Turn a static selfie into a 9:16 vlog clip with subtle handheld motion, ambient room sound, and a soft cinematic look — ready to post.',
    tagline: 'Static selfie → 9:16 vlog clip',
    modality: 'video',
    variantCount: 5,
    image: img('lp-vlog'),
    video: '/videos/vlog-selfie/01.mp4',
    featured: true,
    hero: {
      headline: 'Vlog selfie',
      subtitle:
        'Static selfie → 9:16 handheld vlog clip with ambient audio and a cinematic look.',
    },
    tags: ['Video', 'Vertical'],
    nodeCount: 5,
    categories: ['social-aesthetics'],
  },
  {
    id: 'make-up',
    scenarioId: 'social-aesthetics',
    title: 'Make Up',
    description:
      "Drop a portrait. I'll generate 8 makeup looks across moods — clean girl, glam, editorial, K-beauty — keeping your face structure intact.",
    tagline: '8 makeup looks on your portrait',
    modality: 'image',
    variantCount: 8,
    image: img('lp-makeup'),
    video: '/videos/make-up/01.mp4',
    tags: ['Image', 'Beauty'],
    nodeCount: 8,
    categories: ['social-aesthetics', 'gpt-image-2'],
  },
  {
    id: 'transition',
    scenarioId: 'social-aesthetics',
    title: 'Transition',
    description:
      "Drop two photos. I'll stitch them with one of 6 viral transitions — spin, snap, glitch, mask wipe — synced to a beat drop.",
    tagline: 'Viral 4s transitions, beat-synced',
    modality: 'video',
    variantCount: 6,
    image: img('lp-transition'),
    video: '/videos/transition/01.mp4',
    tags: ['Video', 'Outfit'],
    nodeCount: 6,
    categories: ['social-aesthetics'],
  },

  // ───────── Media trend ─────────
  {
    id: 'dancing-preset',
    scenarioId: 'media-trend',
    title: 'Dancing Preset',
    description:
      "Drop a portrait or full-body photo. I'll animate it into a 6-second dance clip matched to a current trending sound.",
    tagline: 'Animate a still into a dance trend',
    modality: 'video',
    variantCount: 12,
    image: img('lp-dancing'),
    video: '/videos/dancing-preset/01.mp4',
    featured: true,
    hero: {
      headline: 'Dancing preset',
      subtitle:
        'Portrait or full-body photo → 6-second dance clip on a trending sound.',
    },
    tags: ['Video', 'Trend'],
    nodeCount: 12,
    categories: ['media-trend'],
  },
  {
    id: 'lipsync',
    scenarioId: 'media-trend',
    title: 'Lipsync',
    description:
      "Make any portrait sing. Drop a face + paste lyrics or pick from 50 trending audio clips, and I'll generate a synced lipsync video.",
    tagline: 'Make any portrait sing',
    modality: 'video',
    variantCount: 10,
    image: img('lp-lipsync'),
    video: '/videos/lipsync/01.mp4',
    tags: ['Video', 'Audio'],
    nodeCount: 10,
    categories: ['media-trend'],
  },
  {
    id: 'social-trend',
    scenarioId: 'media-trend',
    title: 'Social Trend',
    description:
      "Pick a trending format (POV, day-in-life, transformation, get-ready-with-me). I'll templateize your inputs into the format and ship a clip.",
    tagline: 'Project your asset into 7 trends',
    modality: 'video',
    variantCount: 7,
    image: img('lp-social-trend'),
    video: '/videos/social-trend/01.mp4',
    tags: ['Video', 'Trend'],
    nodeCount: 7,
    categories: ['media-trend'],
  },

  // ───────── Cinema style ─────────
  {
    id: 'character-create',
    scenarioId: 'cinema-style',
    title: 'Character Create',
    description:
      'Design original characters by exploring tons of visual options at once — silhouettes, costumes, expressions — without locking in too early.',
    tagline: 'Original characters, infinite directions',
    modality: 'image',
    variantCount: 22,
    image: img('lp-character'),
    video: '/videos/character-create/01.mp4',
    featured: true,
    hero: {
      headline: 'Character create',
      subtitle:
        'Describe a vibe → 8 silhouettes, full-body, expression sheet, and hero angles.',
    },
    tags: ['Image', 'Character'],
    nodeCount: 22,
    categories: ['cinema-style', 'gpt-image-2'],
  },
  {
    id: 'scene-transition',
    scenarioId: 'cinema-style',
    title: 'Scene Transition',
    description:
      'Connect two shots with a cinematic transition: match-cut, whip-pan, light bridge, or speed-ramp. Editor-grade, no editor needed.',
    tagline: 'Editor-grade match-cuts and whips',
    modality: 'video',
    variantCount: 6,
    image: img('lp-scene'),
    video: '/videos/scene-transition/01.mp4',
    tags: ['Video', 'Editing'],
    nodeCount: 6,
    categories: ['cinema-style'],
  },

  // ───────── Model showcases ─────────
  {
    id: 'seedream-r2v',
    scenarioId: 'cinema-style',
    title: 'Seedream 2.0 — Reference to Video',
    description:
      'Drop any reference clip — a 3-second movement, a camera move, a vibe. Seedream 2.0 re-generates the same motion language onto your subject and scene at high fidelity.',
    tagline: 'Best video model for your reference',
    modality: 'video',
    variantCount: 6,
    image:
      'https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?auto=format&fit=crop&w=720&q=70',
    video: '/videos/premium-hero-shot/03.mp4',
    tags: ['Video', 'Seedream 2.0'],
    nodeCount: 6,
    categories: ['cinema-style', 'seedream-2'],
    pinnedFor: ['seedream-2'],
    brand: 'Seedream 2.0',
    brandColor: '#7c3aed',
  },
  {
    id: 'gpt-image2-typography',
    scenarioId: 'e-commerce',
    title: 'GPT Image 2 — Typography Hero',
    description:
      'GPT Image 2 ships 4K posters and brand imagery with crisp, accurate text — no garbled letters, no warped fonts. Drop a brief and get campaign-ready visuals in one pass.',
    tagline: '4K images with near-perfect text rendering',
    modality: 'image',
    variantCount: 8,
    image:
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=720&q=70',
    video: '',
    tags: ['Image', 'GPT Image 2'],
    nodeCount: 8,
    categories: ['e-commerce', 'gpt-image-2'],
    pinnedFor: ['gpt-image-2'],
    brand: 'GPT Image 2',
    brandColor: '#10a37f',
  },
]

// Tag chips — mix of scenarios + featured underlying models
export const tagChips = [
  { id: 'all', label: 'All' },
  { id: 'featured', label: 'Featured' },
  { id: 'e-commerce', label: 'E-commerce' },
  { id: 'social-aesthetics', label: 'Social aesthetics' },
  { id: 'media-trend', label: 'Media trend' },
  { id: 'cinema-style', label: 'Cinema style' },
  { id: 'seedream-2', label: 'Seedream 2.0' },
  { id: 'gpt-image-2', label: 'GPT Image 2' },
] as const

export const scenarioLabels: Record<string, string> = {
  'e-commerce': 'E-commerce',
  'social-aesthetics': 'Social aesthetics',
  'media-trend': 'Media trend',
  'cinema-style': 'Cinema style',
}
