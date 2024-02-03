/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{jsx,js}"],
  theme: {
    extend: {
      colors: {
        "dark-background": "#0c1317",
        "dark-secondary": "#222e35",
        "dark-primary": "#111A21",
        "dark-active": "#2a3942",
        "dark-input": "#202c33",
      },
    },
  },
  plugins: [],
};
