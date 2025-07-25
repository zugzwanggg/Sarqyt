/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryColor: "#2CC07D",
        lightGreen: "#67AE6E",
        apricot: "#F6A623",
        black: "#2B2B2B"
      }
    },
  },
  plugins: [],
}