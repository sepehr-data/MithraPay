/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vazirmatn", "ui-sans-serif", "system-ui", "Segoe UI", "Helvetica", "Arial"]
      }
    }
  },
  plugins: [require("daisyui"), require("tailwindcss-rtl")],
  daisyui: {
    themes: [
      {
        accountplus: {
          "primary": "#2563eb",
          "secondary": "#7c3aed",
          "accent": "#06b6d4",
          "neutral": "#1f2937",
          "base-100": "#0b1220",
          "base-200": "#111827",
          "base-300": "#0f172a",
          "info": "#38bdf8",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444"
        }
      },
      "light",
      "autumn"
    ]
  }
}
