/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './component/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      keyframes: {
          growY: {
            '0% ': {height: '100px'},
            '100%': {height: "fit-content"}
          }
      } 
    },
  }
}

