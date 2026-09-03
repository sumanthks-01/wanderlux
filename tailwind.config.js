/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand — Deep Saffron / Amber-Gold
        primary: {
          50:  '#fff9eb',
          100: '#fef0c7',
          200: '#fdde89',
          300: '#fcc84b',
          400: '#fab822',  // main interactive
          500: '#f59e00',  // core brand
          600: '#c97c00',
          700: '#a05c00',
          800: '#834700',
          900: '#6b3a00',
          950: '#3e2000',
        },
        // Accent — Rose Crimson / Sunset Red
        accent: {
          50:  '#fff1f2',
          100: '#ffe0e2',
          200: '#ffc6ca',
          300: '#ff9ba2',
          400: '#ff6272',  // main accent
          500: '#f83a4e',  // core accent
          600: '#d91d34',
          700: '#b51630',
          800: '#97162e',
          900: '#7f172d',
        },
        // Warm Obsidian backgrounds
        dark: {
          900: '#0c0a08',  // near-black warm
          800: '#141210',  // deep warm dark
          700: '#1f1c19',  // card surface
          600: '#2e2a26',  // elevated
          500: '#443f3a',  // muted
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono:    ['JetBrains Mono', 'monospace'],
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
        'glow':       '0 0 24px rgba(245, 158, 0, 0.35)',
        'glow-rose':  '0 0 24px rgba(248, 58, 78, 0.35)',
        'card':       '0 4px 40px rgba(0,0,0,0.5)',
        'card-hover': '0 8px 60px rgba(0,0,0,0.7)',
        'glass':      '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
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
