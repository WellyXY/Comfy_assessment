// Seedance 2.0 Reference-to-Video workflow shown in the State B/C canvas.
// 4 Load Image nodes (1 character + 3 outfits) → ByteDance Seedance 2.0 R2V → Save Video.
// All strings are English-only.

export type Field =
  | { label: string; type: 'number'; value: number }
  | { label: string; type: 'text'; value: string }
  | { label: string; type: 'select'; value: string }
  | { label: string; type: 'seed'; value: string }

export type Socket = { id: string; label: string; color?: string }

export type WorkflowNode = {
  id: string
  x: number
  y: number
  w: number
  title: string
  accent?: 'green' | 'amber' | 'plain'
  previewImage?: string
  previewCaption?: string
  textContent?: string
  textTitle?: string
  prompt?: string
  fields?: Field[]
  inputs?: Socket[]
  outputs?: Socket[]
  showSubgraph?: boolean
  advancedToggle?: boolean
  collapsedByDefault?: boolean
  /** Optional data-coach tag — lets the canvas coach target a specific node. */
  coachTag?: string
}

export type Wire = {
  from: { nodeId: string; output: string }
  to: { nodeId: string; input: string }
}

const CHARACTER_IMG =
  'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=600&q=70'
const OUTFIT_1 =
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=70'
const OUTFIT_2 =
  'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=600&q=70'
const OUTFIT_3 =
  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=70'

const SEEDANCE_PROMPT =
  'fast-paced fashion showcase video, fisheye lens extreme wide-angle distortion, glitch transitions and digital distortion effects.'

const IMG_COLOR = '#a9d9b8'
const MASK_COLOR = '#e36a6a'

function loadImage(
  id: string,
  x: number,
  title: string,
  filename: string,
  previewImage: string,
  caption: string,
  coachTag?: string,
): WorkflowNode {
  return {
    id,
    x,
    y: 90,
    w: 220,
    title,
    accent: 'plain',
    previewImage,
    previewCaption: caption,
    fields: [{ label: 'file', type: 'text', value: filename }],
    outputs: [
      { id: 'image', label: 'image', color: IMG_COLOR },
      { id: 'mask', label: 'mask', color: MASK_COLOR },
    ],
    coachTag,
  }
}

export const ugcWorkflow: { nodes: WorkflowNode[]; wires: Wire[] } = {
  nodes: [
    // ── 4 Load Image nodes (1 character + 3 outfit references) ──────────
    loadImage(
      'character',
      60,
      'Character Image',
      'selfie_cartoon.png',
      CHARACTER_IMG,
      '1533 × 2732',
      'character-node',
    ),
    loadImage(
      'outfit-1',
      320,
      'Outfit 1',
      'sd_outfit_1.png',
      OUTFIT_1,
      '1528 × 2736',
      'outfit-node',
    ),
    loadImage('outfit-2', 580, 'Outfit 2', 'sd_outfit_2.png', OUTFIT_2, '1528 × 2736'),
    loadImage('outfit-3', 840, 'Outfit 3', 'sd_outfit_3.png', OUTFIT_3, '1528 × 2736'),

    // ── ByteDance Seedance 2.0 R2V — the model node (amber accent) ──────
    // Slimmed: only the 4 image inputs that are actually wired, seed hidden,
    // technical "advanced" inputs collapsed behind the toggle.
    {
      id: 'seedance',
      x: 1120,
      y: 90,
      w: 280,
      title: 'Seedance 2.0 — Reference to Video',
      accent: 'amber',
      inputs: [
        { id: 'image_1', label: 'character', color: IMG_COLOR },
        { id: 'image_2', label: 'outfit 1', color: IMG_COLOR },
        { id: 'image_3', label: 'outfit 2', color: IMG_COLOR },
        { id: 'image_4', label: 'outfit 3', color: IMG_COLOR },
      ],
      outputs: [{ id: 'video', label: 'video', color: IMG_COLOR }],
      prompt: SEEDANCE_PROMPT,
      fields: [
        { label: 'model', type: 'select', value: 'Seedance 2.0' },
        { label: 'resolution', type: 'select', value: '720p' },
        { label: 'ratio', type: 'select', value: '1:1' },
        { label: 'duration', type: 'number', value: 7 },
      ],
      advancedToggle: true,
    },

    // ── Save Video node ──────────────────────────────────────────────────
    {
      id: 'save-video',
      x: 1450,
      y: 90,
      w: 220,
      title: 'Save Video',
      inputs: [{ id: 'video', label: 'video', color: IMG_COLOR }],
      fields: [
        { label: 'filename', type: 'text', value: 'Seedance2.0_r2v' },
        { label: 'format', type: 'select', value: 'auto' },
        { label: 'codec', type: 'select', value: 'auto' },
      ],
    },
  ],
  wires: [
    { from: { nodeId: 'character', output: 'image' }, to: { nodeId: 'seedance', input: 'image_1' } },
    { from: { nodeId: 'outfit-1', output: 'image' }, to: { nodeId: 'seedance', input: 'image_2' } },
    { from: { nodeId: 'outfit-2', output: 'image' }, to: { nodeId: 'seedance', input: 'image_3' } },
    { from: { nodeId: 'outfit-3', output: 'image' }, to: { nodeId: 'seedance', input: 'image_4' } },
    { from: { nodeId: 'seedance', output: 'video' }, to: { nodeId: 'save-video', input: 'video' } },
  ],
}
