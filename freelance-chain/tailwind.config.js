/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6D9773",
        secondary: "#0C3B2E",
        accent: "#BB8A52",
        highlight: "#FFBA00",
      },
    },
  },
  plugins: [],
}
