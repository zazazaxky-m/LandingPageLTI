import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#050505",
          900: "#0c0d0e",
          850: "#121416",
          800: "#191b1e"
        },
        lumen: {
          500: "#ff6a00",
          400: "#ff9d2f",
          300: "#f5c15c"
        }
      },
      borderRadius: {
        ui: "8px"
      },
      boxShadow: {
        glow: "0 0 30px rgba(255, 106, 0, 0.25)",
        panel: "0 18px 60px rgba(0, 0, 0, 0.38)"
      },
      maxWidth: {
        page: "1180px"
      }
    }
  },
  plugins: []
};

export default config;
