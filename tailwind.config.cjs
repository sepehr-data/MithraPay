/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    "MithraFont",
                    "Vazirmatn",
                    "ui-sans-serif",
                    "system-ui",
                    "Segoe UI",
                    "Helvetica",
                    "Arial",
                ],
            },
        },
    },
    plugins: [
        require("daisyui"),
        require("tailwindcss-rtl"),
        require("@tailwindcss/line-clamp"),
    ],
    daisyui: {
        themes: [
            {
                dreamycoffee: {
                    "base-100": "oklch(96.7% 0.003 247.858)",
                    "base-200": "oklch(91.8% 0.007 247.896)",
                    "base-300": "oklch(92% 0.013 255.508)",
                    "base-content": "oklch(20% 0.042 265.755)",

                    primary: "oklch(58.9% 0.182 23.100)",
                    "primary-content": "oklch(98% 0.001 106.423)",

                    secondary: "oklch(57% 0.245 27.325)",
                    "secondary-content": "oklch(97% 0.013 17.38)",

                    accent: "oklch(44% 0.03 256.802)",
                    "accent-content": "oklch(98% 0.002 247.839)",

                    neutral: "oklch(37% 0.044 257.287)",
                    "neutral-content": "oklch(98% 0.003 247.858)",

                    info: "oklch(63.9% 0.110 221.723)",
                    "info-content": "oklch(97% 0.013 236.62)",

                    success: "oklch(71.4% 0.167 149.579)",
                    "success-content": "oklch(98% 0.031 120.757)",

                    warning: "oklch(76% 0.188 70.08)",
                    "warning-content": "oklch(98% 0.022 95.277)",

                    error: "oklch(56.8% 0.237 25.331)",
                    "error-content": "oklch(97% 0.013 17.38)",

                    "--radius-selector": "1rem",
                    "--radius-field": "2rem",
                    "--radius-box": "1rem",
                    "--size-selector": "0.25rem",
                    "--size-field": "0.25rem",
                    "--border": "1px",
                    "--depth": "1",
                    "--noise": "0",
                },
            },
            "light",
            "autumn",
            "garden",
            "emerald",
            "pastel",
        ],
    },
};
