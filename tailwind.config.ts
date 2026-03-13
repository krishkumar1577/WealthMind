import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"Geist Mono"', 'monospace'],
      },
      colors: {
        'wealth-black': '#0d0d0d',
        'wealth-off-white': '#f0ece4',
        'wealth-emerald': '#144634',
        'accent-emerald': '#1a4d38',
        'surface-white': 'rgba(255, 255, 255, 0.02)',
        'border-white': 'rgba(255, 255, 255, 0.05)',
      },
      backgroundColor: {
        'surface-white': 'rgba(255, 255, 255, 0.02)',
      },
      borderColor: {
        'white-subtle': 'rgba(255, 255, 255, 0.04)',
        'white-base': 'rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
