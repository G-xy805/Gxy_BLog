/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,mjs}"],
  darkMode: "class", // allows toggling dark mode manually
  theme: {
    extend: {
      fontFamily: {
        sans: defaultTheme.fontFamily.sans,
      },
      transitionDuration: {
        '400': '400ms',
      },
      colors: {
        // Winter theme colors with dark mode support
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#FE7AC7',
        },
        secondary: {
          DEFAULT: '#5b21b6',
          dark: '#C890F1',
        },
        'base-content': {
          DEFAULT: '#111827',
          '70': 'rgba(17, 24, 39, 0.7)',
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
}
