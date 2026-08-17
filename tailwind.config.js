/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        'primary-light': 'var(--color-primary-light)',
        accent: 'var(--color-accent)',
        'accent-dark': 'var(--color-accent-dark)',
        'accent-light': 'var(--color-accent-light)',
        dark: 'var(--color-dark)',
        'dark-2': 'var(--color-dark-2)',
        'dark-3': 'var(--color-dark-3)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        sans: ['Inter', '"Open Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
