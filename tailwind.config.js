import { heroui } from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: "#F54C7A",
            50: "#FFE5EC",
            100: "#FFB8C9",
            200: "#FF8AA7",
            300: "#FF5D85",
            400: "#F84775",
            500: "#F54C7A",
            600: "#D63C66",
            700: "#B02E52",
            800: "#7C1F39",
            900: "#3D0F1D",
          },
          secondary: {
            DEFAULT: "#0072F5",
            50: "#E6F1FF",
            100: "#C7E0FF",
            200: "#96C8FF",
            300: "#64AEFF",
            400: "#3594FF",
            500: "#0072F5",
            600: "#005FCC",
            700: "#004699",
            800: "#002F66",
            900: "#001733",
          },
          tertiary: {
            DEFAULT: "#B249F8",
            50: "#F4E8FF",
            100: "#E5C9FF",
            200: "#D19EFF",
            300: "#BE73FF",
            400: "#AC54FB",
            500: "#B249F8",
            600: "#923ACB",
            700: "#6F2C99",
            800: "#4B1D66",
            900: "#240E33",
          },
          quaternary: {
            DEFAULT: "#01EADA",
            50: "#D8FFFA",
            100: "#B2FFF4",
            200: "#7CFEEF",
            300: "#47F4E4",
            400: "#1FE8D9",
            500: "#01EADA",
            600: "#00BFB3",
            700: "#008B84",
            800: "#005A56",
            900: "#002E2C",
          },
        }
      },
      dark: {
        colors: {
          primary: {
            DEFAULT: "#F54C7A",

            50: "#3D0F1D",
            100: "#7C1F39",
            200: "#B02E52",
            300: "#D63C66",
            400: "#F54C7A",
            500: "#F84775",
            600: "#FF5D85",
            700: "#FF8AA7",
            800: "#FFB8C9",
            900: "#FFE5EC",
          },
          secondary: {
            DEFAULT: "#0072F5",

            50: "#001733",
            100: "#002F66",
            200: "#004699",
            300: "#005FCC",
            400: "#0072F5",
            500: "#3594FF",
            600: "#64AEFF",
            700: "#96C8FF",
            800: "#C7E0FF",
            900: "#E6F1FF",
          },
          tertiary: {
            DEFAULT: "#B249F8",

            50: "#240E33",
            100: "#4B1D66",
            200: "#6F2C99",
            300: "#923ACB",
            400: "#B249F8",
            500: "#AC54FB",
            600: "#BE73FF",
            700: "#D19EFF",
            800: "#E5C9FF",
            900: "#F4E8FF",
          },
          quaternary: {
            DEFAULT: "#01EADA",

            50: "#002E2C",
            100: "#005A56",
            200: "#008B84",
            300: "#00BFB3",
            400: "#01EADA",
            500: "#1FE8D9",
            600: "#47F4E4",
            700: "#7CFEEF",
            800: "#B2FFF4",
            900: "#D8FFFA",
          },
        }
      }
    }
  })],
}

module.exports = config;