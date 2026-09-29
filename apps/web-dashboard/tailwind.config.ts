import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        workshop: {
          dark: "#080b11",
          card: "#0f172a",
          surface: "#1e293b",
          border: "#334155",
          cyan: "#00f5ff",
          amber: "#f59e0b",
          emerald: "#10b981",
          rose: "#f43f5e",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px -3px rgba(0, 245, 255, 0.35)',
        'neon-amber': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'neon-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
      }
    },
  },
  plugins: [],
};
export default config;
