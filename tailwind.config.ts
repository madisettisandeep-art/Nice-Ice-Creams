import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: "#FDFBF7",
          100: "#FAF6EE",
          200: "#F3ECE0",
          300: "#E6DAC6",
          400: "#D2BFA0",
        },
        brand: {
          cyan: "#0082D5",
          blue: "#0064B5",
          royal: "#1E3A8A",
          indigo: "#2B2278",
          dark: "#0B0F1E",
        },
        flavour: {
          strawberry: "#E84A6F",
          chocolate: "#3B2014",
          mango: "#F5A623",
          pistachio: "#7BB661",
          blackcurrant: "#6D3FB3",
          caramel: "#D97724",
        },
        cinema: {
          950: "#07090F",
          900: "#0D111C",
          800: "#151C2E",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 14px 36px -10px rgba(27, 34, 64, 0.08), 0 4px 12px -2px rgba(27, 34, 64, 0.04)",
        "card-hover": "0 24px 48px -12px rgba(0, 100, 181, 0.16), 0 8px 20px -4px rgba(27, 34, 64, 0.08)",
        cinema: "0 30px 70px -15px rgba(0, 0, 0, 0.65)",
      },
    },
  },
  plugins: [],
};

export default config;

