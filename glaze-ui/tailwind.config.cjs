module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        glaze: {
          black: '#000000',
          surface: '#0a0a0f',
          border: 'rgba(255, 255, 255, 0.08)',
          text: '#f5f7ff',
          muted: '#a1a1aa',
          cyan: '#34d3ff',
          green: '#3cff8f',
          red: '#ff4d6d',
        },
      },
      boxShadow: {
        glass: '0 0 0 1px rgba(255, 255, 255, 0.08), 0 24px 80px rgba(0, 0, 0, 0.45)',
      },
    },
  },
  plugins: [],
};
