import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#050f0a",
        panel: "#0a1a12",
        edge: "#12271c",
        pitch: "#00ff87",
        chalk: "#e9f6ef",
        grass: "#7fa892",
      },
      fontFamily: {
        display: ["var(--font-display)"],
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
