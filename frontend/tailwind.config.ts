import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "320px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        "imboni-primary": "#312E81",
        "imboni-primary-md": "#4338CA",
        "imboni-primary-lt": "#EEF2FF",
        "imboni-accent": "#10B981",
        "imboni-accent-lt": "#D1FAE5",
        "imboni-warn": "#F59E0B",
        "imboni-warn-lt": "#FEF3C7",
        "imboni-danger": "#EF4444",
        "imboni-danger-lt": "#FEE2E2",
        "imboni-sidebar": "#0F172A",
        "imboni-sidebar-2": "#1E293B",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      spacing: {
        "safe-top": "max(1rem, env(safe-area-inset-top))",
        "safe-bottom": "max(1rem, env(safe-area-inset-bottom))",
        "safe-left": "max(1rem, env(safe-area-inset-left))",
        "safe-right": "max(1rem, env(safe-area-inset-right))",
      },
      animation: {
        "pulse-scale": "pulse-scale 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "pulse-scale": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.06)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
