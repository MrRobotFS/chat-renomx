/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0EB8C9',
          50: '#E6F9FB',
          100: '#CCF3F7',
          200: '#99E6EE',
          300: '#66DAE6',
          400: '#33CEDD',
          500: '#0EB8C9',
          600: '#0B93A1',
          700: '#086E79',
          800: '#054A50',
          900: '#032528'
        },
        secondary: {
          DEFAULT: '#FCC619',
          50: '#FEF9E6',
          100: '#FEF3CC',
          200: '#FDE799',
          300: '#FDDB66',
          400: '#FCCF33',
          500: '#FCC619',
          600: '#CA9E14',
          700: '#97760F',
          800: '#654F0A',
          900: '#322705'
        },
        tertiary: {
          DEFAULT: '#8CB633',
          50: '#F2F8E9',
          100: '#E5F0D3',
          200: '#CBE1A7',
          300: '#B1D27B',
          400: '#97C34F',
          500: '#8CB633',
          600: '#709229',
          700: '#546D1F',
          800: '#384914',
          900: '#1C240A'
        },
        dark: {
          DEFAULT: '#111828',
          50: '#F8F9FA',
          100: '#F1F3F4',
          200: '#E3E5E8',
          300: '#D4D7DB',
          400: '#C6C9CF',
          500: '#B7BBC2',
          600: '#9BA0A9',
          700: '#7E8590',
          800: '#626A77',
          900: '#111828'
        }
      },
    },
  },
  plugins: [],
}