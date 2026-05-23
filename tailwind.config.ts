import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        campus: {
          50: "#eff7ff",
          100: "#d9ecff",
          500: "#0b77c4",
          600: "#0a5d99",
          700: "#113d7a"
        },
        del: {
          purple: "#3f1e7a"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;