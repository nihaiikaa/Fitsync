/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0A0B0E',
          surface: '#111318',
          card: '#161920',
          elevated: '#1D212B',
          border: '#242936',
          borderLight: '#32394A',
          subtext: '#8E95A5',
        },
        brand: {
          DEFAULT: '#10E567',
          hover: '#25F479',
          muted: '#0D9B48',
          dark: '#084820',
          glow: 'rgba(16, 229, 103, 0.2)',
          surface: 'rgba(16, 229, 103, 0.08)',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'lime-sm': '0 0 15px -3px rgba(16, 229, 103, 0.25)',
        'lime-md': '0 0 25px -5px rgba(16, 229, 103, 0.35)',
        'dark-card': '0 8px 24px -4px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
