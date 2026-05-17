/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Comfy charcoal palette (extracted from cloud.comfy.org)
        charcoal: {
          100: '#55565e',
          200: '#494a50',
          300: '#3c3d42',
          400: '#313235',
          500: '#2d2e32',
          600: '#262729',
          700: '#202121',
          800: '#171718',
        },
        ash: {
          500: '#828282',
          800: '#444444',
        },
        smoke: {
          100: '#f3f3f3',
          200: '#e9e9e9',
          300: '#e1e1e1',
          400: '#d9d9d9',
          500: '#c5c5c5',
          600: '#b4b4b4',
          700: '#a0a0a0',
          800: '#8a8a8a',
        },
        // Brand
        run: '#0B8CE9', // primary action blue
        'run-hover': '#0a7ed1',
        electric: '#f0ff41',
        sapphire: '#172dd7',
        canvas: '#202020',
        socket: {
          image: '#9aa6c4',
          mask: '#ff6b6b',
          model: '#4ade80',
        },
      },
      borderRadius: {
        node: '10px',
        card: '12px',
      },
      boxShadow: {
        modal: '0 30px 80px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        node: '0 4px 14px -2px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
