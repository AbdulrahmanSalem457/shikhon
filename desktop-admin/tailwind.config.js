/** @type {import('tailwindcss').Config} */
module.exports = {
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
        }
      }
    },
  },
  plugins: [],
};
