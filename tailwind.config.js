/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './component/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      keyframes: {
          fadeIn : {
            '0%': {opacity : '0'},
            '100%' : {opacity : '1'}
          }
      } 
    },
  }
}

