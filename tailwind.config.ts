import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx,html}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // semantic colors your UI uses
        background: "#ffffff",
        foreground: "#0f172a",
        border: "#e6eef5",
        input: "#f1f5f9",
        primary: "#0ea5e9",
        accent: "#0369a1",
        "muted-foreground": "#6b7280",

        // sidebar tokens (found in your grep)
        "sidebar-border": "#e6eef5",
        "sidebar-accent": "#0ea5e9",
        "sidebar-accent-foreground": "#022028",
      },
    },
  },
  plugins: [],
};

export default config;
