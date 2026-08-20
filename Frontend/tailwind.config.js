/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern developer tool colors (zinc, slate, dark-gray combinations)
        editor: {
          bg: '#09090b',       // zinc-950
          sidebar: '#18181b',  // zinc-900
          border: '#27272a',   // zinc-800
          active: '#27272a',   // zinc-800
        }
      }
    },
  },
  plugins: [],
}
