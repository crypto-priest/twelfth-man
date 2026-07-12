import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#212A31",
        "night-2": "#1A2228",
        panel: "#2E3944",
        "panel-2": "#37444F",
        edge: "#46555F",
        "edge-soft": "#D3D9D414",
        pitch: "#124E66",
        "pitch-2": "#1A6E8E",
        "pitch-deep": "#0A2F3F",
        gold: "#82B4CD",
        "gold-2": "#82B4CD",
        "gold-deep": "#124E66",
        live: "#FF3B44",
        chalk: "#D3D9D4",
        grass: "#A9BAC0",
        muted: "#748D92",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        head: ["var(--font-display)"],
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
