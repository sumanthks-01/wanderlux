/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand — Electric Acid Lime / Cyber Pistachio
        primary: {
          50:  '#f9ffe5',
          100: '#f1ffbe',
          200: '#e3ff86',
          300: '#ccff43',
          400: '#b5ff0d',  // Glowing neon accent
          500: '#9be600',  // Core brand primary
          600: '#78b800',
          700: '#5a8c00',
          800: '#486e04',
          900: '#3c5c08',
          950: '#1d3400',
        },
        // Accent — Hyper Cyber Aqua / Cyan-Mint
        accent: {
          50:  '#e6fffa',
          100: '#b3ffe6',
          200: '#80ffcc',
          300: '#33ffb3',
          400: '#00f5d4',  // Main accent highlight
          500: '#00d6b9',  // Core accent
          600: '#00a892',
          700: '#008574',
          800: '#02695c',
          900: '#06574d',
        },
        // Backgrounds — Deep Charcoal Obsidian Graphite
        dark: {
          900: '#0a0c0e',  // Deep charcoal obsidian
          800: '#121519',  // Card background
          700: '#1b2026',  // Elevated layer
          600: '#272e37',  // Hover layer
          500: '#3d4754',  // Borders / muted
        },
      },
      fontFamily: {
        sans:      ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display:   ['Syne', 'sans-serif'],
        editorial: ['Instrument Serif', 'Georgia', 'serif'],
        mono:      ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        xs:    ['0.75rem',  { lineHeight: '1rem' }],
        sm:    ['0.875rem', { lineHeight: '1.25rem' }],
        base:  ['1rem',     { lineHeight: '1.5rem' }],
        lg:    ['1.125rem', { lineHeight: '1.75rem' }],
        xl:    ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem',   { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem',  { lineHeight: '2.5rem' }],
        '5xl': ['3rem',     { lineHeight: '1' }],
        '6xl': ['3.75rem',  { lineHeight: '1' }],
        '7xl': ['4.5rem',   { lineHeight: '1' }],
        '8xl': ['6rem',     { lineHeight: '1' }],
        '9xl': ['8rem',     { lineHeight: '1' }],
      },
      spacing: {
        18: '4.5rem', 22: '5.5rem', 26: '6.5rem',
        30: '7.5rem', 34: '8.5rem', 38: '9.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'glow':        '0 0 32px rgba(181, 255, 13, 0.45)',
        'glow-accent': '0 0 32px rgba(0, 245, 212, 0.45)',
        'card':        '0 8px 40px rgba(0,0,0,0.6)',
        'card-hover':  '0 12px 60px rgba(0,0,0,0.8)',
        'glass':       '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
      },
      animation: {
        'shimmer':       'shimmer 1.5s infinite linear',
        'float':         'float 6s ease-in-out infinite',
        'pulse-slow':    'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':       'fadeIn 0.5s ease-out',
        'slide-up':      'slideUp 0.5s ease-out',
        'gradient-shift':'gradientShift 8s ease infinite',
        'typing':        'typing 1.4s infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        fadeIn:      { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        typing: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.3' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      zIndex: { 60: '60', 70: '70', 80: '80', 90: '90' },
    },
  },
  plugins: [],
}
