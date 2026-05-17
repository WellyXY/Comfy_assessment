export type NoteCategory = 'remove' | 'move' | 'add' | 'modify'

export type DesignNote = {
  id: string
  category: NoteCategory
  title: string
  body: string
  target: string
  steps?: Array<'login' | 'A' | 'B' | 'C'>
}

export const designNotes: DesignNote[] = [
  // ── Step 1 · Sign in ─────────────────────────────────────────────
  // One thesis: pre-onboarding surveys collect noise. Move it post-value.
  {
    id: 'remove-survey',
    category: 'remove',
    title: 'Remove blocking survey',
    body: "Front-loaded surveys hit 90%+ completion but the answers are noise — users click through to get into the product. Move it after first value, when intent is real.",
    target: '[data-tag="login-auth"]',
    steps: ['login'],
  },

  // ── Step 2 · Templates ───────────────────────────────────────────
  // Two theses: (1) paying before value is unnatural; (2) sell outcomes, not features.
  {
    id: 'remove-paywall',
    category: 'remove',
    title: 'Remove paywall',
    body: "Asking new users to pay for a product they haven't used is the biggest drop-off. Defer the gate until after the first successful generation.",
    target: '[data-tag="templates-page"]',
    steps: ['A'],
  },
  {
    id: 'modify-scenario-first',
    category: 'modify',
    title: 'Scenarios over capabilities',
    body: "Old layout sold features (img2vid, txt2vid). New layout sells outcomes (product photo, social ads, UGC) so users can see what they'll actually ship.",
    target: '[data-tag="hero-scenarios"]',
    steps: ['A'],
  },
  {
    id: 'add-scenario-categories',
    category: 'add',
    title: 'Scenario categories',
    body: 'Browse by use case — e-commerce, social aesthetics, media trend — not by model name. Users align their input/output expectation up front.',
    target: '[data-tag="category-tabs"]',
    steps: ['A'],
  },
  {
    id: 'modify-page-layout',
    category: 'modify',
    title: 'Standalone page',
    body: 'Modal popup → full page. Gives the scenario grid room to breathe and supports deeper browsing.',
    target: '[data-tag="templates-page"]',
    steps: ['A'],
  },

  // ── Step 3 · Template loaded (with agent) ────────────────────────
  // Thesis: the agent is the core differentiator (6–8 week investment).
  // 5 attributes: intent understanding, live workflow surface, in-chat asset ops,
  // output review, onboarding sync between chips and canvas.
  {
    id: 'move-survey',
    category: 'move',
    title: 'Survey moves here · adds social',
    body: 'Same questions, now in a dismissible popup after the user has seen the editor. Added a social-handle field so the team can follow up with high-intent creators.',
    target: '[data-tag="survey-popup"]',
    steps: ['B'],
  },
  {
    id: 'add-agent-core',
    category: 'add',
    title: 'Agent orchestrates the workflow',
    body: 'Describe a goal in natural language → the agent picks the right nodes and wires them. Removes the preset-editing cost so each user can hit their own production case.',
    target: '[data-tag="agent-flow"]',
    steps: ['B'],
  },
  {
    id: 'add-agent-flow',
    category: 'add',
    title: 'Live workflow surface',
    body: "Chips mirror the workflow the agent built. Clicking a chip highlights the matching nodes — users learn the graph by interaction, not by reading docs.",
    target: '[data-tag="agent-flow"]',
    steps: ['B'],
  },
  {
    id: 'add-asset-swap',
    category: 'add',
    title: 'Asset swap stays in chat',
    body: 'Tap @selfie / @outfits to upload — no need to dig into individual nodes. All operations live in the agent panel.',
    target: '[data-coach="product"]',
    steps: ['B'],
  },
  {
    id: 'add-coach',
    category: 'add',
    title: 'Onboarding coach',
    body: '3-step spotlight teaches the agent flow: replace character → product → generate. The chip↔canvas sync makes the graph self-explanatory.',
    target: '[data-coach="avatar"]',
    steps: ['B'],
  },

  // ── Step 4 · Template loaded (no agent) ──────────────────────────
  // Frames the friction that justifies the agent investment from Step 3.
  {
    id: 'c-direct-edit',
    category: 'add',
    title: 'Direct node editing',
    body: 'Without the agent, users replace assets directly on the canvas. Workable, but requires reading the graph.',
    target: '[data-coach="character-node"]',
    steps: ['C'],
  },
  {
    id: 'c-canvas-coach',
    category: 'add',
    title: 'Canvas-side coach',
    body: 'Same 3-step flow, but the spotlight lands on workflow nodes instead of agent chips — higher cognitive load. Motivates the agent investment.',
    target: '[data-coach="outfit-node"]',
    steps: ['C'],
  },
]

export const categoryStyles: Record<NoteCategory, { label: string; dot: string; ring: string }> = {
  remove: {
    label: 'Remove',
    dot: 'bg-rose-400',
    ring: 'border-rose-400/50',
  },
  move: {
    label: 'Move',
    dot: 'bg-amber-400',
    ring: 'border-amber-400/50',
  },
  add: {
    label: 'Add',
    dot: 'bg-electric',
    ring: 'border-electric/60',
  },
  modify: {
    label: 'Modify',
    dot: 'bg-sky-400',
    ring: 'border-sky-400/50',
  },
}
