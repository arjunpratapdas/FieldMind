/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'field-bg': '#0D1B2A',
        'field-surface': '#1F2937',
        'field-panel': '#111827',
        'field-border': '#374151',
        'field-amber': '#F9A825',
        'field-gold': '#FFB300',
        'field-cyan': '#00BCD4',
        'field-green': '#4ADE80',
        'field-red': '#FF3B30',
        'field-orange': '#FB923C',
        'field-blue': '#1D4ED8',
        'field-text': '#F9FAFB',
        'field-text-dim': '#9CA3AF',
        'field-muted': '#6B7280',
      },
      fontFamily: {
        'display': ['Barlow Condensed', 'sans-serif'],
        'body': ['IBM Plex Sans', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },
      keyframes: {
        scan: {
          '0%': { top: '-2px' },
          '100%': { top: '100%' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        'slide-up': {
          'from': { transform: 'translateY(100%)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-right': {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
