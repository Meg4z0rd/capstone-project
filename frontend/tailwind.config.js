/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#E6F1FB',
          DEFAULT: '#378ADD',
          dark: '#185FA5',
        },
        neutral: {
          50: '#F8F9FA',
          200: '#D3D1C7',
          400: '#888780',
          900: '#2C2C2A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        pill: '999px',
      },
    },
  },
  plugins: [],
};
