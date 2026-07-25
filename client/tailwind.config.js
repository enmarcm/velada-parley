/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ring: "#F5A623",
        fondo: "#0B0B0F",
        superficie: "#15151D",
        borde: "#262633",
        texto: "#F5F3EF",
        textoSec: "#8A8A9C",
        vivo: "#F5A623",
        ganado: "#3FB68B",
        descartado: "#C4453B",
        acentoFrio: "#5B8DEF",
      },
      fontFamily: {
        display: ["Anton", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
