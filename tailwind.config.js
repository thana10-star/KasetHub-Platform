/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        kaset: {
          ink: '#123226',
          deep: '#0F5A3D',
          leaf: '#23A36B',
          mint: '#E7F6ED',
          mist: '#F5FBF7',
          gold: '#DFA640',
          earth: '#8A5C37',
          sky: '#EAF4FF',
          rose: '#FFF0ED',
        },
      },
      boxShadow: {
        card: '0 18px 45px rgba(15, 90, 61, 0.09)',
        soft: '0 10px 30px rgba(18, 50, 38, 0.08)',
      },
      fontFamily: {
        sans: [
          'Noto Sans Thai',
          'Sarabun',
          'Th Sarabun New',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
