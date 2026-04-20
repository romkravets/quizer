/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#fa520f",
          flame: "#fb6424",
          "block-orange": "#ff8105",
          yellow: "#ffd900",
          "gold-pale": "#ffe295",
          dark: "#1f1f1f",
        },
        sunshine: {
          900: "#ff8a00",
          700: "#ffa110",
          500: "#ffb83e",
          300: "#ffd06a",
        },
        surface: {
          ivory: "#fffaeb",
          cream: "#fff0c2",
          white: "#ffffff",
        },
        badge: {
          bronze: "#cd7f32",
          silver: "#c0c0c0",
          gold: "#ffd700",
          platinum: "#e5e4e2",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        display: ["5.125rem", { lineHeight: "1", letterSpacing: "-0.128rem" }],
        section: ["3.5rem", { lineHeight: "0.95" }],
        subsection: ["3rem", { lineHeight: "0.95" }],
        heading: ["2rem", { lineHeight: "1.15" }],
        "card-title": ["1.875rem", { lineHeight: "1.2" }],
        feature: ["1.5rem", { lineHeight: "1.33" }],
      },
      boxShadow: {
        golden:
          "rgba(127, 99, 21, 0.12) -8px 16px 39px, rgba(127, 99, 21, 0.10) -33px 64px 72px, rgba(127, 99, 21, 0.06) -73px 144px 97px",
        "golden-sm":
          "rgba(127, 99, 21, 0.10) 0px 4px 16px, rgba(127, 99, 21, 0.06) 0px 12px 32px",
        "glow-orange":
          "0 0 20px rgba(250, 82, 15, 0.35), 0 0 40px rgba(250, 82, 15, 0.15)",
        "glow-gold":
          "0 0 20px rgba(255, 217, 0, 0.35), 0 0 40px rgba(255, 217, 0, 0.15)",
        "dark-lg": "0 8px 32px rgba(0, 0, 0, 0.4)",
      },
      borderRadius: {
        none: "0",
      },
      backgroundImage: {
        "mistral-gradient":
          "linear-gradient(135deg, #ffd900, #ffe295, #ffa110, #ff8105, #fb6424, #fa520f)",
        "sunset-gradient": "linear-gradient(180deg, #ffa110 0%, #1f1f1f 100%)",
        "fire-gradient": "linear-gradient(90deg, #fa520f 0%, #ffd900 100%)",
        "dark-gradient": "linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(-12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(250, 82, 15, 0.4)" },
          "50%": { boxShadow: "0 0 20px rgba(250, 82, 15, 0.8)" },
        },
        "count-up": {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out forwards",
        "fade-in-slow": "fade-in 0.7s ease-out forwards",
        "slide-in": "slide-in 0.3s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "count-up": "count-up 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
