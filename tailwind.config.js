/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#e6b740",
          green: "#99af5d",
          blue: "#62a1a9",
          red: "#c83d32",
          dark: "#333333",
          "darken-blue": "#2b595a",
        },
        badge: {
          bronze: "#cd7f32",
          silver: "#c0c0c0",
          gold: "#ffd700",
          platinum: "#e5e4e2",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
