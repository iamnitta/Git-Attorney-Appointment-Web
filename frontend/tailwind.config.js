/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-brown': '#F2EDE9',
        'dark-brown': '#4E342E',
        'gray': '#e6e6e6',
        'primary': '#A3806C'
      },
      fontFamily: {
        kanit: ['Kanit', 'sans-serif'],
        sarabun: ['Sarabun', 'sans-serif'],
        prompt: ['Prompt', 'sans-serif'],
        mitr: ['Mitr', 'sans-serif']
      }
    },
  },
  plugins: [],
}