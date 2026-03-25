/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
      "./**/*.html" // 🔥 مهم
    ],
    theme: {
        extend: {
        },
    },
    plugins: [],
}