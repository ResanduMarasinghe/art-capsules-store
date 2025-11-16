/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0F172A',
        pearl: '#F8FAFC',
        blush: '#FCD9D6',
        aurora: '#8B5CF6',
        mist: '#94A3B8',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        frame: '0 20px 50px -25px rgba(15, 23, 42, 0.45)',
      },
    },
  },
  plugins: [],
}

