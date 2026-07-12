import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#05110B",
        "night-2": "#081A12",
        panel: "#0C2419",
        "panel-2": "#0F2E20",
        edge: "#1E4733",
        "edge-soft": "#FFFFFF14",
        pitch: "#37F58C",
        "pitch-2": "#19C56B",
        "pitch-deep": "#0E5C39",
        gold: "#F5C24B",
        "gold-2": "#E0A62E",
        "gold-deep": "#6B4E17",
        live: "#FF3B44",
        chalk: "#EAF6EF",
        grass: "#A9CBB9",
        muted: "#6E9683",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        head: ["var(--font-head)"],
        sans: ["var(--font-body)"],
      },
      keyframes: {
        "slide-up": {
          from: {
            opacity: "0",
            transform: "perspective(900px) translateY(18px) rotateX(7deg) scale(0.97)",
          },
          to: {
            opacity: "1",
            transform: "perspective(900px) translateY(0) rotateX(0) scale(1)",
          },
        },
        "ticker-in": {
          from: {
            opacity: "0",
            transform: "perspective(700px) translateX(22px) rotateY(-8deg)",
          },
          to: {
            opacity: "1",
            transform: "perspective(700px) translateX(0) rotateY(0)",
          },
        },
        "score-pop": {
          from: { opacity: "0", transform: "scale(1.45)", filter: "blur(3px)" },
          to: { opacity: "1", transform: "scale(1)", filter: "blur(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "100%": { transform: "scale(2.6)", opacity: "0" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "ticker-in": "ticker-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "score-pop": "score-pop 0.45s cubic-bezier(0.16, 1, 0.3, 1.1) both",
        "pulse-ring": "pulse-ring 1.6s cubic-bezier(0, 0.6, 0.4, 1) infinite",
        shimmer: "shimmer 1.8s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
