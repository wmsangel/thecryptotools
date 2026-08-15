import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /**
         * Up/down money colours. emerald-500 on white measures 2.53:1 and
         * red-500 3.76:1 — the two colours the site uses to say "you made
         * money" and "you lost money" were the least readable text on it.
         * Themed via CSS vars so each side of the theme gets a shade that
         * actually passes. Direction is never colour alone: ▲/▼ and a sign
         * are always printed too.
         */
        gain: "var(--gain)",
        loss: "var(--loss)",
        brand: {
          /**
           * Accent text colour, themed per surface — see the contrast note in
           * globals.css. Use `text-brand-ink` for links and eyebrows; the
           * numbered shades below are for fills and borders, which are not
           * held to the 4.5:1 text rule.
           */
          ink: "var(--brand-ink)",
          50: "#eefdf5",
          100: "#d6f9e7",
          200: "#b0f1d2",
          300: "#79e4b6",
          400: "#3fce93",
          500: "#16b378",
          600: "#0a9061",
          700: "#0a7350",
          800: "#0c5b41",
          900: "#0b4b37",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      maxWidth: {
        content: "80rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
