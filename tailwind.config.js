/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fcf2f2',
          100: '#f9e0e0',
          200: '#f3c6c6',
          300: '#e99d9d',
          400: '#db6b6b',
          500: '#ce4242',
          600: '#c02e2e',
          700: '#a12222',
          800: '#4c0000',
          900: '#3a0000',
          950: '#1f0000',
        },
        secondary: {
          50: '#FFF6C6',
          100: '#fff3b8',
          200: '#ffed94',
          300: '#ffe46b',
          400: '#ffd83d',
          500: '#ffc80a',
          600: '#e0a800',
          700: '#b38000',
          800: '#8a6400',
          900: '#664a00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'skeleton': 'skeleton 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        skeleton: {
          '0%': { opacity: '0.5' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
