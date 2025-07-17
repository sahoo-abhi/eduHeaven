/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1", // Indigo color similar to the image but with more vibrancy
        "primary-dark": "#4f46e5",
        dark: "#0f172a",
        surface: "#1e293b",
        card: "#1e1e2f"
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      screens: {
        'xs': '475px',
        '2xs': '375px',
        '3xl': '1680px',
        '4xl': '1920px',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      }
    },
  },
  plugins: [],
}