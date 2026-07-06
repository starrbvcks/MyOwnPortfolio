import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#090909",
        carbon: "#0D0D0D",
        pink: {
          DEFAULT: "#FF3B9D",
          strong: "#FF2E88",
          light: "#FFC2DC",
        },
        bone: "#F5F2F3",
        muted: "#9B9699",
      },
      fontFamily: {
        display: ['"DM Sans"', "sans-serif"],
        intro: ['"Syne"', "sans-serif"],
        sans: ['"DM Sans"', "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
      boxShadow: {
        punk: "10px 10px 0 #FF3B9D",
        brutal: "6px 6px 0 #F5F2F3",
      },
      backgroundImage: {
        halftone:
          "radial-gradient(circle at center, rgba(255, 59, 157, 0.38) 0 1px, transparent 1.4px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
