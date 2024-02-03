/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{jsx,js}"],
  theme: {
    extend: {
      colors: {
        "dark-background": "#0c1317",
        "chat-background": "#0A141B",
        "dark-secondary": "#222e35",
        "dark-primary": "#111A21",
        "dark-active": "#2a3942",
        "dark-input": "#202c33",
        "msg-backround": "#005c4b",
        "incoming-msg-background": "#202c33",
        gray: "#FFFFFF99",
      },
      backgroundImage: {
        gradient: "bg-gradient-to-r from-slate-900 to-slate-700",
      },
    },
  },
  plugins: [],
};
