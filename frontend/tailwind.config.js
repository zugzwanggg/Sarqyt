/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryColor: "#3EC171",
        lightGreen: "#E2F2E7",
        grayColor: "#CECECE",
        lightGrayColor: "#F2F2F2",
        apricot: "#F6A623",
        blackColor: "#2B2B2B"
      }
    },
  },
  plugins: [],
}