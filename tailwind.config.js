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
        sans: ['Arial', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['5.125rem', { lineHeight: '1', letterSpacing: '-0.128rem' }],
        'section': ['3.5rem', { lineHeight: '0.95' }],
        'subsection': ['3rem', { lineHeight: '0.95' }],
        'heading': ['2rem', { lineHeight: '1.15' }],
        'card-title': ['1.875rem', { lineHeight: '1.2' }],
        'feature': ['1.5rem', { lineHeight: '1.33' }],
      },
      boxShadow: {
        'golden': 'rgba(127, 99, 21, 0.12) -8px 16px 39px, rgba(127, 99, 21, 0.10) -33px 64px 72px, rgba(127, 99, 21, 0.06) -73px 144px 97px',
        'golden-sm': 'rgba(127, 99, 21, 0.10) 0px 4px 16px, rgba(127, 99, 21, 0.06) 0px 12px 32px',
      },
      borderRadius: {
        'none': '0',
      },
      backgroundImage: {
        'mistral-gradient': 'linear-gradient(135deg, #ffd900, #ffe295, #ffa110, #ff8105, #fb6424, #fa520f)',
        'sunset-gradient': 'linear-gradient(180deg, #ffa110 0%, #1f1f1f 100%)',
      },
    },
  },
  plugins: [],
};
