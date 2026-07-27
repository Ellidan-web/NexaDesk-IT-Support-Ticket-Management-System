/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nexa-primary': '#4F46E5',
        'nexa-secondary': '#7C3AED',
        'nexa-success': '#10B981',
        'nexa-warning': '#F59E0B',
        'nexa-danger': '#EF4444',
        'nexa-dark': '#1F2937',
      }
    },
  },
  plugins: [],
}