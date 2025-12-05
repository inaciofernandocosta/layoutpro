/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#29839F',
          dark: '#1e6278',
          light: '#4aaecf',
        },
        sidebar: {
          DEFAULT: '#113540',
          hover: '#1a4b5a',
        },
      },
    },
  },
  plugins: [],
};
