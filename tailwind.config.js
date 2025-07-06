/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Use class-based dark mode
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          25: "#fafafa",
          75: "#f4f4f5",
          750: "#374151",
          775: "#323943",
          825: "#1e293b",
        },
      },
      animation: {
        ripple: "ripple 0.6s linear",
        dropdown: "dropdown 0.2s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "fade-in": "fadeIn 0.2s ease-out",
      },
      keyframes: {
        ripple: {
          "0%": { width: "0px", height: "0px", opacity: 0.5 },
          "100%": { width: "500px", height: "500px", opacity: 0 },
        },
        dropdown: {
          "0%": { transform: "scale(0.95) translateY(-10px)", opacity: 0 },
          "100%": { transform: "scale(1) translateY(0)", opacity: 1 },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
