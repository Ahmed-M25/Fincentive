/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero': "url('../src/assets/StockBg.png')"
      },
      fontFamily: {
        headline: ['Bebas Neue', 'sans-serif']
      },
    },
  },
  plugins: [],
}

