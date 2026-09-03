/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand — Minimalist Crimson Accent (Not orange, blue, purple, or green)
        primary: {
          50:  '#fff5f5',
          100: '#ffe3e3',
          200: '#ffc9c9',
          300: '#ffa2a2',
          400: '#ff6b6b',
          500: '#e63946',  // Core Crisp Crimson
          600: '#d62828',  // Deep Crimson
          700: '#b71c1c',
          800: '#8b0000',
          900: '#5c0000',
          950: '#380000',
        },
        // Sand Cream (Warm neutral contrast)
        sand: {
          50:  '#faf8f5',
          100: '#f4f0e8',
          200: '#e7ded0',
          300: '#d6c6b1',
          400: '#c2ab8f',
          500: '#af9172',
        },
        // Backgrounds — Deep Obsidian Charcoal
        dark: {
          900: '#0a0a0c',  // Deepest obsidian black
          800: '#141417',  // Card container surface
          700: '#1e1e24',  // Elevated layer
          600: '#2b2b33',  // Hover layer
          500: '#42424d',  // Borders
        },
      },
      fontFamily: {
        sans:      ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display:   ['Syne', 'sans-serif'],
        editorial: ['Instrument Serif', 'Georgia', 'serif'],
        mono:      ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'glow':       '0 0 30px rgba(230, 57, 70, 0.35)',
        'card':       '0 10px 40px rgba(0, 0, 0, 0.7)',
        'glass':      '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      },
    },
  },
  plugins: [],
}
