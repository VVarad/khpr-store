/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0A',
        surface: '#111111',
        border: '#1E1E1E',
        gold: '#C9A96E',
        'gold-light': '#E8C98A',
        'text-primary': '#F5F0E8',
        'text-secondary': '#8A8278',
        'text-muted': '#4A4540',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
