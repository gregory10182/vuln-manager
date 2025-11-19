/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Esto busca en TODAS las subcarpetas de src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
