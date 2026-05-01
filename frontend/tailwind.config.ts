import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#141414',
        card: '#1a1a1a',
        border: '#222222',
        accent: '#1e40af',
        gold: '#60a5fa',
        muted: '#555555',
      },
      fontFamily: {
        display: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['"SF Mono"', '"JetBrains Mono"', '"Courier New"', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        btn: '6px',
        badge: '4px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.32)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.48)',
      },
    },
  },
  plugins: [],
} satisfies Config
