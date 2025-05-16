/** @type {import('tailwindcss').Config} */
module.exports = {
  // @see https://tailwindcss.com/docs/upcoming-changes
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class', // 'media' or 'class' or false
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
