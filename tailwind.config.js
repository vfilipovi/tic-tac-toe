import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "theme-blue": {
          50: "#f1f2ff",
          100: "#e5e6ff",
          200: "#cecfff",
          300: "#a9a7ff",
          400: "#7e75ff",
          500: "#543dff",
          600: "#4016ff",
          700: "#2e04fd",
          800: "#2603d3",
          900: "#2205ad",
          950: "#0f0076",
        },
      },
    },
  },
  plugins: [nextui()],
};
