/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        ar: ['Cairo', 'Readex Pro', 'sans-serif'],
        en: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      colors: {
        glass: {
          border: 'rgba(255, 255, 255, 0.18)',
          'border-highlight': 'rgba(255, 255, 255, 0.35)',
          surface: 'rgba(255, 255, 255, 0.06)',
          'surface-hover': 'rgba(255, 255, 255, 0.12)',
          dark: 'rgba(10, 15, 30, 0.65)',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          400: '#38bdf8',
          500: '#0284c7',
          600: '#0369a1',
          cyan: '#06b6d4',
          violet: '#8b5cf6',
          amber: '#f59e0b',
        }
      },
      backdropBlur: {
        '2xl': '24px',
        '3xl': '40px',
      },
      animation: {
        'mesh-slow': 'aurora 18s ease-in-out infinite alternate',
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        aurora: {
          '0%': { transform: 'scale(1) rotate(0deg) translate(0px, 0px)' },
          '50%': { transform: 'scale(1.15) rotate(180deg) translate(30px, -20px)' },
          '100%': { transform: 'scale(1) rotate(360deg) translate(0px, 0px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
