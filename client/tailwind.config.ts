import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}"
  ],
  theme: {
    extend: {
      colors: {
        // semantic colors used in your components (safe defaults)
        background: "#ffffff",
        foreground: "#0f172a",
        border: "#e6eef5",
        input: "#f1f5f9",
        primary: "#0ea5e9",
        accent: "#0369a1",
        "muted-foreground": "#6b7280",
        // sidebar tokens if referenced
        "sidebar-border": "#e6eef5",
        "sidebar-accent": "#0ea5e9",
        "sidebar-accent-foreground": "#022028"
      },
    },
  },
  plugins: [],
};

export default config;
