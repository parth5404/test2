/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'chai-brown': '#8B4513',
        'chai-light': '#D2691E',
      },
    },
  },
  plugins: [],
}
