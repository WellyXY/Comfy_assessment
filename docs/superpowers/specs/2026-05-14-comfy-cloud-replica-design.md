# Comfy Cloud Pixel Replica — Design Spec

**Date:** 2026-05-14
**Purpose:** Build a pixel-faithful interactive replica of the Comfy Cloud editor's onboarding moment, as the baseline prototype for an activation/retention assessment. Future iterations will overlay improved onboarding flows on top of this baseline.

## Goal & Scope

Recreate two states of the Comfy Cloud editor at high visual fidelity:

- **State A — Blank canvas + Template modal open.** The state a new user sees: empty canvas, full Template selector modal floating over it with category nav, filters, search, and a 4-column card grid.
- **State B — Template loaded.** After picking the `gsc_starter_1` ("1.1 Intro: Text-to-Image") template: two nodes on canvas (Z-Image-Turbo + Save Image) wired together, plus two onboarding sticky-notes ("Step 1 — Connect nodes", "Step 2 — Download image", "Hit run").

A small floating chip in the corner switches between A and B for live demo.

Out of scope: drag-able nodes (no react-flow), actually executing prompts, real auth, persistence.

## Design tokens (extracted from cloud.comfy.org CSS vars)

```
font:              Inter
canvas bg:         #202020
sidebar (deepest): #171718  charcoal-800
panel bg:          #202121  charcoal-700
node header bg:    #262729  charcoal-600
node body bg:      #2d2e32  charcoal-500
border subtle:     #313235  charcoal-400
border medium:     #3c3d42  charcoal-300
text muted:        #828282  ash-500
text dim:          #494a50
brand run blue:    #0B8CE9  (hardcoded in run button)
brand yellow:      #f0ff41  electric-400 (sticky-note accents)
brand deep blue:   #172dd7  sapphire-700
radius:            8px (buttons), 10–12px (cards, modal)
left rail width:   59px
right rail width:  ~210px
top tab bar height: ~28px
```

## Trade-off decisions (resolved)

1. **UI copy language → English.** Reviewer audience is US-based; assessment slides will be English.
2. **Tab bar workflow names → 5 anonymized placeholders.** `text-to-image`, `product-photo`, `video-loop`, `Unsaved Workflow*`, `gsc_starter_1*` (last one bold/active in State B).

## Tech stack

- Vite + React 18 + TypeScript
- TailwindCSS with Comfy palette wired into `tailwind.config.js`
- `lucide-react` for icons (open-source, matches the line-icon style)
- No state library — `useState` only, single source of truth at `App.tsx`
- One absolute-positioned SVG overlay for the wire between State B's two nodes

## Component inventory

```
src/
  App.tsx                          // top-level layout, state-switch chip, A↔B routing
  components/
    TabBar.tsx                     // ~28px top strip
    LeftRail.tsx                   // 59px icon column
    RightTaskQueue.tsx             // ~210px right panel with task list + minimap
    RunBar.tsx                     // top-right run cluster
    StatusBar.tsx                  // bottom-left overlay text
    Canvas/
      DotGrid.tsx                  // dot-pattern bg
      Node.tsx                     // generic node shell (header + sockets + body slots)
      StickyNote.tsx               // annotation note
      WireOverlay.tsx              // SVG bezier between sockets
    TemplateModal/
      index.tsx                    // overlay + container
      CategoryNav.tsx              // 140px left column
      FilterRow.tsx                // 3 dropdowns + sort
      TemplateCard.tsx             // image + brand badge + tag pills + title + desc + node count
      SearchBar.tsx                // top search input with placeholder
  data/
    templates.ts                   // 12 cards; titles + descriptions + image URLs (use picsum or local placeholders)
    starterWorkflow.ts             // node positions, field values, sticky-note text
  styles/
    index.css                      // tailwind directives + Inter font import + comfy CSS vars
```

## State A specifics

- TabBar shows 5 tabs; "Unsaved Workflow*" active (with orange modified-dot)
- LeftRail visible, 模板 (Templates) icon shown highlighted because modal is open
- Canvas is completely empty, just the dot-grid
- StatusBar visible bottom-left
- Right panel visible (task queue empty state)
- Template modal centered, ~850×420, with backdrop dim
- Modal default category: "All Templates" with 8–12 cards in grid

## State B specifics

- TabBar shows `gsc_starter_1*` active
- LeftRail unhighlighted
- Canvas has:
  - **Z-Image-Turbo node** at approx (300, 220), width 240px
    - Output socket "images" on right
    - Prompt textarea (4–5 lines visible, real `<textarea>` user can edit)
    - 6 field rows: width=1920, height=1088, seed=336703310549440, unet_name, clip_name, vae_name (all real `<input>`/`<select>`)
    - Bottom: "Enter subgraph" button
  - **Save Image node** at approx (660, 220), width 220px
    - Input socket "images" on left (wired)
    - filename_prefix input = "comfyui-airport-editorial"
  - **Sticky note 1** at approx (480, 100): "Step 1 — Connect nodes ↗ Try to connect these 2 nodes 👈"
  - **Sticky note 2** at approx (970, 175): "Step 2 — Download image ↗ 1. The result is here ✨ 2. Right-click and download the image."
  - **Sticky note 3** at approx (970, 80): "Hit run 🚀"
- Wire from Z-Image-Turbo `images` output → Save Image `images` input
- Modal closed, not rendered

## Demo affordance: state switcher chip

- Fixed bottom-right corner (above the minimap location? — no, top-right just below the avatar so it's out of any captured screenshot region for slides)
- Two-button toggle: `State A` | `State B`
- Subtle outline, doesn't pretend to be Comfy UI — it's explicitly a demo control

## Out of scope (explicit)

- Drag-and-drop nodes
- Real workflow execution / API calls
- Authentication / accounts
- Persistence
- Mobile / responsive (desktop-only, 1440+ optimized)
- Locale switching (English-only)

## Success criteria

- Side-by-side comparison with the captured reference screenshot reveals only intentional differences (English copy, anonymized tab names)
- Prompt textarea in State B accepts typing
- State A/B toggle works smoothly without remount flash
- Page loads under 2s on cold cache
- No console errors
