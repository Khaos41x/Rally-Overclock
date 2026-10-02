/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        panel: "#0a0a0a",
        card: "#1d1d1f",
        edge: "rgba(255,255,255,0.09)",
        soft: "rgba(255,255,255,0.04)",
        muted: "#86868b",
        faint: "#6e6e73",
        accent: "#f5f5f7",
      },
      fontFamily: {
        sans: [
          "Inter",
          "SF Pro Text",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
