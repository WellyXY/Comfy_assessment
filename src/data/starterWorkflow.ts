export const starterWorkflow = {
  zImageTurbo: {
    x: 160,
    y: 220,
    w: 450,
    title: 'Z-Image-Turbo',
    prompt: `High-fashion editorial tight portrait, ultra-crisp detail
clean modern sheen, faint high-key digital gloss
hyper-saturated pale-lilac flat sky background
harsh unfiltered desert noon glare
female model standing, subtle head tilt to the side
calm yet piercing direct eye contact, quiet self-assured intensity
expression of someone who just solved a complex node chain perfectly
glossy dark-chocolate brown medium-length hair`,
    fields: [
      { label: 'width', type: 'number', value: 1920 },
      { label: 'height', type: 'number', value: 1088 },
      { label: 'seed', type: 'seed', value: '336703310549440' },
      { label: 'unet_name', type: 'select', value: 'Comfy-Org/z_image_turbo - z_image_tur…' },
      { label: 'clip_name', type: 'select', value: 'Comfy-Org/z_image_turbo - qwen_3_4b' },
      { label: 'vae_name', type: 'select', value: 'Comfy-Org/HiDream-l1_ComfyUI - ae' },
    ],
  },
  saveImage: {
    x: 660,
    y: 220,
    w: 420,
    title: 'Save Image',
    fields: [
      { label: 'filename_prefix', type: 'text', value: 'comfyui-airport-editorial' },
    ],
  },
  stickyNotes: [
    {
      x: 540,
      y: 95,
      w: 220,
      title: 'Step 1 — Connect nodes',
      body: 'Try to connect these 2 nodes 👈',
      tone: 'instruction',
    },
    {
      x: 1110,
      y: 95,
      w: 180,
      title: 'Hit run 🚀',
      body: '',
      tone: 'cta',
    },
    {
      x: 1110,
      y: 200,
      w: 260,
      title: 'Step 2 — Download image',
      body: '1. The result is here ✨\n2. Right-click and download the image.',
      tone: 'instruction',
    },
  ],
}
