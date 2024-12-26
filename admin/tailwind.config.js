/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ย้าย colors มาไว้ใน extend
      colors: {
        'light-brown': '#F2EDE9',
        'dark-brown': '#4E342E',
        'gray': '#F9F9F9',
        'light-gray': '#F7F7F7',
        'brown-available': '#F2EDE9',
        'primary': '#A3806C',
        'brown-lawyerpic': '#D3C7BD',
        'brown-lawyerpic-border': '#BDA592'
      }
    },
    fontFamily: {
      kanit: ['Kanit', 'sans-serif'],
      sarabun: ['Sarabun', 'sans-serif'],
      prompt: ['Prompt', 'sans-serif'],
      mitr: ['Mitr', 'sans-serif']
    },
    gridTemplateColumns: {
      'auto' : 'repeat(auto-fill, minmax(250px,1fr))'
    }
  },
  plugins: [],
}