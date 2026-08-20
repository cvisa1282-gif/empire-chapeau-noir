/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Tokens dérivés du logo "SAMUEL" (fond noir, anneau néon vert/or, rouge fruit).
      // Tout le design lit ces variables : changer les valeurs ici suffit
      // à retexturer tout le site sans toucher au reste du code.
      colors: {
        base: {
          950: "#070707",
          900: "#101210",
          800: "#181C18",
        },
        paper: {
          50: "#FAFAF7",
          100: "#F0F1EA",
        },
        accent: {
          DEFAULT: "#3FE04A",
          soft: "#9CF29F",
        },
        gold: {
          DEFAULT: "#F0C23A",
        },
        ember: {
          DEFAULT: "#E5473A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
};
