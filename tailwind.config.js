/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand — Electric Royal Violet / Radiant Purple
        primary: {
          50:  '#fbf5ff',
          100: '#f4e6ff',
          200: '#ebd0ff',
          300: '#dda6ff',
          400: '#c084fc',  // Core highlight
          500: '#a855f7',  // Main brand violet
          600: '#9333ea',  // Deep brand accent
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        // Accent — Acid Citron Lime / Electric Champagne
        accent: {
          50:  '#fafff0',
          100: '#f3ffe0',
          200: '#e4ffb8',
          300: '#d4ff00',  // Vivid neon citron
          400: '#ccff00',  // Main accent
          500: '#b8e600',  // Core accent highlight
          600: '#91b800',
          700: '#6f8c00',
          800: '#586e04',
          900: '#485c07',
        },
        // Backgrounds — Obsidian Ink & Midnight Violet Layering
        dark: {
          900: '#08070d',  // Deepest obsidian violet
          800: '#110f1a',  // Card background layer
          700: '#1a1827',  // Surface layer
          600: '#262338',  // Hover layer
          500: '#3c3757',  // Subtle borders
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
        'glow':       '0 0 32px rgba(168, 85, 247, 0.45)',
        'glow-accent':'0 0 32px rgba(212, 255, 0, 0.45)',
        'card':       '0 8px 40px rgba(0,0,0,0.65)',
        'card-hover': '0 12px 60px rgba(0,0,0,0.85)',
        'glass':      '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
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
