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
        'gray': '#F9F9F9',
        'light-gray': '#F7F7F7',
        'brown-available': '#F2EDE9',
        'primary': '#A3806C',
        'brown-lawyerpic': '#D3C7BD',
        'brown-lawyerpic-border': '#BDA592'
      },
      fontFamily: {
        kanit: ['Kanit', 'sans-serif'],
        sarabun: ['Sarabun', 'sans-serif'],
        prompt: ['Prompt', 'sans-serif'],
        mitr: ['Mitr', 'sans-serif']
      },
      gridTemplateColumns: {
        'auto' : 'repeat(auto-fill, minmax(250px,1fr))'
      },
      keyframes: {
        popup: { // animation สำหรับ โชว pop up
          '0%': { 
            opacity: '0',
            transform: 'translateY(100px)' 
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)' 
          }
        },
        popupClose: { // animation สำหรับ ปิด pop up
          '0%': { 
            opacity: '1',
            transform: 'translateY(0)' 
          },
          '100%': { 
            opacity: '0',
            transform: 'translateY(100px)' 
          }
        },
        fadeIn: {  // animation สำหรับเปลี่ยนหน้า
          '0%': {
            opacity: '0',
            transform: 'translateY(100px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        slideDown: {
          '0%': { 
            transform: 'translateY(-10px)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        popupCenter: {  // animation ใหม่สำหรับ popup ที่ขึ้นจากกลางหน้าจอ
          '0%': { 
            opacity: '0',
            transform: 'translate(-50%, -50%) scale(0.8)' 
          },
          '100%': { 
            opacity: '1',
            transform: 'translate(-50%, -50%) scale(1)' 
          }
        }
      },
      animation: {
        popup: 'popup 0.5s ease-out',
        fadeIn: 'fadeIn 0.5s ease-out',
        slideDown: 'slideDown 0.3s ease-out',
        popupClose: 'popupClose 0.5s ease-out ',
        popupCenter: 'popupCenter 0.5s ease-out'
      }
    },
  },
  plugins: [],
}