/** @type {import('tailwindcss').Config} */

export default {
    future: {
        hoverOnlyWhenSupported: true,
    },
    darkMode: 'class',
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
      "./**/*.html" // 🔥 مهم
    ],
    safelist: [
    'bg-[#131419]',
    ],
    theme: {
        extend: {
            colors: {
                // Light mode off-white palette
                'light-bg': '#f8f9fa',
                'light-card': '#ffffff',
                'light-border': '#e5e7eb',
                // Dark mode palette
                'dark-bg': '#03030b',
                'dark-card': '#131419',
                'dark-border': '#1f2937',
            }
        },
    },
    plugins: [],
}