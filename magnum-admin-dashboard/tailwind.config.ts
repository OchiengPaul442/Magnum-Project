import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        teal: {
          "100": "#E6FFFA",
          "300": "#81E6D9",
          "500": "#38B2AC",
          "700": "#2C7A7B",
          "900": "#234E52",
          DEFAULT: "#38B2AC",
        },
        purple: {
          "100": "#E9D8FD",
          "300": "#B794F4",
          "500": "#6D50B1",
          "700": "#553C9A",
          "900": "#322659",
          DEFAULT: "#6D50B1",
        },
        peach: {
          "100": "#FFF5EC",
          "300": "#FFE0B2",
          "500": "#FDECD4",
          "700": "#EFCAB1",
          "900": "#D89F7A",
          DEFAULT: "#FDECD4",
        },
      },
      backgroundImage: {
        "dark-purple-gradient":
          "linear-gradient(106.72deg, #2E224B 2.72%, #6D50B1 94.76%)",
        "light-purple-gradient":
          "linear-gradient(68.05deg, rgba(151, 119, 234, 0.22) 1.1%, rgba(225, 224, 229, 0.05) 98.9%)",
        "slate-blue-gradient":
          "linear-gradient(135deg, #0B1221 0%, #1C2A44 45%, #22335B 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-lato)", "ui-sans-serif", "system-ui"],
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [tailwindAnimate],
};

export default config;
