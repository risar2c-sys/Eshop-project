import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: "#1F2E22", light: "#2E4131" },
        olive: { DEFAULT: "#6B7259", light: "#8B9276" },
        sand: { DEFAULT: "#F3EDE0", dark: "#E8DFCB" },
        bark: "#4A3527",
        gold: "#B08D57",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      letterSpacing: { label: "0.14em" },
      borderRadius: { organic: "2px 14px 2px 14px" },
    },
  },
  plugins: [],
};
export default config;
